const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const serviceSchema = new mongoose.Schema(
    {
        serviceName: {
            type: String,
            required: true,
            unique: true,
        },
        serviceIcon: {
            type: String,
            required: false,
            default: "",
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

serviceSchema.plugin(mongoosePaginate);
serviceSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Service", serviceSchema);
