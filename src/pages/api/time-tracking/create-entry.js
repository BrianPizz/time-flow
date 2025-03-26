import { verifyToken } from "@/lib/auth";
import db from "@/lib/db";
import TimeEntry from "@/models/TimeEntry";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  await db;

  try {
    const user = verifyToken(req);
    const userId = user.userId || user._id;

    const { client, project, task, description, billable } = req.body;

    const entry = new TimeEntry({
      userId,
      client,
      project,
      task,
      description,
      intervals: [],
      duration: 0,
      billable,
      status: "paused"
    });

    await entry.save();

    return res.json({ success: true, entry });
  } catch (error) {
    console.error("❌ Create Entry Error:", error.message);
    return res.status(500).json({ error: "Failed to create entry" });
  }
}
