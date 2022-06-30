const mongoose = require("mongoose");

const deploymentHistorySchema = new mongoose.Schema({
  developerId: { type: mongoose.Types.ObjectId, ref: "Developer" },
  deploymentHistory: { type: Array },
});

module.exports = mongoose.model(
  "deployedDevelopersHistory",
  deploymentHistorySchema
);
