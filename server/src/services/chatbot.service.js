import { GoogleGenAI } from "@google/genai";
import { pool } from "../config/db.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ===============================
// CBT PROMPTS
// ===============================
const getCBTPrompt = (topic) => {
  const base = `
You are MMUSTCare, a CBT-based conversational mental wellness assistant for university students.

IMPORTANT RULES:

- Be warm and supportive
- Sound natural and human
- Never sound robotic
- Never repeat responses
- Use previous conversation context
- Keep responses VERY SHORT
- Maximum 2–4 sentences
- Maximum 45 words
- Use simple language
- Avoid long explanations
- Don't diagnose users
- Validate emotions briefly
- Give one CBT-based reflection or suggestion
- Ask exactly ONE follow-up question
- Never ask multiple questions
- Continue the conversation naturally
`;

  const topics = {
    anxiety: `
CBT Focus:
- anxiety triggers
- grounding
- breathing
- catastrophic thinking
`,

    depression: `
CBT Focus:
- low mood
- behavioral activation
- self-worth
- motivation
`,

    "academic stress": `
CBT Focus:
- study pressure
- overwhelm reduction
- planning
- task breakdown
`,

    overthinking: `
CBT Focus:
- thought loops
- rumination
- cognitive restructuring
`,

    relationships: `
CBT Focus:
- emotions
- communication
- boundaries
`,

    general: `
CBT Focus:
- emotional wellbeing
`
  };

  return base + "\n" + (topics[topic] || topics.general);
};

// ===============================
// SESSION HISTORY
// ===============================
const getSessionMemory = async (sessionId) => {
  const result = await pool.query(
    `
    SELECT sender, message
    FROM chat_messages
    WHERE session_id=$1
    ORDER BY created_at ASC
    LIMIT 10
`,
    [sessionId]
  );

  return result.rows;
};

// ===============================
// FORMAT MEMORY
// ===============================
const formatMemory = (messages) => {
  return messages
    .map(
      (m) =>
        `${m.sender === "user" ? "USER" : "AI"}: ${m.message}`
    )
    .join("\n");
};

// ===============================
// GENERATE FIRST SESSION MESSAGE
// ===============================
export const generateSessionStarter = async (
  topic
) => {
  try {

    const prompt = `

${getCBTPrompt(topic)}

Selected Topic:

${topic}

Generate ONLY the first message of a CBT conversation.

Requirements:

- Welcome naturally
- Mention topic naturally
- Be warm
- Ask one question
- Maximum 40 words
- No introductions like "Hello user"
- Sound like a real supportive person

`;

    const result =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

    let reply =
      result.text?.trim();

    if (!reply || reply.length < 5) {
      reply =
        `I'm here with you today. What has been feeling difficult about ${topic}?`;
    }

    if (reply.length > 250) {
      reply =
        reply.substring(0, 250);
    }

    return reply;

  } catch (error) {

    console.log(
      "Starter Error:",
      error
    );

    return `I'm here with you today. What has been feeling difficult about ${topic}?`;
  }
};

// ===============================
// MAIN RESPONSE
// ===============================
export const generateResponse = async (
  message,
  topic = "general",
  sessionId = null
) => {

  try {

    let memory = "";

    if (sessionId) {

      const history =
        await getSessionMemory(
          sessionId
        );

      memory =
        formatMemory(history);
    }

    const prompt = `

${getCBTPrompt(topic)}

Conversation History:

${memory || "No previous conversation"}

Current User Message:

"${message}"

Instructions:

- Continue naturally
- Use memory context
- Avoid repeating previous responses
- Keep response under 45 words
- Ask exactly one follow-up question

`;

    const result =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

    let reply =
      result.text?.trim();

    // fallback
    if (!reply || reply.length < 5) {
      reply =
        "I'm here with you. What feels most difficult right now?";
    }

    // prevent huge replies
    if (reply.length > 300) {

      const shortened =
        reply
          .split(".")
          .slice(0,2)
          .join(".") + ".";

      reply = shortened;
    }

    return reply;

  } catch (error) {

    console.log(
      "Gemini Error:",
      error
    );

    return "I'm here with you. What feels most difficult right now?";
  }

};