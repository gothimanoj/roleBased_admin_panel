const Notification = require("../models/notificationsModel");

let sendNotification = async (notificationTitle) => {
  try {
    let notification = await Notification.findOne({ notificationTitle });
    return notification;
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = sendNotification;
