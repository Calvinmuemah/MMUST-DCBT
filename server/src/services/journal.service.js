import { pool } from "../config/db.js";
import { generatePublicId } from "../utils/ids.js";

const normalizeMood = (mood) => {
  if (!mood) {
    return "Calm";
  }

  return String(mood).trim();
};

const makeJournalTitle = (content) => {
  const words = String(content || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5);

  return words.length > 0 ? words.join(" ") : null;
};

const resolveJournalEntryId = async (entryIdentifier, userId) => {
  if (typeof entryIdentifier === "string" && entryIdentifier.includes("-")) {
    const result = await pool.query(
      `SELECT id
       FROM journal_entries
       WHERE public_id = $1
       AND user_id = $2
       LIMIT 1`,
      [entryIdentifier, userId]
    );

    return result.rowCount > 0 ? result.rows[0].id : null;
  }

  const numericId = Number(entryIdentifier);
  return Number.isInteger(numericId) ? numericId : null;
};

const isMissingJournalTableError = (error) => {
  return error?.code === "42P01" || error?.code === "42703";
};

const getUserSnapshot = async (userId) => {
  const result = await pool.query(
    `SELECT id, public_id, name, email,
            onboarding_answers, onboarding_total_score, onboarding_risk_level,
            onboarding_completed, onboarding_completed_at
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [userId]
  );

  const user = result.rows[0];

  if (!user) {
    return null;
  }

  const dailyAssessmentResult = await pool.query(
    `SELECT id, stress_level, main_challenge, overwhelm_frequency,
            answers, total_score, risk_level, assessment_date, created_at
     FROM daily_assessments
     WHERE user_id = $1
     ORDER BY assessment_date DESC, created_at DESC
     LIMIT 1`,
    [userId]
  );

  const dailyAssessment = dailyAssessmentResult.rows[0] || null;

  return {
    id: user.public_id || user.id,
    name: user.name,
    email: user.email,
    onboardingCompleted: Boolean(user.onboarding_completed),
    onboardingCompletedAt: user.onboarding_completed_at || null,
    onboardingAnswers: user.onboarding_answers || null,
    onboardingTotalScore: user.onboarding_total_score || null,
    onboardingRiskLevel: user.onboarding_risk_level || null,
    dailyAssessment: dailyAssessment
      ? {
          id: dailyAssessment.id,
          stressLevel: dailyAssessment.stress_level,
          mainChallenge: dailyAssessment.main_challenge,
          overwhelmFrequency: dailyAssessment.overwhelm_frequency,
          answers: dailyAssessment.answers || null,
          totalScore: dailyAssessment.total_score,
          riskLevel: dailyAssessment.risk_level,
          assessmentDate: dailyAssessment.assessment_date,
          createdAt: dailyAssessment.created_at,
        }
      : null,
  };
};

const getChatHistory = async (userId) => {
  let sessionsResult;

  try {
    sessionsResult = await pool.query(
      `SELECT id, public_id, topic, created_at
       FROM chat_sessions
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
  } catch (error) {
    if (isMissingJournalTableError(error)) {
      return [];
    }

    throw error;
  }

  const sessions = [];

  for (const session of sessionsResult.rows) {
    let messagesResult;

    try {
      messagesResult = await pool.query(
        `SELECT sender, message, created_at
         FROM chat_messages
         WHERE session_id = $1
         ORDER BY created_at ASC`,
        [session.id]
      );
    } catch (error) {
      if (isMissingJournalTableError(error)) {
        messagesResult = { rows: [] };
      } else {
        throw error;
      }
    }

    sessions.push({
      id: session.public_id || session.id,
      topic: session.topic,
      createdAt: session.created_at,
      messages: messagesResult.rows.map((message) => ({
        sender: message.sender,
        message: message.message,
        createdAt: message.created_at,
      })),
    });
  }

  return sessions;
};

const getFilterWindow = (filter) => {
  const normalized = ["weekly", "monthly", "yearly"].includes(filter)
    ? filter
    : "weekly";

  if (normalized === "weekly") {
    return {
      filter: normalized,
      sqlInterval: "6 days",
      buckets: 7,
      kind: "day",
    };
  }

  if (normalized === "monthly") {
    return {
      filter: normalized,
      sqlInterval: "12 weeks",
      buckets: 4,
      kind: "week",
    };
  }

  return {
    filter: normalized,
    sqlInterval: "11 months",
    buckets: 12,
    kind: "month",
  };
};

const fillDailySeries = (rows, bucketsBack) => {
  const counts = new Map(
    rows.map((row) => [new Date(row.day).toISOString().slice(0, 10), Number(row.count)])
  );

  const series = [];
  const today = new Date();

  for (let index = bucketsBack - 1; index >= 0; index -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - index);

    const key = date.toISOString().slice(0, 10);

    series.push({
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: counts.get(key) || 0,
      date: key,
    });
  }

  return series;
};

