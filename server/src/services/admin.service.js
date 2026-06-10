import { pool } from "../config/db.js";

export const getDashboardStats = async (range = '7d') => {
  const stats = {};

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

  // 1. User Overview (Always show total, but add 'new' count)
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

  // 2. Risk Level Distribution (Filtered by users who joined in range)
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

  // 3. Chat Engagement
  const chatResult = await pool.query(`
    SELECT 
      COUNT(*) as total_sessions
    FROM chat_sessions
    WHERE created_at >= NOW() - INTERVAL '${interval}'
  `);
  
  const topicResult = await pool.query(`
    SELECT 
      topic,
      COUNT(*) as count
    FROM chat_sessions
    WHERE created_at >= NOW() - INTERVAL '${interval}'
    GROUP BY topic
    ORDER BY count DESC
    LIMIT 5
  `);
  
  stats.chats = {
    totalSessions: chatResult.rows[0].total_sessions,
    topTopics: topicResult.rows
  };

  // 4. Daily Assessment Trends
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

  // 5. Main Challenges Breakdown
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
