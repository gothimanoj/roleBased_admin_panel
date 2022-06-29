const mongoose = require("mongoose");
const status = ["pending", "done"];
const interviewSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    time: { type: String, required: true },
    googleMeetLink: { type: String, required: true },
    isInterviewScheduled: { type: Boolean, default: false },
    developerId: { type: mongoose.Types.ObjectId, ref: "Developer" },
    clientId: { type: mongoose.Types.ObjectId, ref: "Client" },
    agencyId: { type: mongoose.Types.ObjectId, ref: "Agency" },
    status: { type: String, enum: status },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("interviewSchedule", interviewSchema);
