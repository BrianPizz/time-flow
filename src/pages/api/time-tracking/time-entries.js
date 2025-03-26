import { verifyToken } from "@/lib/auth";
import db from "@/lib/db";
import TimeEntry from "@/models/TimeEntry";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  await db;

  try {
    const user = verifyToken(req);
    const userId = user.userId || user._id;

    const entries = await TimeEntry.find({ userId }).sort({ startTime: -1 });
    return res.status(200).json(entries);
  } catch (error) {
    console.error("❌ Error fetching entries:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
}
