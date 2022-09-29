const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");


const interviewHistorySchema = new mongoose.Schema({
  developerId: { type: mongoose.Types.ObjectId, ref: "developer" },
  history: { type: Array },
});
interviewHistorySchema.plugin(mongoosePaginate);
interviewHistorySchema.plugin(mongooseAggregatePaginate);


module.exports = mongoose.model("interviewHistory", interviewHistorySchema);
