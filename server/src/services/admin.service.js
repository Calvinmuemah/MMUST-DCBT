import { pool } from "../config/db.js";

export const getDashboardStats = async (range = '7d') => {
  const stats = {
    users: { total_users: 0, anonymous_users: 0, registered_users: 0, onboarding_completed: 0, new_users: 0 },
    riskDistribution: [],
    chats: { totalSessions: 0, topTopics: [] },
    assessmentTrends: [],
    topChallenges: [],
    systemHealth: { users_count: 0, chats_count: 0, messages_count: 0, journals_count: 0, reflections_count: 0, assessments_count: 0, logins_count: 0 },
    activityHeatmap: [],
    streaks: { max_streak: 0, avg_streak: 0 },
    referrals: { total: 0, referred: 0, percentage: 0 }
  };

  let interval;
  switch (range) {
    case '24h': interval = '1 day'; break;
    case '7d': interval = '7 days'; break;
    case '14d': interval = '14 days'; break;
    case '30d': interval = '30 days'; break;
    case '90d': interval = '90 days'; break;
    case '1y': interval = '1 year'; break;
    case 'all': interval = '100 years'; break;
    default: interval = '7 days';
  }

  // Helper to check if a table exists error
  const isTableMissing = (err) => err?.code === '42P01';

  // 1. User Overview
  try {
    const userResult = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE is_anonymous = TRUE) as anonymous_users,
        COUNT(*) FILTER (WHERE is_anonymous = FALSE) as registered_users,
        COUNT(*) FILTER (WHERE onboarding_completed = TRUE) as onboarding_completed,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '${interval}') as new_users
      FROM users
    `);
    stats.users = userResult.rows[0];
  } catch (err) {
    console.error("Dashboard error (users):", err.message);
  }

  // 2. Risk Level Distribution
  try {
    const riskResult = await pool.query(`
      SELECT 
        onboarding_risk_level as level,
        COUNT(*) as count
      FROM users
      WHERE onboarding_completed = TRUE
      AND created_at >= NOW() - INTERVAL '${interval}'
      GROUP BY onboarding_risk_level
    `);
    stats.riskDistribution = riskResult.rows;
  } catch (err) {
    console.error("Dashboard error (risk):", err.message);
  }

  // 3. Chat Engagement
  try {
    const chatResult = await pool.query(`
      SELECT COUNT(*) as total_sessions FROM chat_sessions
      WHERE created_at >= NOW() - INTERVAL '${interval}'
    `);
    
    const topicResult = await pool.query(`
      SELECT topic, COUNT(*) as count FROM chat_sessions
      WHERE created_at >= NOW() - INTERVAL '${interval}'
      GROUP BY topic ORDER BY count DESC LIMIT 5
    `);
    
    stats.chats = {
      totalSessions: chatResult.rows[0]?.total_sessions || 0,
      topTopics: topicResult.rows
    };
  } catch (err) {
    if (!isTableMissing(err)) console.error("Dashboard error (chats):", err.message);
  }

  // 4. Daily Assessment Trends
  try {
    const assessmentTrend = await pool.query(`
      SELECT 
        assessment_date,
        COUNT(*) as total_assessments,
        ROUND(AVG(total_score), 1) as avg_score
      FROM daily_assessments
      WHERE assessment_date >= CURRENT_DATE - INTERVAL '${interval}'
      GROUP BY assessment_date
      ORDER BY assessment_date ASC
    `);
    stats.assessmentTrends = assessmentTrend.rows;
  } catch (err) {
    if (!isTableMissing(err)) console.error("Dashboard error (assessment trends):", err.message);
  }

  // 5. Main Challenges Breakdown
  try {
    const challengeResult = await pool.query(`
      SELECT 
        main_challenge,
        COUNT(*) as count
      FROM daily_assessments
      WHERE assessment_date >= CURRENT_DATE - INTERVAL '${interval}'
      GROUP BY main_challenge
      ORDER BY count DESC
      LIMIT 5
    `);
    stats.topChallenges = challengeResult.rows;
  } catch (err) {
    if (!isTableMissing(err)) console.error("Dashboard error (challenges):", err.message);
  }

  // 6. System Health (Table Counts)
  const getCount = async (table) => {
    try {
      const res = await pool.query(`SELECT COUNT(*) FROM ${table}`);
      return parseInt(res.rows[0].count);
    } catch (err) {
      return 0;
    }
  };

  stats.systemHealth = {
    users_count: await getCount('users'),
    chats_count: await getCount('chat_sessions'),
    messages_count: await getCount('chat_messages'),
    journals_count: await getCount('journal_entries'),
    reflections_count: await getCount('reflections'),
    assessments_count: await getCount('daily_assessments'),
    logins_count: await getCount('daily_assessments') // Using assessments as a proxy for logins as per previous change
  };

  // 7. Activity Heatmap (By Hour)
  try {
    const heatmapResult = await pool.query(`
      SELECT 
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(*) as count
      FROM daily_assessments
      WHERE created_at >= NOW() - INTERVAL '${interval}'
      GROUP BY hour
      ORDER BY hour ASC
    `);
    stats.activityHeatmap = heatmapResult.rows;
  } catch (err) {
    if (!isTableMissing(err)) console.error("Dashboard error (heatmap):", err.message);
  }

  // 8. Streak Statistics
  try {
    const streakStats = await pool.query(`
      WITH user_dates AS (
        SELECT DISTINCT user_id, assessment_date FROM daily_assessments
      ),
      user_groups AS (
        SELECT 
          user_id, 
          assessment_date,
          assessment_date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY assessment_date))::int as grp
        FROM user_dates
      ),
      streaks AS (
        SELECT user_id, COUNT(*) as streak_length
        FROM user_groups
        GROUP BY user_id, grp
      )
      SELECT 
        COALESCE(MAX(streak_length), 0) as max_streak,
        COALESCE(ROUND(AVG(streak_length), 1), 0) as avg_streak
      FROM streaks
    `);
    stats.streaks = {
      max_streak: streakStats.rows[0]?.max_streak || 0,
      avg_streak: streakStats.rows[0]?.avg_streak || 0
    };
  } catch (err) {
    if (!isTableMissing(err)) console.error("Dashboard error (streaks):", err.message);
  }

  // 9. Referral Conversion
  try {
    const referralStats = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE referred_by_user_id IS NOT NULL) as referred
      FROM users
    `);
    const total = parseInt(referralStats.rows[0].total) || 0;
    const referred = parseInt(referralStats.rows[0].referred) || 0;
    stats.referrals = {
      total,
      referred,
      percentage: total > 0 ? Math.round((referred / total) * 100) : 0
    };
  } catch (err) {
    console.error("Dashboard error (referrals):", err.message);
  }

  return stats;
};

