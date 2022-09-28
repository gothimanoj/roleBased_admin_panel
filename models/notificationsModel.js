const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { NOTIFICATION_TYPE, ROLES } = require("../helpers/constants");

const notificationSchema = new mongoose.Schema(
    {
        notificationType: {
            type: String,
            enum: NOTIFICATION_TYPE,
        },
        userId: {
            type: mongoose.Types.ObjectId,
        },
        userType: {
            type: String,
            enum: ROLES,
        },
        notificationTitle: {
            type: String,
        },
        notificationData: {
            type: String,
        },
        isNotificationRead: {
            type: Boolean,
            default: false,
        },
        isVisible: {
            type: Boolean,
            default: true,
        },
        url:{
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

notificationSchema.plugin(mongoosePaginate);
notificationSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Notification", notificationSchema);
