// const cron = require("node-cron");

// // nodeCron.schedule("0 0 * * * *", async () => {
//   // let schedules = await interviewScheduleModel
//   //   .find({})
//   //   .populate({
//   //     path: "developerId",
//   //     select: { _id: 0, firstName: 1, lastName: 1 },
//   //   })
//   //   .populate({ path: "clientId", select: { _id: 0, companyName: 1 } })
//   //   .populate({ path: "agencyId", select: { _id: 0, agencyName: 1 } });
//   // console.log(schedules);
//   // for (let element of schedules) {
//   //   if (
//   //     element.date.getDate() - 1 === new Date().getDate() &&
//   //     element.date.getMonth() === new Date().getMonth() &&
//   //     element.date.getFullYear() === new Date().getFullYear()
//   //   ) {
//   //     let emailIds = await User.aggregate([
//   //       { $match: { role: "Admin" } },
//   //       { $project: { _id: 0, email: 1 } },
//   //     ]);
//   //     let adminEmail = emailIds.map((element) => element.email);
//   //     sendEmail(adminEmail, "Interview Schedule for tomorrow", "testing4.hbs", {
//   //       developerName:
//   //         element.developerId.firstName + " " + element.developerId.lastName,
//   //       onDate: element.date,
//   //       startTime: element.startTime,
//   //       endTime: element.endTime,
//   //       meetLink: element.googleMeetLink,
//   //       clientName: element.clientId.companyName,
//   //       agencyName: element.agencyId.agencyName,
//   //       status: element.status,
//   //     });
//   //   }
//   //   if (
//   //     element.date.getDate() === new Date().getDate() &&
//   //     element.date.getMonth() === new Date().getMonth() &&
//   //     element.date.getFullYear() === new Date().getFullYear() &&
//   //     element.date.getHours() - 1 === new Date().getHours
//   //   ) {
//   //     let emailIds = await User.aggregate([
//   //       { $match: { role: "Admin" } },
//   //       { $project: { _id: 0, email: 1 } },
//   //     ]);
//   //     let adminEmail = emailIds.map((element) => element.email);
//   //     sendEmail(adminEmail, "Interview Schedule for today", "testing4.hbs", {
//   //       developerName:
//   //         element.developerId.firstName + " " + element.developerId.lastName,
//   //       onDate: element.date,
//   //       startTime: element.startTime,
//   //       endTime: element.endTime,
//   //       meetLink: element.googleMeetLink,
//   //       clientName: element.clientId.companyName,
//   //       agencyName: element.agencyId.agencyName,
//   //       status: element.status,
//   //     });
//   //   }
//   // }
// // });


// const moment = require("moment");
// const devloperSchema = require("../models/developersModel");
// const interview = require("../models/interviewSchedule");
// const nodemailer = require("nodemailer");

// // console.log("aaaaaa");
// cron.schedule("5 * * * * ", async () => {
//     try {
//         let date = new Date().getDate();
//         let month = new Date().getMonth();
//         let year = new Date().getFullYear();
//         let today = `${year}/${month + 1}/${date}`;
//         let nextday = `${year}/${month + 1}/${date + 1}`;
//         let data = await interview
//             .find({
//                 date: { $gte: new Date(today), $lt: new Date(nextday) },
//                 status: "pending",
//             })
//             .select(
//                 "startTime endTime googleMeetLink status vendoremail -_id date "
//             )
//             .populate("developerId");

//         var transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: "sachin.shethink@gmail.com",
//                 pass: "xctfzfwvmloevfht",
//             },
//         });
//         let obj = {};
//         for (i = 0; i < data.length; i++) {
//             obj =
//                 data[i].developerId.firstName +
//                 " " +
//                 data[i].developerId.lastName;
//         }

//         let newArr = [];
//         let s = [];
//         let google = [];
//         let time = [];
//         let startTime = [];
//         let endTime = [];
//         let convertTimeArr = [];
//         for (let i = 0; i < data.length; i++) {
//             newArr[i] = data[i]._doc.email;
//             s[i] = data[i].status;
//             google[i] = data[i].googleMeetLink;
//             time[i] = data[i].date;
//             // console.log("sdfghj", time[i]);
//             startTime[i] = data[i].startTime;
//             endTime[i] = data[i].endTime;

//             convertTimeArr = moment(time[i]).format("DD-MMM-YYYY");
//         }

//         for (let i = 0; i < newArr.length; i++) {
//             var mailOptions = {
//                 from: "sachin.shethink@gmail.com",
//                 subject: "Email",
//                 html:
//                     '<p>click <a href="' +
//                     google[i] +
//                     '">GoogleMeetLink</a><br><b>Interview Status : ' +
//                     s[i] +
//                     "</b><br><b>Start Time : " +
//                     startTime[i] +
//                     "</b><br><b>End Time : " +
//                     endTime[i] +
//                     "</b><br><b>Date : " +
//                     convertTimeArr +
//                     "</b><br><b>Developer Name : " +
//                     obj +
//                     "</b></p> ",
//                 to: newArr[i],
//             };

//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                 } else {
//                     console.log("Email sent: " + info.response);
//                 }
//             });
//         }
//     } catch (e) {
//         console.log(e);
//     }
// });
