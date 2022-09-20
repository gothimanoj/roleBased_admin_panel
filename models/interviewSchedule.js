const mongoose = require("mongoose");
const status = ["pending", "done", "canceled", "approved", "rejected"];
const interviewSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    googleMeetLink: { type: String, required: true },
    developerId: { type: mongoose.Types.ObjectId, ref: "Developer" },
    clientId: { type: mongoose.Types.ObjectId, ref: "Client" },
    agencyId: { type: mongoose.Types.ObjectId, ref: "Agency" },
    status: { type: String, enum: status },
    feedback: { type: String}

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("interviewSchedule", interviewSchema);
