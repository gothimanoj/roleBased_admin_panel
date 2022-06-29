const mongoose = require("mongoose");

const interviewHistorySchema = new mongoose.Schema({
  developerId: { type: mongoose.Types.ObjectId, ref: "developer" },
  history: { type: Array },
});

module.exports = mongoose.model("interviewHistory", interviewHistorySchema);
