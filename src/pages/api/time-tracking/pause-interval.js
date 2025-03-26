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

    const activeInterval = entry.intervals.find((i) => !i.end);
    if (!activeInterval) return res.status(400).json({ error: "No running interval to pause" });

    activeInterval.end = new Date();
    const diffSeconds = Math.floor((new Date(activeInterval.end) - new Date(activeInterval.start)) / 1000);
    entry.duration += diffSeconds;

    entry.status = "paused";

    await entry.save();

    return res.json({ success: true, entry });
  } catch (error) {
    console.error("❌ Pause Interval Error:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
}
