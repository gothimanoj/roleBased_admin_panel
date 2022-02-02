const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

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

const clientSchema = new mongoose.Schema(
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
        userDesignation: {
            type: String,
            default: "",
        },
        companyName: {
            type: String,
            default: "",
        },
        clientLogo: {
            type: String,
            default: "",
        },
        socialPlatformDetails: [socialPlatformDetailsSchema],
    },
    {
        timestamps: true,
    }
);

clientSchema.plugin(mongoosePaginate);
clientSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Client", clientSchema);