const fillWeekSeries = (rows, weeksBack) => {
  const counts = new Map(
    rows.map((row) => [new Date(row.bucket).toISOString().slice(0, 10), Number(row.count)])
  );

  const series = [];
  const today = new Date();

  for (let index = weeksBack - 1; index >= 0; index -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - index * 7);

    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const key = startOfWeek.toISOString().slice(0, 10);

    series.push({
      label: startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: counts.get(key) || 0,
      date: key,
    });
  }

  return series;
};

const fillMonthSeries = (rows, monthsBack) => {
  const counts = new Map(
    rows.map((row) => [new Date(row.bucket).toISOString().slice(0, 7), Number(row.count)])
  );

  const series = [];
  const current = new Date();

  for (let index = monthsBack - 1; index >= 0; index -= 1) {
    const date = new Date(current.getFullYear(), current.getMonth() - index, 1);
    const key = date.toISOString().slice(0, 7);

    series.push({
      label: date.toLocaleDateString("en-US", { month: "short" }),
      value: counts.get(key) || 0,
      date: key,
    });
  }

  return series;
};

const buildTimeline = async (userId, filter) => {
  const window = getFilterWindow(filter);
  const { filter: normalizedFilter, sqlInterval, buckets, kind } = window;

  let timeline = [];

  if (kind === "day") {
    try {
      const result = await pool.query(
        `SELECT DATE(bucket_date) AS day, SUM(count)::int AS count
         FROM (
           SELECT created_at::date AS bucket_date, COUNT(*)::int AS count
           FROM user_login_events
           WHERE user_id = $1
           AND created_at >= NOW() - INTERVAL '${sqlInterval}'
           GROUP BY created_at::date

           UNION ALL

           SELECT cm.created_at::date AS bucket_date, COUNT(*)::int AS count
           FROM chat_messages cm
           INNER JOIN chat_sessions cs ON cs.id = cm.session_id
           WHERE cs.user_id = $1
           AND cm.created_at >= NOW() - INTERVAL '${sqlInterval}'
           GROUP BY cm.created_at::date

           UNION ALL

           SELECT created_at::date AS bucket_date, COUNT(*)::int AS count
           FROM journal_entries
           WHERE user_id = $1
           AND created_at >= NOW() - INTERVAL '${sqlInterval}'
           GROUP BY created_at::date
         ) activity
         GROUP BY DATE(bucket_date)
         ORDER BY day ASC`,
        [userId]
      );

      timeline = fillDailySeries(result.rows, buckets);
    } catch (error) {
      if (!isMissingJournalTableError(error)) {
        throw error;
      }
    }
  } else if (kind === "week") {
    try {
      const result = await pool.query(
        `SELECT DATE_TRUNC('week', bucket_date)::date AS bucket, SUM(count)::int AS count
         FROM (
           SELECT created_at::date AS bucket_date, COUNT(*)::int AS count
           FROM user_login_events
           WHERE user_id = $1
           AND created_at >= NOW() - INTERVAL '${sqlInterval}'
           GROUP BY created_at::date

           UNION ALL

           SELECT cm.created_at::date AS bucket_date, COUNT(*)::int AS count
           FROM chat_messages cm
           INNER JOIN chat_sessions cs ON cs.id = cm.session_id
           WHERE cs.user_id = $1
           AND cm.created_at >= NOW() - INTERVAL '${sqlInterval}'
           GROUP BY cm.created_at::date

           UNION ALL

           SELECT created_at::date AS bucket_date, COUNT(*)::int AS count
           FROM journal_entries
           WHERE user_id = $1
           AND created_at >= NOW() - INTERVAL '${sqlInterval}'
           GROUP BY created_at::date
         ) activity
         GROUP BY DATE_TRUNC('week', bucket_date)::date
         ORDER BY bucket ASC`,
        [userId]
      );

      timeline = fillWeekSeries(result.rows, buckets);
    } catch (error) {
      if (!isMissingJournalTableError(error)) {
        throw error;
      }
    }
  } else {
    try {
      const result = await pool.query(
        `SELECT DATE_TRUNC('month', bucket_date)::date AS bucket, SUM(count)::int AS count
         FROM (
           SELECT created_at::date AS bucket_date, COUNT(*)::int AS count
           FROM user_login_events
           WHERE user_id = $1
           AND created_at >= NOW() - INTERVAL '${sqlInterval}'
           GROUP BY created_at::date

           UNION ALL

           SELECT cm.created_at::date AS bucket_date, COUNT(*)::int AS count
           FROM chat_messages cm
           INNER JOIN chat_sessions cs ON cs.id = cm.session_id
           WHERE cs.user_id = $1
           AND cm.created_at >= NOW() - INTERVAL '${sqlInterval}'
           GROUP BY cm.created_at::date

           UNION ALL

           SELECT created_at::date AS bucket_date, COUNT(*)::int AS count
           FROM journal_entries
           WHERE user_id = $1
           AND created_at >= NOW() - INTERVAL '${sqlInterval}'
           GROUP BY created_at::date
         ) activity
         GROUP BY DATE_TRUNC('month', bucket_date)::date
         ORDER BY bucket ASC`,
        [userId]
      );

      timeline = fillMonthSeries(result.rows, buckets);
    } catch (error) {
      if (!isMissingJournalTableError(error)) {
        throw error;
      }
    }
  }

  return {
    filter: normalizedFilter,
    timeline,
  };
};

