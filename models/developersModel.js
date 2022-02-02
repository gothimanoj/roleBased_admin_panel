const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const developerExpertiesSchema = new mongoose.Schema({
    expertiesId: {
        type: mongoose.Types.ObjectId,
        ref: "Experty",
    },
    expertiesBaseAmount: {
        type: Number,
        default: 0,
    },
    isAmountNegotiable: {
        type: Boolean,
        default: true,
    },
});

const developerDocumentsSchema = new mongoose.Schema({
    documentName: {
        type: String,
        default: "",
    },
    documentLink: {
        type: String,
        default: "",
    },
});

const socialPlatformDetailsSchema = new mongoose.Schema({
    platformName: {
        type: String,
        default: "",
    },
    platformLink: {
        type: String,
        default: "",
    },
    platformTitle: {
        type: String,
        default: "",
    },
    platformImage: {
        type: String,
        default: "",
    },
    platformDescription: {
        type: String,
        default: "",
    },
});

const developerSchema = new mongoose.Schema(
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
            required: false,
        },
        userEmail: {
            type: String,
            required: false,
        },
        countryCode: {
            type: String,
            required: false,
        },
        userPhone: {
            type: Number,
            required: false,
        },
        password: {
            type: String,
            required: false,
        },
        developerDesignation: {
            type: String,
            required: true,
        },
        developerExpertise: [developerExpertiesSchema],
        developerTechnologies: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Technology",
            },
        ],
        developerDocuments: [developerDocumentsSchema],
        socialPlatformDetails: [socialPlatformDetailsSchema],
        isRemoteDeveloper: {
            type: Boolean,
            default: false,
        },
        agencyId: {
            type: mongoose.Types.ObjectId,
            ref: "Agency",
        },
        developerExperience: {
            type: Number,
            default: 0,
        },
        developerPriceRange: {
            type: Number,
            default: 0,
        },
        developerAvailability: {
            type: Number,
            default: 0,
        },
        isDeveloperActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

developerSchema.plugin(mongoosePaginate);
developerSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Developer", developerSchema);
