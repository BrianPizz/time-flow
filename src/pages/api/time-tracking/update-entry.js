import { verifyToken } from "@/lib/auth";
import db from "@/lib/db";
import TimeEntry from "@/models/TimeEntry";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).end();

  await db;

  try {
    const user = verifyToken(req);
    req.body.userId = user.userId || user._id;
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id, client, project, task, description, billable, duration, intervals } = req.body;

  if (!id) return res.status(400).json({ error: "Missing entry ID" });

  const entry = await TimeEntry.findById(id);
  if (!entry) return res.status(404).json({ error: "Time entry not found" });

  if (entry.userId.toString() !== req.body.userId) {
    return res.status(403).json({ error: "Forbidden" });
  }
  // manual interval update
  if (intervals !== undefined && Array.isArray(intervals)) {
    entry.intervals = intervals;
  }
  
  if (intervals !== undefined && Array.isArray(intervals)) {
    entry.intervals = intervals;
  
    // Auto-calculate total duration in seconds
    entry.duration = intervals.reduce((sum, interval) => {
      if (interval.start && interval.end) {
        return sum + Math.floor((new Date(interval.end) - new Date(interval.start)) / 1000);
      }
      return sum;
    }, 0);
  }

  if (client !== undefined) entry.client = client;
  if (project !== undefined) entry.project = project;
  if (task !== undefined) entry.task = task;
  if (description !== undefined) entry.description = description;
  if (billable !== undefined) entry.billable = billable;
  if (duration !== undefined) entry.duration = duration;

  await entry.save();

  return res.json({ success: true, entry });
}
