import { verifyToken } from "@/lib/auth";
import db from "@/lib/db";
import TimeEntry from "@/models/TimeEntry";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  await db;

  try {
    const user = verifyToken(req);
    const { id } = req.body;

    const entry = await TimeEntry.findById(id);
    if (!entry || entry.userId.toString() !== (user.userId || user._id)) {
      return res.status(404).json({ error: "Time entry not found or unauthorized" });
    }

    const running = entry.intervals.some((i) => i.end === undefined || i.end === null);
    if (running) return res.status(400).json({ error: "Timer is already running" });

    entry.intervals.push({ start: new Date() });
    entry.status = "running";

    await entry.save();

    return res.json({ success: true, entry });
  } catch (error) {
    console.error("❌ Start Interval Error:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
}
