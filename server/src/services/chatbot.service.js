import { GoogleGenAI } from "@google/genai";
import { pool } from "../config/db.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ===============================
// CBT TOPIC ENGINE
// ===============================
const getCBTPrompt = (topic) => {
  const base = `
You are MMUSTCare, a CBT-based conversational mental health assistant for university students.

CRITICAL BEHAVIOR RULES:
- You are NOT a one-response chatbot.
- You are running a THERAPY CONVERSATION SESSION.
- ALWAYS ask at least ONE thoughtful follow-up question.
- NEVER end the conversation.
- Keep responses 2–3 short paragraphs max.
- Be warm, calm, non-judgmental.

CBT STRUCTURE:
1. Validate emotion
2. Identify thought patterns
3. Gently reframe thinking
4. ASK a question to continue therapy
`;

  const topics = {
    anxiety: `
Focus: Anxiety CBT Mode
- catastrophic thinking
- grounding techniques
- breathing exercises
- ask trigger question
`,

    depression: `
Focus: Low mood CBT Mode
- behavioral activation
- motivation exploration
- self-worth reframing
- ask daily routine question
`,

    "academic stress": `
Focus: Academic Stress CBT Mode
- task breakdown
- overwhelm reduction
- study planning
- ask about hardest subject
`,

    overthinking: `
Focus: Rumination CBT Mode
- thought loops
- cognitive restructuring
- attention shifting
- ask what thought repeats
`,

    relationships: `
Focus: Relationship CBT Mode
- emotional validation
- boundaries
- communication patterns
- ask what happened in detail
`,
  };

  return base + (topics[topic] || "");
};

// ===============================
// FETCH SESSION MEMORY
// ===============================
const getSessionMemory = async (sessionId) => {
  const result = await pool.query(
    `SELECT sender, message
     FROM chat_messages
     WHERE session_id = $1
     ORDER BY created_at ASC
     LIMIT 12`,
    [sessionId]
  );

  return result.rows;
};

// ===============================
// FORMAT MEMORY FOR AI
// ===============================
const formatMemory = (messages) => {
  return messages
    .map((m) => `${m.sender.toUpperCase()}: ${m.message}`)
    .join("\n");
};

// ===============================
// RESPONSE GENERATOR (WITH MEMORY)
// ===============================
export const generateResponse = async (
  message,
  topic = "general",
  sessionId = null
) => {
  try {
    let memoryText = "";

    if (sessionId) {
      const history = await getSessionMemory(sessionId);
      memoryText = formatMemory(history);
    }

    const prompt = `
${getCBTPrompt(topic)}

--- CONVERSATION HISTORY (IMPORTANT CONTEXT) ---
${memoryText || "No previous messages yet."}

--- CURRENT USER MESSAGE ---
"${message}"

INSTRUCTIONS:
- Use conversation history to respond naturally
- Continue the emotional flow
- Do NOT repeat previous responses
- Always ask a follow-up question
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);

    return "I'm here with you. Can you tell me more about what's going on right now?";
  }
};