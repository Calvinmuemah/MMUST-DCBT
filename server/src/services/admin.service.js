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
  try {
    const healthResult = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as users_count,
        (SELECT COUNT(*) FROM chat_sessions) as chats_count,
        (SELECT COUNT(*) FROM chat_messages) as messages_count,
        (SELECT COUNT(*) FROM journal_entries) as journals_count,
        (SELECT COUNT(*) FROM reflections) as reflections_count,
        (SELECT COUNT(*) FROM daily_assessments) as assessments_count,
        (SELECT COUNT(*) FROM user_login_events) as logins_count
    `);
    stats.systemHealth = healthResult.rows[0];
  } catch (err) {
    // If some tables are missing, we try a safer version
    try {
      const basicResult = await pool.query(`SELECT COUNT(*) as users_count FROM users`);
      stats.systemHealth.users_count = basicResult.rows[0].users_count;
    } catch (e) {}
  }

  // 7. Activity Heatmap (By Hour)
  try {
    const heatmapResult = await pool.query(`
      SELECT 
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(*) as count
      FROM user_login_events
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
      WITH user_streaks AS (
        SELECT DISTINCT user_id, created_at::date as day FROM user_login_events
      )
      SELECT 
        MAX(streak_length) as max_streak,
        ROUND(AVG(streak_length), 1) as avg_streak
      FROM (
        SELECT user_id, COUNT(*) as streak_length
        FROM user_streaks
        GROUP BY user_id
      ) streaks
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
