import mongoose from "mongoose";

const IntervalSchema = new mongoose.Schema({
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
});

const TimeEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    client: {
        type: String,
        required: true,
    },
    project: {
        type: String,
        required: true,
    },
    task: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    intervals: [IntervalSchema], // array of start/end intervals
    duration: {
        type: Number, // in seconds
        required: true,
    },
    billable: {
        type: Boolean,
        required: true,
    },
    status: {
        type: String,
        enum: ["running", "paused", "stopped"],
        default: "paused"
      },
});

export default mongoose.models.TimeEntry || mongoose.model("TimeEntry", TimeEntrySchema);   