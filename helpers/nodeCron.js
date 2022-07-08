const nodeCron = require("node-cron");

nodeCron.schedule("0 0 * * * *", async () => {
  let schedules = await interviewScheduleModel
    .find({})
    .populate({
      path: "developerId",
      select: { _id: 0, firstName: 1, lastName: 1 },
    })
    .populate({ path: "clientId", select: { _id: 0, companyName: 1 } })
    .populate({ path: "agencyId", select: { _id: 0, agencyName: 1 } });
  console.log(schedules);
  for (let element of schedules) {
    if (
      element.date.getDate() - 1 === new Date().getDate() &&
      element.date.getMonth() === new Date().getMonth() &&
      element.date.getFullYear() === new Date().getFullYear()
    ) {
      let emailIds = await User.aggregate([
        { $match: { role: "Admin" } },
        { $project: { _id: 0, email: 1 } },
      ]);
      let adminEmail = emailIds.map((element) => element.email);
      sendEmail(adminEmail, "Interview Schedule for tomorrow", "testing4.hbs", {
        developerName:
          element.developerId.firstName + " " + element.developerId.lastName,
        onDate: element.date,
        startTime: element.startTime,
        endTime: element.endTime,
        meetLink: element.googleMeetLink,
        clientName: element.clientId.companyName,
        agencyName: element.agencyId.agencyName,
        status: element.status,
      });
    }
    if (
      element.date.getDate() === new Date().getDate() &&
      element.date.getMonth() === new Date().getMonth() &&
      element.date.getFullYear() === new Date().getFullYear() &&
      element.date.getHours() - 1 === new Date().getHours
    ) {
      let emailIds = await User.aggregate([
        { $match: { role: "Admin" } },
        { $project: { _id: 0, email: 1 } },
      ]);
      let adminEmail = emailIds.map((element) => element.email);
      sendEmail(adminEmail, "Interview Schedule for today", "testing4.hbs", {
        developerName:
          element.developerId.firstName + " " + element.developerId.lastName,
        onDate: element.date,
        startTime: element.startTime,
        endTime: element.endTime,
        meetLink: element.googleMeetLink,
        clientName: element.clientId.companyName,
        agencyName: element.agencyId.agencyName,
        status: element.status,
      });
    }
  }
});
