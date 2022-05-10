const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const developerRoleSchema = new mongoose.Schema(
    {
        roleName: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

developerRoleSchema.plugin(mongoosePaginate);
developerRoleSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("DeveloperRole", developerRoleSchema);