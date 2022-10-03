const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const errorSchema = new mongoose.Schema(
    {
        urlname: [
            {
                type: String,
            }
            
            
        ],
        date: {
            type: String,

            
        }, 
    },
    {
        timestamps: true,
    }
);

errorSchema.plugin(mongoosePaginate);
errorSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("errorstatuse", errorSchema);
