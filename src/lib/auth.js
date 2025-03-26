import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const EXPIRATION = "7d";

export function signToken(user) {
  const payload = { _id: user._id, email: user.email, username: user.username };
  return jwt.sign({ data: payload }, JWT_SECRET, { expiresIn: EXPIRATION });
}

export function verifyToken(req) {
  const token = req.headers.authorization?.split(" ")[1];

  console.log("🔐 Incoming Auth Header:", req.headers.authorization);
  console.log("🔐 Extracted Token:", token);

  if (!token) throw new Error("No token");

  try {
    const  data  = jwt.verify(token, JWT_SECRET);
    console.log("✅ Decoded JWT Data:", data);
    return data;
  } catch (error) {
    console.error("❌ Invalid token:", error.message);
    throw new Error("Unauthorized");
  }
}
