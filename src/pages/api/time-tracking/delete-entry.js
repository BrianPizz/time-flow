import { verifyToken } from "@/lib/auth";
import db from "@/lib/db";
import TimeEntry from "@/models/TimeEntry";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).end();

  await db;

  try {
    const user = verifyToken(req);
    req.body.userId = user.userId || user._id;
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Missing time entry ID" });

  const entry = await TimeEntry.findById(id);
  if (!entry) return res.status(404).json({ error: "Time entry not found" });

  // Ensure only the owner can delete their entry
  if (entry.userId.toString() !== req.body.userId) {
    return res.status(403).json({ error: "Forbidden: Not your entry" });
  }

  await entry.deleteOne();

  return res.json({ success: true, message: "Time entry deleted" });
}

