const crisisKeywords = [
    "hurt myself",
    "kill myself",
    "suicide",
    "end my life",
    "want to die",
    "die",
    "death",
    "no reason to live",
    "kill me"
];

export const detectCrisis=(message)=>{

const lower=message.toLowerCase();

return crisisKeywords.some(
keyword=>lower.includes(keyword)
);

};