export const getDetailedUsers = async () => {
  const result = await pool.query(`
    SELECT 
      id, public_id, name, email, role, is_anonymous, 
      onboarding_risk_level, onboarding_completed, 
      referral_reward_points, created_at
    FROM users
    ORDER BY created_at DESC
  `);
  return result.rows;
};

export const getCrisisReports = async () => {
  // We identify high risk sessions based on topic or if risk_level was 'High' in assessment
  // or if certain keywords appear in chat (though here we'll stick to assessment risk for now)
  const result = await pool.query(`
    SELECT 
      u.name, u.email, u.onboarding_risk_level, 
      da.stress_level, da.main_challenge, da.assessment_date,
      u.public_id as user_public_id
    FROM users u
    JOIN daily_assessments da ON u.id = da.user_id
    WHERE u.onboarding_risk_level = 'High' OR da.risk_level = 'High'
    ORDER BY da.assessment_date DESC
    LIMIT 50
  `);
  return result.rows;
};

export const getSystemLogs = async (category = 'all', limit = 100) => {
  let query = `SELECT * FROM system_logs`;
  const params = [];
  
  if (category !== 'all') {
    query += ` WHERE category = $1`;
    params.push(category);
  }
  
  query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
  params.push(limit);
  
  const result = await pool.query(query, params);
  return result.rows;
};

export const deleteUser = async (userId) => {
  const result = await pool.query(`DELETE FROM users WHERE id = $1 OR public_id::text = $1`, [userId]);
  return result.rowCount > 0;
};

export const getUserFullProfile = async (userId) => {
  // 1. Basic User Info
  const userResult = await pool.query(
    `SELECT id, public_id, name, email, role, is_anonymous, 
            onboarding_answers, onboarding_total_score, onboarding_risk_level, 
            onboarding_completed, onboarding_completed_at, 
            referral_reward_points, created_at
     FROM users 
     WHERE id = $1 OR public_id::text = $1`,
    [userId]
  );

  if (userResult.rowCount === 0) return null;
  const user = userResult.rows[0];
  const realId = user.id;

  // 2. Daily Assessments
  const assessments = await pool.query(
    `SELECT * FROM daily_assessments WHERE user_id = $1 ORDER BY assessment_date DESC`,
    [realId]
  );

  // 3. Journal Entries
  const journals = await pool.query(
    `SELECT id, public_id, title, mood, insight, created_at 
     FROM journal_entries WHERE user_id = $1 ORDER BY created_at DESC`,
    [realId]
  );

  // 4. Chat Sessions
  const chats = await pool.query(
    `SELECT id, public_id, topic, created_at 
     FROM chat_sessions WHERE user_id = $1 ORDER BY created_at DESC`,
    [realId]
  );

  // 5. Reflections
  const reflections = await pool.query(
    `SELECT id, public_id, mood_rating, text, tags, created_at 
     FROM reflections WHERE user_id = $1 ORDER BY created_at DESC`,
    [realId]
  );

  // 6. Streak Logic for this user
  const streakResult = await pool.query(`
    WITH user_dates AS (
      SELECT DISTINCT assessment_date FROM daily_assessments WHERE user_id = $1
    ),
    user_groups AS (
      SELECT 
        assessment_date,
        assessment_date - (ROW_NUMBER() OVER (ORDER BY assessment_date))::int as grp
      FROM user_dates
    ),
    streaks AS (
      SELECT COUNT(*) as length FROM user_groups GROUP BY grp
    )
    SELECT COALESCE(MAX(length), 0) as max_streak FROM streaks
  `, [realId]);

  return {
    ...user,
    assessments: assessments.rows,
    journals: journals.rows,
    chats: chats.rows,
    reflections: reflections.rows,
    stats: {
      total_assessments: assessments.rowCount,
      total_journals: journals.rowCount,
      total_chats: chats.rowCount,
      total_reflections: reflections.rowCount,
      max_streak: streakResult.rows[0]?.max_streak || 0
    }
  };
};

export const createLog = async (level, category, message, metadata = {}) => {
  try {
    await pool.query(
      `INSERT INTO system_logs (level, category, message, metadata) VALUES ($1, $2, $3, $4)`,
      [level, category, message, JSON.stringify(metadata)]
    );
  } catch (err) {
    console.error("createLog error:", err.message);
  }
};
