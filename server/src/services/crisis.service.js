const crisisKeywords = [
    "hurt myself",
    "kill myself",
    "suicide",
    "end my life"
];

export const detectCrisis=(message)=>{

const lower=message.toLowerCase();

return crisisKeywords.some(
keyword=>lower.includes(keyword)
);

};