const getAttendanceSummary = async (userId) => {
  let loginCount = { rows: [{ total: 0 }] };
  let chatCount = { rows: [{ total: 0 }] };
  let journalCount = { rows: [{ total: 0 }] };
  let activeDays = { rows: [{ total: 0 }] };

  try {
    loginCount = await pool.query(
      `SELECT COUNT(*)::int AS total
       FROM user_login_events
       WHERE user_id = $1`,
      [userId]
    );
  } catch (error) {
    if (!isMissingJournalTableError(error)) {
      throw error;
    }
  }

  try {
    chatCount = await pool.query(
      `SELECT COUNT(*)::int AS total
       FROM chat_messages cm
       INNER JOIN chat_sessions cs ON cs.id = cm.session_id
       WHERE cs.user_id = $1`,
      [userId]
    );
  } catch (error) {
    if (!isMissingJournalTableError(error)) {
      throw error;
    }
  }

  try {
    journalCount = await pool.query(
      `SELECT COUNT(*)::int AS total
       FROM journal_entries
       WHERE user_id = $1`,
      [userId]
    );
  } catch (error) {
    if (!isMissingJournalTableError(error)) {
      throw error;
    }
  }

  try {
    activeDays = await pool.query(
      `SELECT COUNT(DISTINCT day)::int AS total
       FROM (
         SELECT created_at::date AS day FROM user_login_events WHERE user_id = $1
         UNION
         SELECT cm.created_at::date AS day
         FROM chat_messages cm
         INNER JOIN chat_sessions cs ON cs.id = cm.session_id
         WHERE cs.user_id = $1
         UNION
         SELECT created_at::date AS day FROM journal_entries WHERE user_id = $1
       ) activity_days`,
      [userId]
    );
  } catch (error) {
    if (!isMissingJournalTableError(error)) {
      throw error;
    }
  }

  return {
    loginCount: loginCount.rows[0]?.total || 0,
    chatCount: chatCount.rows[0]?.total || 0,
    journalCount: journalCount.rows[0]?.total || 0,
    activeDays: activeDays.rows[0]?.total || 0,
  };
};

export const createJournalEntry = async (userId, data) => {
  const content = String(data?.content || "").trim();
  const mood = normalizeMood(data?.mood);
  const title = data?.title ? String(data.title).trim() : makeJournalTitle(content);

  if (!content) {
    throw new Error("Content is required");
  }

  const inserted = await pool.query(
    `INSERT INTO journal_entries (user_id, title, content, mood)
     VALUES ($1, $2, $3, $4)
     RETURNING id, public_id, user_id, title, content, mood, insight, created_at, updated_at`,
    [userId, title, content, mood]
  );

  const entry = inserted.rows[0];
  const publicId = generatePublicId(`journal:${entry.id}:${userId}:${entry.created_at}`);

  await pool.query(
    `UPDATE journal_entries
     SET public_id = $1
     WHERE id = $2`,
    [publicId, entry.id]
  );

  return {
    id: publicId,
    userId: entry.user_id,
    title: entry.title,
    content: entry.content,
    mood: entry.mood,
    insight: entry.insight,
    createdAt: entry.created_at,
    updatedAt: entry.updated_at,
  };
};

