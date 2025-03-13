import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Must match an email address!"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  timeEntries: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TimeEntry",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔹 Middleware to Hash Password Before Saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password is modified

  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// 🔹 Method to Compare Passwords
UserSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);

