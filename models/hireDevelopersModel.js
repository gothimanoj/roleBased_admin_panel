const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { DEVELOPER_BILLING_MODE } = require("../helpers/constants");
require('./agenciesModel')
const agenciesMatchedSchema = new mongoose.Schema(
    {
        agencyId: {
            type: mongoose.Types.ObjectId,
            ref: "Agency",
        },
        reply: {
            type: String,
        },
        isShortListed: {
            type: Boolean,
            default:false,
        },
        interested: {
            type: Number,
            default:0,
        }
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
            type: String,
        },
        preferredBillingMode: {
            type: String,
            enum: DEVELOPER_BILLING_MODE,
        },
        averageBudget: {
            type: String,
        },
        expectedStartDate: {
            type: String,
        },
        contractPeriod: {
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