export const listJournalEntries = async (userId, limit = 50, offset = 0) => {
  const safeLimit = Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : 50;
  const safeOffset = Number.isInteger(offset) && offset >= 0 ? offset : 0;

  const result = await pool.query(
    `SELECT id, public_id, title, content, mood, insight, created_at, updated_at
     FROM journal_entries
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, safeLimit, safeOffset]
  );

  return result.rows.map((entry) => ({
    id: entry.public_id || entry.id,
    title: entry.title,
    content: entry.content,
    mood: entry.mood,
    insight: entry.insight,
    createdAt: entry.created_at,
    updatedAt: entry.updated_at,
  }));
};

export const getJournalEntry = async (userId, entryIdentifier) => {
  const resolvedId = await resolveJournalEntryId(entryIdentifier, userId);

  if (!resolvedId) {
    return null;
  }

  const result = await pool.query(
    `SELECT id, public_id, title, content, mood, insight, created_at, updated_at
     FROM journal_entries
     WHERE id = $1
     AND user_id = $2
     LIMIT 1`,
    [resolvedId, userId]
  );

  const entry = result.rows[0];

  if (!entry) {
    return null;
  }

  return {
    id: entry.public_id || entry.id,
    title: entry.title,
    content: entry.content,
    mood: entry.mood,
    insight: entry.insight,
    createdAt: entry.created_at,
    updatedAt: entry.updated_at,
  };
};

export const updateJournalEntry = async (userId, entryIdentifier, data) => {
  const resolvedId = await resolveJournalEntryId(entryIdentifier, userId);

  if (!resolvedId) {
    return null;
  }

  const content = data?.content !== undefined ? String(data.content).trim() : undefined;
  const mood = data?.mood !== undefined ? normalizeMood(data.mood) : undefined;
  const title = data?.title !== undefined
    ? (String(data.title).trim() || null)
    : undefined;

  const existing = await pool.query(
    `SELECT id, title, content, mood, insight
     FROM journal_entries
     WHERE id = $1
     AND user_id = $2
     LIMIT 1`,
    [resolvedId, userId]
  );

  if (existing.rowCount === 0) {
    return null;
  }

  const current = existing.rows[0];

  const nextTitle = title !== undefined ? title : current.title;
  const nextContent = content !== undefined ? content : current.content;
  const nextMood = mood !== undefined ? mood : current.mood;

  if (!nextContent || !String(nextContent).trim()) {
    throw new Error("Content is required");
  }

  const result = await pool.query(
    `UPDATE journal_entries
     SET title = $1,
         content = $2,
         mood = $3
     WHERE id = $4
     AND user_id = $5
     RETURNING id, public_id, title, content, mood, insight, created_at, updated_at`,
    [nextTitle, nextContent, nextMood, resolvedId, userId]
  );

  const entry = result.rows[0];

  return {
    id: entry.public_id || entry.id,
    title: entry.title,
    content: entry.content,
    mood: entry.mood,
    insight: entry.insight,
    createdAt: entry.created_at,
    updatedAt: entry.updated_at,
  };
};

export const deleteJournalEntry = async (userId, entryIdentifier) => {
  const resolvedId = await resolveJournalEntryId(entryIdentifier, userId);

  if (!resolvedId) {
    return false;
  }

  const result = await pool.query(
    `DELETE FROM journal_entries
     WHERE id = $1
     AND user_id = $2`,
    [resolvedId, userId]
  );

  return result.rowCount > 0;
};

export const getJournalReports = async (userId, filter = "weekly") => {
  const { filter: normalizedFilter, timeline } = await buildTimeline(userId, filter);

  const moodResult = await pool.query(
    `SELECT mood, COUNT(*)::int AS count
     FROM journal_entries
     WHERE user_id = $1
     GROUP BY mood
     ORDER BY count DESC, mood ASC`,
    [userId]
  );

  const totalsResult = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM journal_entries
     WHERE user_id = $1`,
    [userId]
  );

  const latestResult = await pool.query(
    `SELECT id, public_id, title, content, mood, insight, created_at, updated_at
     FROM journal_entries
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId]
  );

  const attendance = await getAttendanceSummary(userId);

  return {
    filter: normalizedFilter,
    totalEntries: totalsResult.rows[0]?.total || 0,
    attendance: {
      ...attendance,
      totalActivity: attendance.loginCount + attendance.chatCount + attendance.journalCount,
    },
    moodBreakdown: moodResult.rows.map((row) => ({
      mood: row.mood,
      count: Number(row.count),
    })),
    timeline,
    latestEntry: latestResult.rows[0]
      ? {
          id: latestResult.rows[0].public_id || latestResult.rows[0].id,
          title: latestResult.rows[0].title,
          content: latestResult.rows[0].content,
          mood: latestResult.rows[0].mood,
          insight: latestResult.rows[0].insight,
          createdAt: latestResult.rows[0].created_at,
          updatedAt: latestResult.rows[0].updated_at,
        }
      : null,
  };
};

export const getJournalDashboard = async (userId, filter = "weekly") => {
  const [profile, reports, journalEntries, chatHistory] = await Promise.all([
    getUserSnapshot(userId),
    getJournalReports(userId, filter),
    listJournalEntries(userId, 50, 0),
    getChatHistory(userId),
  ]);

  return {
    profile,
    reports,
    journalEntries,
    chatHistory,
  };
};
