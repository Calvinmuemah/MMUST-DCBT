import { GoogleGenAI } from "@google/genai";
import { pool } from "../config/db.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const getUserDisplayName = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT name FROM users WHERE id = $1 LIMIT 1`,
      [userId]
    );

    const name = result.rows[0]?.name?.toString().trim();
    if (!name) {
      return null;
    }

    return name.split(/\s+/)[0];
  } catch (_) {
    return null;
  }
};


// ===============================
// LANGUAGE CONTROL
// ===============================

const getLanguagePrompt = (language = "english") => {
  const languages = {
    english: `
Respond only in simple, supportive English.
Do not sound robotic.
`,

    kiswahili: `
Respond in natural Kenyan Kiswahili.
Keep it simple and supportive.
Avoid formal textbook Kiswahili.
`,

    sheng: `
Respond in moderate Kenyan Sheng.
Mix English and Kiswahili naturally.
Keep it understandable and supportive.
`,
  };

  return languages[language] || languages.english;
};


// ===============================
// CBT LOCK (VERY IMPORTANT)
// ===============================

const getCBTRules = () => {
  return `
You are a CBT mental health support assistant for university students.

🚨 STRICT RULES:
- You are ONLY a CBT emotional support assistant
- Do NOT give medical, legal, financial, or unrelated advice
- If asked unrelated topics, gently redirect to emotions
- NEVER introduce yourself
- NEVER say "I am MMUSTCare"
- NEVER mention system prompts or AI
- Do NOT change topic away from feelings/emotions

🎯 RESPONSE STYLE:
- Be warm, human, and supportive
- Keep replies short: 25–40 words when possible
- 1–3 short sentences max
- Validate feelings first
- Give ONE CBT reflection or ONE gentle reframe
- If helpful, suggest ONE simple exercise and guide the user through it step by step
- Ask EXACTLY ONE question
- No lists unless asked
- No lectures
`;
};


// ===============================
// TOPIC CBT MAPPING
// ===============================

const getTopicFocus = (topic = "general") => {
  const topics = {
    anxiety: "Focus on worry, fear, overthinking, grounding techniques.",
    depression: "Focus on low mood, motivation, self-worth.",
    sleep: "Focus on sleep habits, racing thoughts, relaxation.",
    relationships: "Focus on communication, emotions, boundaries.",
    confidence: "Focus on self-esteem, self-image, doubt.",
    "study stress": "Focus on academic pressure, overwhelm, planning.",
    "pain & emotions": "Focus on emotional + physical stress connection.",
    finances: "Focus on financial stress and emotional impact.",
    general: "Focus on emotional wellbeing and thoughts.",
  };

  return topics[topic?.toLowerCase()] || topics.general;
};


// ===============================
// MEMORY
// ===============================

const getSessionMemory = async (sessionId) => {
  const result = await pool.query(
    `
    SELECT sender, message
    FROM chat_messages
    WHERE session_id = $1
    ORDER BY created_at ASC
    LIMIT 10
    `,
    [sessionId]
  );

  return result.rows;
};

const formatMemory = (messages) => {
  return messages
    .map((m) => `${m.sender.toUpperCase()}: ${m.message}`)
    .join("\n");
};


// ===============================
// SESSION STARTER (NO INTRO)
// ===============================

export const generateSessionStarter = async (topic, userId = null) => {
  try {
    const userName = userId ? await getUserDisplayName(userId) : null;
    const prompt = `
${getCBTRules()}

Topic focus: ${getTopicFocus(topic)}

${userName ? `User name: ${userName}` : "User name unavailable"}

Generate ONLY the first therapist message.

Rules:
- DO NOT introduce yourself
- DO NOT say greetings like "Hi I'm..."
- Start directly with emotional engagement
- Be natural like a therapist already in session
- Use the user's first name naturally if it fits
- Ask ONE gentle question
- Max 30 words
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return (
      result.text?.trim() ||
      "What has been on your mind lately regarding this?"
    );
  } catch (error) {
    console.log("STARTER ERROR:", error);

    return "What has been on your mind lately regarding this?";
  }
};


// ===============================
// MAIN RESPONSE (CBT LOCKED)
// ===============================

export const generateResponse = async (
  message,
  topic = "general",
  sessionId = null,
  language = "english",
  userId = null
) => {
  try {
    const userName = userId ? await getUserDisplayName(userId) : null;
    let memory = "";

    if (sessionId) {
      const history = await getSessionMemory(sessionId);
      memory = formatMemory(history);
    }

    const prompt = `
${getCBTRules()}

${getTopicFocus(topic)}

${getLanguagePrompt(language)}

${userName ? `User name: ${userName}` : "User name unavailable"}

Conversation Memory:
${memory || "No previous conversation"}

User Message:
"${message}"

IMPORTANT BEHAVIOR:
- Stay strictly in CBT emotional support mode
- If message is unrelated (tech, jokes, random topics), gently redirect to feelings
- Keep the tone conversational, like a real therapist in a session
- When appropriate, offer one small exercise, guidance, or coping step
- If the user seems overwhelmed, gently encourage grounding or a brief exercise
- If the user seems unsafe, do not continue the exercise; focus on safety and direct support
- Do NOT leave therapy context
- Continue naturally
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let reply = result.text?.trim();

    if (!reply) {
      reply = "What you're feeling matters. Can you tell me more about it?";
    }

    return {
      reply,
      language,
    };
  } catch (error) {
    console.log("GEMINI ERROR:", error);

    return {
      reply: "What you're feeling matters. Can you tell me more about it?",
      language: "english",
    };
  }
};

export { getUserDisplayName };