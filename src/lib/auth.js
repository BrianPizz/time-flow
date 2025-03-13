import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const EXPIRATION = "7d";

export function signToken(user) {
  const payload = { _id: user._id, email: user.email, username: user.username };
  return jwt.sign({ data: payload }, JWT_SECRET, { expiresIn: EXPIRATION });
}

export function authMiddleware(req) {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) return req;

  try {
    const { data } = jwt.verify(token, JWT_SECRET);
    req.user = data;
  } catch (error) {
    console.error("Invalid token:", error);
  }

  return req;
}
