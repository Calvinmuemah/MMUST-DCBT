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

  if (words.length === 0) {
    return null;
  }

  return words.join(" ");
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

const fillWeekSeries = (rows, bucketsBack) => {
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

export const getJournalReports = async (userId, filter = "weekly") => {
  const normalizedFilter = ["weekly", "monthly", "yearly"].includes(filter)
    ? filter
    : "weekly";

  const moodResult = await pool.query(
    `SELECT mood, COUNT(*)::int AS count
     FROM journal_entries
     WHERE user_id = $1
     GROUP BY mood
     ORDER BY count DESC, mood ASC`,
    [userId]
  );

  let timeline = [];

  if (normalizedFilter === "weekly") {
    const result = await pool.query(
      `SELECT DATE(created_at) AS day, COUNT(*)::int AS count
       FROM journal_entries
       WHERE user_id = $1
       AND created_at >= NOW() - INTERVAL '6 days'
       GROUP BY DATE(created_at)
       ORDER BY day ASC`,
      [userId]
    );

    timeline = fillDailySeries(result.rows, 7);
  } else if (normalizedFilter === "monthly") {
    const result = await pool.query(
      `SELECT DATE_TRUNC('week', created_at)::date AS bucket, COUNT(*)::int AS count
       FROM journal_entries
       WHERE user_id = $1
       AND created_at >= NOW() - INTERVAL '12 weeks'
       GROUP BY bucket
       ORDER BY bucket ASC`,
      [userId]
    );

    timeline = fillWeekSeries(result.rows, 4);
  } else {
    const result = await pool.query(
      `SELECT DATE_TRUNC('month', created_at)::date AS bucket, COUNT(*)::int AS count
       FROM journal_entries
       WHERE user_id = $1
       AND created_at >= NOW() - INTERVAL '11 months'
       GROUP BY bucket
       ORDER BY bucket ASC`,
      [userId]
    );

    timeline = fillMonthSeries(result.rows, 12);
  }

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

  const latest = latestResult.rows[0];

  return {
    filter: normalizedFilter,
    totalEntries: totalsResult.rows[0]?.total || 0,
    moodBreakdown: moodResult.rows.map((row) => ({
      mood: row.mood,
      count: Number(row.count),
    })),
    timeline,
    latestEntry: latest
      ? {
          id: latest.public_id || latest.id,
          title: latest.title,
          content: latest.content,
          mood: latest.mood,
          insight: latest.insight,
          createdAt: latest.created_at,
          updatedAt: latest.updated_at,
        }
      : null,
  };
};
