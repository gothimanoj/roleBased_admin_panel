const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const requestForDeveloper = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    agencyId: {
      type: mongoose.Types.ObjectId,
      ref: "Agency",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

requestForDeveloper.plugin(mongoosePaginate);
requestForDeveloper.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("RequestFroDeveloper", requestForDeveloper);
