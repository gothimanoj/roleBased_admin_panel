const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { DEVELOPER_BILLING_MODE } = require("../helpers/constants");
require("./agenciesModel");
const agenciesMatchedSchema = new mongoose.Schema(
  {
    agencyId: {
      type: mongoose.Types.ObjectId,
      ref: "agency",
    },
    reply: {
      type: String,
    },
    isShortListed: {
      type: Boolean,
      default: false,
    },
    interested: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const hireDeveloperSchema = new mongoose.Schema(
  {
    requirementName: {
      type: String,
    },
    clientId: {
      type: mongoose.Types.ObjectId,
      ref: "Client",
    },
    developerRolesRequired: [
      {
        type: String,
        ref: "developerroles",

      },
    ],
    numberOfResourcesRequired: {
      type: Number,
    },
    developerTechnologiesRequired: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Technology",
      },
    ],
    developerExperienceRequired: {
      min: Number,
      max: Number,
    },
    preferredBillingMode: {
      type: String,
      enum: DEVELOPER_BILLING_MODE,
    },
    averageBudget: {
      min: Number,
      max: Number,
    },
    expectedStartDate: {
      type: String,
    },
    contractPeriod: {
      type: String,
    },
    isVisible:{
      type:Boolean,
      default:false
    },
    isVerifiedByAdmin:{
      type:Boolean,
      default:false
    },
    jobDescription: {
      type: String,
    },
    agenciesMatched: [agenciesMatchedSchema],
  },
  {
    timestamps: true,
  }
);

hireDeveloperSchema.plugin(mongoosePaginate);
hireDeveloperSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("HireDeveloper", hireDeveloperSchema);
