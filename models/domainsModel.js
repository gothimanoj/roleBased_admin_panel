const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const domainSchema = new mongoose.Schema(
    {
        domainName: {
            type: String,
            required: true,
            unique: true,
        },
        domainIcon: {
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

domainSchema.plugin(mongoosePaginate);
domainSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Domain", domainSchema);
