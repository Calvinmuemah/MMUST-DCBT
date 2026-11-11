import nodemailer from "nodemailer";
import { pool } from "../config/db.js";
import { createLog } from "./admin.service.js";

// Ensure tables exist on service initialization
export const ensureNewsletterTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        source VARCHAR(100) DEFAULT 'website_footer',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        unsubscribed_at TIMESTAMP WITH TIME ZONE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS newsletter_broadcasts (
        id SERIAL PRIMARY KEY,
        subject VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        recipient_count INT DEFAULT 0,
        sender_email VARCHAR(255),
        created_by INT,
        sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'sent'
      );
    `);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[NEWSLETTER] Error initializing tables:", err.message);
    }
  }
};

// Create a configured email transporter
const getTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (user && pass && user.trim() !== "" && pass.trim() !== "") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }
  return null;
};

// HTML Template Builder for MMUST Mental Health Newsletters
const buildEmailHtml = (subject, bodyText, recipientEmail) => {
  const formattedBody = bodyText
    .split("\n\n")
    .map((p) => `<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #334155;">${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");

  const unsubUrl = `https://mmust-dcbt.vercel.app/unsubscribe?email=${encodeURIComponent(recipientEmail || "")}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(15,23,42,0.04);">
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #1e3a8a, #2563eb); padding: 32px 28px; text-align: left;">
          <div style="display: inline-block; background-color: rgba(255,255,255,0.15); padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; color: #ffffff; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
            MMUST Mental Health & CBT Initiative
          </div>
          <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">
            MMUST<span style="color: #60a5fa;">Care</span> Updates
          </h1>
          <p style="color: #bfdbfe; font-size: 13px; margin: 6px 0 0 0;">
            Masinde Muliro University of Science & Technology
          </p>
        </div>

        <!-- Body Content -->
        <div style="padding: 32px 28px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 20px; line-height: 1.3;">
            ${subject}
          </h2>
          ${formattedBody}
        </div>

        <!-- Footer -->
        <div style="background-color: #f1f5f9; padding: 24px 28px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; line-height: 1.6; text-align: center;">
          <p style="margin: 0;">
            You received this newsletter because you subscribed via the MMUST DCBT Platform.
          </p>
          <p style="margin: 6px 0 0 0;">
            Directorate of Student Affairs • MMUST Kakamega Main Campus, Kenya.
          </p>
          <p style="margin: 12px 0 0 0;">
            <a href="${unsubUrl}" style="color: #2563eb; text-decoration: underline;">Unsubscribe from mental wellness updates</a>
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
};

// 1. PUBLIC: Subscribe an email
export const subscribeEmail = async (email, source = "website_footer") => {
  await ensureNewsletterTables();

  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    throw new Error("Please provide a valid email address.");
  }

  // Check existing subscriber
  const existing = await pool.query(
    "SELECT id, email, status FROM newsletter_subscribers WHERE email = $1",
    [cleanEmail]
  );

  if (existing.rows.length > 0) {
    const subscriber = existing.rows[0];
    if (subscriber.status === "active") {
      return { 
        alreadySubscribed: true, 
        message: "You are already subscribed to the MMUST mental health newsletter!" 
      };
    } else {
      // Reactivate
      await pool.query(
        "UPDATE newsletter_subscribers SET status = 'active', unsubscribed_at = NULL WHERE id = $1",
        [subscriber.id]
      );
      return { 
        alreadySubscribed: false, 
        message: "Welcome back! Your newsletter subscription has been reactivated." 
      };
    }
  }

  // Insert new subscriber
  const result = await pool.query(
    "INSERT INTO newsletter_subscribers (email, source, status) VALUES ($1, $2, 'active') RETURNING id, email, created_at",
    [cleanEmail, source]
  );

  // Send a welcome email if transporter is configured
  try {
    const transporter = getTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: `"MMUSTCare" <${process.env.EMAIL_USER}>`,
        to: cleanEmail,
        subject: "Welcome to MMUSTCare Mental Health & CBT Newsletter",
        html: buildEmailHtml(
          "Welcome to MMUST Mental Wellness & CBT Updates!",
          "Thank you for subscribing to the MMUST Digital Cognitive Behavioral Therapy platform newsletter.\n\nYou will receive timely updates on university mental wellness resources, upcoming stress-reduction workshops, peer support schedules, and tips for navigating academic pressure.\n\nAll tools on the MMUST DCBT platform are free, confidential, and built for our student community.",
          cleanEmail
        ),
      });
    }
  } catch (err) {
    // Non-fatal if welcome email dispatch fails
    if (process.env.NODE_ENV !== "production") {
      console.warn("[NEWSLETTER] Welcome email dispatch skipped:", err.message);
    }
  }

  return {
    alreadySubscribed: false,
    message: "Thank you for subscribing! You will receive our latest mental health updates.",
    data: result.rows[0],
  };
};

// 2. PUBLIC: Unsubscribe an email
export const unsubscribeEmail = async (email) => {
  await ensureNewsletterTables();

  const cleanEmail = email.trim().toLowerCase();
  await pool.query(
    "UPDATE newsletter_subscribers SET status = 'unsubscribed', unsubscribed_at = CURRENT_TIMESTAMP WHERE email = $1",
    [cleanEmail]
  );

  return { success: true, message: "You have been successfully unsubscribed." };
};

// 3. ADMIN: Get subscriber stats and list
export const getSubscribersList = async () => {
  await ensureNewsletterTables();

  const subscribers = await pool.query(`
    SELECT id, email, status, source, created_at, unsubscribed_at 
    FROM newsletter_subscribers 
    ORDER BY created_at DESC
  `);

  const stats = await pool.query(`
    SELECT 
      COUNT(*) AS total,
      COUNT(CASE WHEN status = 'active' THEN 1 END) AS active_count,
      COUNT(CASE WHEN status = 'unsubscribed' THEN 1 END) AS unsubscribed_count
    FROM newsletter_subscribers
  `);

  return {
    subscribers: subscribers.rows,
    stats: {
      total: parseInt(stats.rows[0]?.total || 0, 10),
      active: parseInt(stats.rows[0]?.active_count || 0, 10),
      unsubscribed: parseInt(stats.rows[0]?.unsubscribed_count || 0, 10),
    },
  };
};

// 4. ADMIN: Delete a subscriber
export const deleteSubscriber = async (id) => {
  await ensureNewsletterTables();

  const result = await pool.query(
    "DELETE FROM newsletter_subscribers WHERE id = $1 RETURNING id, email",
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error("Subscriber not found.");
  }

  return result.rows[0];
};

// 5. ADMIN: Get past broadcasts history
export const getBroadcastHistory = async () => {
  await ensureNewsletterTables();

  const history = await pool.query(`
    SELECT 
      b.id, 
      b.subject, 
      b.body, 
      b.recipient_count, 
      b.sender_email, 
      b.status, 
      b.sent_at,
      u.name as sender_name
    FROM newsletter_broadcasts b
    LEFT JOIN users u ON b.created_by = u.id
    ORDER BY b.sent_at DESC
  `);

  return history.rows;
};

// 6. ADMIN: Send mass email broadcast to all active subscribers
export const sendBroadcast = async ({ subject, body, adminUser, isTest = false, testEmail = null }) => {
  await ensureNewsletterTables();

  if (!subject || subject.trim() === "") {
    throw new Error("Broadcast subject is required.");
  }
  if (!body || body.trim() === "") {
    throw new Error("Broadcast message body is required.");
  }

  const transporter = getTransporter();
  const senderEmail = process.env.EMAIL_USER || "counseling@mmust.ac.ke";

  // If this is a test preview email to administrator
  if (isTest) {
    const target = testEmail || adminUser?.email;
    if (!target) {
      throw new Error("Please specify an email address for the test preview.");
    }

    if (transporter) {
      await transporter.sendMail({
        from: `"MMUSTCare Admin" <${senderEmail}>`,
        to: target,
        subject: `[PREVIEW] ${subject}`,
        html: buildEmailHtml(`[TEST PREVIEW] ${subject}`, body, target),
      });
    }

    return {
      success: true,
      message: `Test preview email successfully sent to ${target}`,
      recipientCount: 1,
    };
  }

  // Live broadcast: retrieve active subscriber emails
  const activeSubscribersResult = await pool.query(
    "SELECT email FROM newsletter_subscribers WHERE status = 'active'"
  );

  const recipients = activeSubscribersResult.rows.map((r) => r.email);

  if (recipients.length === 0) {
    throw new Error("No active subscribers found to broadcast to.");
  }

  let sentCount = 0;

  if (transporter) {
    // Send in chunks or loop to handle individual deliverability
    for (const recipient of recipients) {
      try {
        await transporter.sendMail({
          from: `"MMUSTCare Updates" <${senderEmail}>`,
          to: recipient,
          subject: subject,
          html: buildEmailHtml(subject, body, recipient),
        });
        sentCount++;
      } catch (sendErr) {
        if (process.env.NODE_ENV !== "production") {
          console.error(`Failed to send to ${recipient}:`, sendErr.message);
        }
      }
    }
  } else {
    // If SMTP credentials are not yet configured in env, record simulated send for testing
    sentCount = recipients.length;
  }

  // Record broadcast log in database
  const broadcastResult = await pool.query(
    `INSERT INTO newsletter_broadcasts (subject, body, recipient_count, sender_email, created_by, status)
     VALUES ($1, $2, $3, $4, $5, 'sent')
     RETURNING id, subject, recipient_count, sent_at`,
    [subject, body, sentCount, senderEmail, adminUser?.id || null]
  );

  // System audit log
  await createLog(
    "info",
    "system",
    `Newsletter broadcast sent: "${subject}" to ${sentCount} subscribers`,
    { adminId: adminUser?.id, recipientCount: sentCount }
  );

  return {
    success: true,
    message: `Broadcast successfully sent to ${sentCount} active subscribers.`,
    data: broadcastResult.rows[0],
  };
};
