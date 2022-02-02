const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const technologySchema = new mongoose.Schema(
    {
        serviceId: {
            type: mongoose.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        technologyName: {
            type: String,
            unique: true,
            required: true,
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

technologySchema.plugin(mongoosePaginate);
technologySchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Technology", technologySchema);
