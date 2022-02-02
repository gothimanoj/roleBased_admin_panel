const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const expertiseSchema = new mongoose.Schema(
    {
        domainId: {
            type: mongoose.Types.ObjectId,
            ref: "Domain",
        },
        expertiseName: {
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

expertiseSchema.plugin(mongoosePaginate);
expertiseSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Expertise", expertiseSchema);
