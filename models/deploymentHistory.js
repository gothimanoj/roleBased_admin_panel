const mongoose = require("mongoose");

const deploymentHistorySchema = new mongoose.Schema({
  developerName: { type: String },
  agencyName: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  contractDuration: { type: String },
  endByReason: { type: String },
});

module.exports = mongoose.model(
  "deployedDevelopersHistory",
  deploymentHistorySchema
);
