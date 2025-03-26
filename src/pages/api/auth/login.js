import db from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  await db;
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ error: "Invalid email or password" });

  console.log("User:", user);
  console.log("Stored password:", user.password);
  console.log("Input password:", password);
  const isMatch = await bcrypt.compare(password, user.password);
  console.log("Password match:", isMatch);


  // Compare password
  // const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ error: "Invalid email or password" });

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token, userId: user._id });
}
