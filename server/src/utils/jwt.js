import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      uid: user.uid || null,
      email: user.email,
      tokenVersion: user.tokenVersion ?? 0,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};