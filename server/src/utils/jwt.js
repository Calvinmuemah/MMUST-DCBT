import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, uid: user.uid || null, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};