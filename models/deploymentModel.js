const mongoose = require("mongoose");

const deploymentSchema = new mongoose.Schema({
  developer: { type: mongoose.Types.ObjectId, ref: "Developer" },
  agency: { type: mongoose.Types.ObjectId, ref: "Agency" },
  clientName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  contractDuration: { type: String, required: true },
});

module.exports = mongoose.model("deployedDevelopers", deploymentSchema);
