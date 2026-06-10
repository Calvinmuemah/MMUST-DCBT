import { pool } from "../config/db.js";

export const getDashboardStats = async () => {
  const stats = {};

  // 1. User Overview
  const userResult = await pool.query(`
    SELECT 
      COUNT(*) as total_users,
      COUNT(*) FILTER (WHERE is_anonymous = TRUE) as anonymous_users,
      COUNT(*) FILTER (WHERE is_anonymous = FALSE) as registered_users,
      COUNT(*) FILTER (WHERE onboarding_completed = TRUE) as onboarding_completed
    FROM users
  `);
  stats.users = userResult.rows[0];

  // 2. Risk Level Distribution
  const riskResult = await pool.query(`
    SELECT 
      onboarding_risk_level as level,
      COUNT(*) as count
    FROM users
    WHERE onboarding_completed = TRUE
    GROUP BY onboarding_risk_level
  `);
  stats.riskDistribution = riskResult.rows;

  // 3. Chat Engagement
  const chatResult = await pool.query(`
    SELECT 
      COUNT(*) as total_sessions
    FROM chat_sessions
  `);
  
  const topicResult = await pool.query(`
    SELECT 
      topic,
      COUNT(*) as count
    FROM chat_sessions
    GROUP BY topic
    ORDER BY count DESC
    LIMIT 5
  `);
  
  stats.chats = {
    totalSessions: chatResult.rows[0].total_sessions,
    topTopics: topicResult.rows
  };

  // 4. Daily Assessment Trends (Last 7 Days)
  const assessmentTrend = await pool.query(`
    SELECT 
      assessment_date,
      COUNT(*) as total_assessments,
      ROUND(AVG(total_score), 1) as avg_score
    FROM daily_assessments
    WHERE assessment_date >= CURRENT_DATE - INTERVAL '7 days'
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
    GROUP BY main_challenge
    ORDER BY count DESC
    LIMIT 5
  `);
  stats.topChallenges = challengeResult.rows;

  return stats;
};
