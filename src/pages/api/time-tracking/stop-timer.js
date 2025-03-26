import { verifyToken } from "@/lib/auth";
import db from "@/lib/db";
import TimeEntry from "@/models/TimeEntry";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  await db;

  try {
    const user = verifyToken(req); // get user from JWT
    req.body.userId = user.userId || user._id;
  } catch (error) {
    console.error("❌ verifyToken failed:", error.message);
    return res.status(401).json({ error: "Unauthorized" });
  }

  const  id  = req.body;

  if (!id) {
    return res.status(400).json({ error: "Missing time entry ID" });
  }

  const entry = await TimeEntry.findById(id);

  if (!entry) {
    return res.status(404).json({ error: "Time entry not found" });
  }

  if (entry.endTime) {
    return res.status(400).json({ error: "Timer already stopped" });
  }

  // Stop the timer
  const now = new Date();
  entry.endTime = now;
  entry.duration = Math.round((now - entry.startTime) / 1000); // in seconds

  await entry.save();

  return res.json({ success: true, entry });
}
