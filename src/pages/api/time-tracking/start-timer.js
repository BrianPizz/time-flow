import { verifyToken } from "@/lib/auth";
import db from "@/lib/db";
import TimeEntry from "@/models/TimeEntry";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  await db;
  try {
    const user = verifyToken(req);
    req.body.userId = user.userId;
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { client, project, task, billable } = req.body;
  const newEntry = new TimeEntry({ userId: req.body.userId, client, project, task, startTime: new Date(), billable });
  await newEntry.save();

  return res.json({ success: true, entry: newEntry });
}
