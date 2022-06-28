const nodeCron = require("node-cron");

nodeCron.schedule("1 * 16 * * *", () => {
  console.log("hello");
});
