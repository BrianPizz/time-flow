import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Missing MONGODB_URI in .env.local");
}

let cached = global.mongoose || null;

if (!cached) {
  cached = global.mongoose = mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then((conn) => {
    console.log("✅ Connected to MongoDB!");
    return conn;
  }).catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });
}

export default cached;
