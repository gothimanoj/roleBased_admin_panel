const nodeCron = require("node-cron");
nodeCron.schedule("0 17 * * * *", async () => {
console.log("hello");
})
let obj = {
"isNotificationRead":false,
"isVisible":false,
"userId":{"$oid":"22c39a35a288e3e470741aa"},
"userType":"Agency",
"notificationTitle":"today is an interview",
"notificationData":"today is an interview of a developer",
"url":"",
"to":1
}