import { GoogleGenAI } from "@google/genai";
import { pool } from "../config/db.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


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
- Maximum 45 words
- 2–4 short sentences max
- Validate feelings first
- Give ONE CBT reflection
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

export const generateSessionStarter = async (topic) => {
  try {
    const prompt = `
${getCBTRules()}

Topic focus: ${getTopicFocus(topic)}

Generate ONLY the first therapist message.

Rules:
- DO NOT introduce yourself
- DO NOT say greetings like "Hi I'm..."
- Start directly with emotional engagement
- Be natural like a therapist already in session
- Ask ONE gentle question
- Max 35 words
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
  language = "english"
) => {
  try {
    let memory = "";

    if (sessionId) {
      const history = await getSessionMemory(sessionId);
      memory = formatMemory(history);
    }

    const prompt = `
${getCBTRules()}

${getTopicFocus(topic)}

${getLanguagePrompt(language)}

Conversation Memory:
${memory || "No previous conversation"}

User Message:
"${message}"

IMPORTANT BEHAVIOR:
- Stay strictly in CBT emotional support mode
- If message is unrelated (tech, jokes, random topics), redirect to feelings:
  Example: "I hear you, but let's focus on how that made you feel"
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