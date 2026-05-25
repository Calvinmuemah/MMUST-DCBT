import {
generateResponse,
generateSessionStarter
} from "../services/chatbot.service.js";

import { detectCrisis } from "../services/crisis.service.js";

import { pool } from "../config/db.js";

import {
ensureSessionPublicId,
resolveSessionId
}
from "../utils/ids.js";


// =================================
// START SESSION
// =================================

export const startSession=async(req,res)=>{

try{

const userId=req.user.dbId;
const {topic}=req.body;

if(!topic){

return res.status(400).json({
message:"Topic required"
});

}

const session=
await pool.query(
`
INSERT INTO chat_sessions
(user_id,topic)
VALUES($1,$2)
RETURNING id,topic
`,
[userId,topic]
);

const created=
session.rows[0];

const publicId=
await ensureSessionPublicId(
created.id,
userId,
created.topic
);


// GENERATE AI STARTER
const starter=
await generateSessionStarter(
topic
);


// SAVE STARTER MESSAGE
await pool.query(
`
INSERT INTO chat_messages
(session_id,sender,message)
VALUES($1,'ai',$2)
`,
[
created.id,
starter
]
);


return res.json({

sessionId:
publicId || created.id,

message:starter

});

}catch(err){

console.log(
"START ERROR:",
err
);

return res.status(500).json({
message:"Server error"
});

}

};


// =================================
// CHAT
// =================================

export const chat=async(req,res)=>{

try{

const {
message,
sessionId
}=req.body;

const userId=
req.user.dbId;

if(
!message ||
!sessionId
){

return res.status(400).json({
message:
"Message and sessionId required"
});

}


// CRISIS CHECK
if(detectCrisis(message)){

return res.json({

emergency:true,

response:
"I’m concerned about what you shared. Please reach out to someone you trust or a counselor immediately."

});

}

const resolvedId=
await resolveSessionId(
sessionId
);


// OWNERSHIP CHECK
const session=
await pool.query(
`
SELECT *
FROM chat_sessions
WHERE id=$1
AND user_id=$2
`,
[
resolvedId,
userId
]
);

if(
session.rowCount===0
){

return res.status(403).json({
message:
"Unauthorized session"
});

}

const topic=
session.rows[0].topic;


// SAVE USER MESSAGE
await pool.query(
`
INSERT INTO chat_messages
(session_id,sender,message)
VALUES($1,'user',$2)
`,
[
resolvedId,
message
]
);


// AI REPLY
const reply=
await generateResponse(
message,
topic,
resolvedId
);


// SAVE AI RESPONSE
await pool.query(
`
INSERT INTO chat_messages
(session_id,sender,message)
VALUES($1,'ai',$2)
`,
[
resolvedId,
reply
]
);


return res.json({

emergency:false,
response:reply,
sessionId

});

}catch(error){

console.log(
"CHAT ERROR:",
error
);

return res.status(500).json({
message:"Server error"
});

}

};


// =================================
// GET HISTORY
// =================================

export const getSessionMessages=
async(req,res)=>{

try{

const {
sessionId
}=req.params;

const userId=
req.user.dbId;

const resolvedId=
await resolveSessionId(
sessionId
);

const check=
await pool.query(
`
SELECT id
FROM chat_sessions
WHERE id=$1
AND user_id=$2
`,
[
resolvedId,
userId
]
);

if(
check.rowCount===0
){

return res.status(403).json({
message:"Unauthorized"
});

}

const result=
await pool.query(
`
SELECT sender,message,created_at
FROM chat_messages
WHERE session_id=$1
ORDER BY created_at ASC
`,
[
resolvedId
]
);

return res.json(
result.rows
);

}catch(err){

console.log(err);

return res.status(500).json({
message:
"Error fetching history"
});

}

};