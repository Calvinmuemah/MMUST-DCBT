import { GoogleGenAI } from "@google/genai";
import { pool } from "../config/db.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ===============================
// LANGUAGE RULES
// ===============================

const getLanguagePrompt=(language="english")=>{

const languages={

english:`
Respond only in English.
Use simple student-friendly language.
`,

kiswahili:`
Respond only in normal everyday Kiswahili.

IMPORTANT:

- Use natural Kenyan Kiswahili
- Avoid formal textbook Kiswahili
- Sound like a supportive friend
- Example style:
"inaonekana hiyo imekuwa ikikulemea"
instead of
"inaonekana jambo hilo linakusumbua mno"
`,

sheng:`
Respond only in Kenyan Sheng.

IMPORTANT:

- Use moderate Sheng
- Mix Kiswahili and English naturally
- Avoid excessive slang
- Keep it understandable

Example style:

"Hiyo pressure inaonekana imekuwa mingi kiasi"

instead of

"Mbona uko stressed sana buda maze noma deadly"
`
};

return languages[language] || languages.english;

};

// ===============================
// CBT PROMPTS
// ===============================

const getCBTPrompt=(topic)=>{

const base=`

You are MMUSTCare, a CBT mental wellness assistant for university students.

IMPORTANT:

- Be warm
- Sound human
- Never sound robotic
- Never repeat responses
- Maximum 45 words
- Maximum 2-4 sentences
- Keep responses short
- Validate feelings briefly
- Give one CBT reflection
- Ask exactly ONE question
- Continue naturally
`;

const topics={

anxiety:`
Focus:
- triggers
- grounding
- breathing
- catastrophic thinking
`,

depression:`
Focus:
- low mood
- motivation
- self worth
`,

"academic stress":`
Focus:
- study stress
- planning
- overwhelm
`,

overthinking:`
Focus:
- thought loops
- reframing
`,

relationships:`
Focus:
- emotions
- communication
- boundaries
`,

general:`
Focus:
- emotional wellbeing
`
};

return base+(topics[topic]||topics.general);

};


// ===============================
// MEMORY
// ===============================

const getSessionMemory=async(sessionId)=>{

const result=
await pool.query(
`
SELECT sender,message
FROM chat_messages
WHERE session_id=$1
ORDER BY created_at ASC
LIMIT 10
`,
[sessionId]
);

return result.rows;

};


const formatMemory=(messages)=>{

return messages
.map(
m=>`${m.sender.toUpperCase()}: ${m.message}`
)
.join("\n");

};


// ===============================
// SESSION STARTER
// NOT LANGUAGE DEPENDENT
// ===============================

export const generateSessionStarter=
async(topic)=>{

try{

const prompt=`

${getCBTPrompt(topic)}

Generate ONLY the first message.

Requirements:

- Warm
- Mention topic naturally
- Ask one question
- Maximum 35 words
`;

const result=
await ai.models.generateContent({

model:"gemini-2.5-flash",
contents:prompt

});

return result.text?.trim() ||
`I'm here with you today. What has been difficult about ${topic}?`;

}
catch(error){

return `I'm here with you today. What has been difficult about ${topic}?`;

}

};


// ===============================
// MAIN RESPONSE
// ===============================

export const generateResponse=
async(

message,
topic="general",
sessionId=null,
language="english"

)=>{

try{

let memory="";

if(sessionId){

const history=
await getSessionMemory(sessionId);

memory=
formatMemory(history);

}

const prompt=`

${getCBTPrompt(topic)}

${getLanguagePrompt(language)}

Conversation History:

${memory || "No previous conversation"}

Current Message:

"${message}"

Instructions:

- Keep under 45 words
- Use memory
- Continue naturally
- Ask one question
`;

const result=
await ai.models.generateContent({

model:"gemini-2.5-flash",
contents:prompt

});

let reply=
result.text?.trim();

if(!reply){

reply=
"I'm here with you. What feels difficult right now?";
}

return reply;

}
catch(error){

console.log(
"GEMINI ERROR:",
error
);

return "I'm here with you. What feels difficult right now?";
}

};