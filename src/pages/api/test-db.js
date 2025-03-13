import db from "@/lib/db";

export default async function handler(req, res) {
  await db; // Ensure MongoDB is connected
  res.status(200).json({ message: "✅ MongoDB is connected!" });
}
