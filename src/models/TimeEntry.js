import mongoose from "mongoose";

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
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date, // null if not ended
    },
    duration: {
        type: Number, // in seconds
        required: true,
    },
    billable: {
        type: Boolean,
        required: true,
    },
});

export default mongoose.models.TimeEntry || mongoose.model("TimeEntry", TimeEntrySchema);   