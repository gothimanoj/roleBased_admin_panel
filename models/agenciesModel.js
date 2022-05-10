const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");
require('./domainsModel')
const agencyDocumentsSchema = new mongoose.Schema(
    {
        documentName: {
            type: String,
            default: "",
        },
        documentLink: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const socialPlatformDetailsSchema = new mongoose.Schema(
    {
        platformName: {
            type: String,
            default: "",
        },
        platformLink: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const agencyDomainsSchema = new mongoose.Schema(
    {
        domainId: {
            type: mongoose.Types.ObjectId,
            ref: "Domain",
        },
        domainBaseAmount: {
            type: Number,
            default: 0,
        },
        isAmountNegotiable: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const agencyAddressSchema = new mongoose.Schema(
    {
        address: {
            type: String,
            default: "",
        },
        location: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const agencyRulesSchema = new mongoose.Schema(
    {
        ruleId: {
            type: mongoose.Types.ObjectId,
            ref: "AgencyRule",
        },
        selection: {
            type: Boolean,
        },
    },
    {
        timestamps: true,
    }
);

const agencyTimingSchema = new mongoose.Schema(
    {
        startTime: {
            type: String,
        },
        endTime: {
            type: String,
        },
        weekendOpen: {
            type: Boolean
        }
    },
    {
        timestamps: true,
    }
);

const agencySchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        userEmail: {
            type: String,
            required: true,
            unique: true,
        },
        isUserEmailVerified: {
            type: Boolean,
            default: false,
        },
        countryCode: {
            type: String,
            required: true,
        },
        userPhone: {
            type: Number,
            required: true,
            unique: true,
        },
        isUserPhoneVerified: {
            type: Boolean,
            default: false,
        },
        password: {
            type: String,
            required: true,
        },
        agencyName: {
            type: String,
            default: "",
        },
        ownerName: {
            type: String,
            default: "",
        },
        agencyEmail: {
            type: String,
            default: "",
        },
        agencyPhone: {
            type: Number,
            default: null,
        },
        agencyDescription: {
            type: String,
            default: "",
        },
        agencyLogo: {
            type: String,
            default: "",
        },
        incorporationDate: {
            type: Date,
            default: "",
        },
        agencyTeamSize: {
            type: Number,
            default: 0,
        },
        isAgencyRegistered: {
            type: Boolean,
            default: true,
        },
        agencyAddress: agencyAddressSchema,
        isAgencyVerified: {
            type: Boolean,
            default: false,
        },
        verificationMessage: {
            type: String,
            default: "Agency verifi_idcation is still pending by our team.",
        },
        agencyAverageRating: {
            type: Number,
            default: 0,
        },
        stepsCompleted: {
            type: Number,
            default: 0,
        },
        agencyProfileViewCount: {
            type: Number,
            default: 0,
        },
        agencyMonthlyBudget: {
            type: Number,
            default: null,
        },
        agencyDomains: [agencyDomainsSchema],
        agencyServices: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Service",
            },
        ],
        agencyTechnologies: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Technology",
            },
        ],
        productId: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
        },
        agencyDocuments: [agencyDocumentsSchema],
        socialPlatformDetails: [socialPlatformDetailsSchema],
        agencyRules: [agencyRulesSchema],
        agencyTiming: agencyTimingSchema,
        assignedToUserId:{
            type: mongoose.Types.ObjectId,
            ref: "Users",
        }
    },
    {
        timestamps: true,
    }
);

agencySchema.plugin(mongoosePaginate);
agencySchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Agency", agencySchema);
