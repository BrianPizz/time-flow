import db from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  await db;
  const { username, email, password } = req.body;

  console.log("🔍 Sign-up Request:", { username, email, password });

  // 🔹 Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log("❌ User already exists:", email);
    return res.status(400).json({ error: "User already exists" });
  }

  // 🔹 Hash password before saving
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Hashed Password:", hashedPassword);

    // 🔹 Save new user in database
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    console.log("✅ User created successfully:", email);

    // 🔹 Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({ token, userId: newUser._id, message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Error hashing password:", error);
    return res.status(500).json({ error: "Error creating user" });
  }
}

