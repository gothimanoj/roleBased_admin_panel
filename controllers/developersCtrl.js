require("dotenv").config();
const Developer = require("../models/developersModel");
const DeveloperRole = require("../models/developerRolesModel");
const Technology = require("../models/technologiesModel");
const Agency = require("../models/agenciesModel");
const interviewScheduleModel = require("../models/interviewSchedule");
const InterviewHistory = require("../models/interviewHistory");
const DeveloperDeployment = require("../models/deploymentModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const excelJS = require("exceljs");
const sendEmail = require("../helpers/mailHelper");
const nodeCron = require("node-cron");

nodeCron.schedule("0 0 10 * * *", async () => {
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
      element.date.getFullYear() === new Date().getFullYear() &&
      element.isInterviewScheduled === true
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
        onTime: element.time,
        meetLink: element.googleMeetLink,
        clientName: element.clientId.companyName,
        agencyName: element.agencyId.agencyName,
        status: element.status,
      });
    }
  }
});

const developer = {
  getAllDeveloper: async (req, res) => {
    try {
      const { page, limit } = req.params;
      const options = {
        page: +page || 1,
        limit: +limit || 20,
      };

      const aggregation = [];
      if (req.query.getByTech) {
        const allId = [];
        const newArray = req.query.getByTech.split(",");
        for (let index = 0; index < newArray.length; index++) {
          allId.push(mongoose.Types.ObjectId(newArray[index]));
        }
        aggregation.push({
          $match: {
            developerTechnologies: {
              $all: allId,
            },
          },
        });
      }

      if (req.query.getByVerified) {
        aggregation.push({
          $match: {
            isVerified: true,
          },
        });
      }

      if (req.query.getByAgencyId) {
        aggregation.push({
          $match: {
            agencyId: mongoose.Types.ObjectId(req.query.getByAgencyId),
          },
        });
      }

      if (req.query.maxPriceRange && req.query.minPriceRange) {
        aggregation.push({
          $match: {
            developerPriceRange: {
              $gte: +req.query.minPriceRange,
              $lt: +req.query.maxPriceRange,
            },
          },
        });
      }

      if (req.query.getByDeveloperStatus) {
        aggregation.push({
          $match: {
            isTested: req.query.getByDeveloperStatus,
          },
        });
      }

      if (req.query.maxExperience && req.query.minExperience) {
        console.log({
          $match: {
            developerExperience: {
              $gte: +req.query.maxExperience,
              $lt: +req.query.minExperience,
            },
          },
        });
        aggregation.push({
          $match: {
            developerExperience: {
              $gte: +req.query.minExperience,
              $lt: +req.query.maxExperience,
            },
          },
        });
      }

      if (req.query.developerRole) {
        aggregation.push({
          $match: {
            developerRole: mongoose.Types.ObjectId(req.query.developerRole),
          },
        });
      }

      if (req.query.nameSearch) {
        aggregation.push({
          $match: {
            _id: mongoose.Types.ObjectId(req.query.nameSearch),
          },
        });
      }

      aggregation.push(
        {
          $lookup: {
            from: "agencies",
            let: { id: "$agencyId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$id"] },
                },
              },
              {
                $project: {
                  agencyName: 1,
                },
              },
            ],
            as: "agencyId",
          },
        },
        {
          $lookup: {
            from: "technologies",
            let: { technologiesId: "$developerTechnologies" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ["$_id", "$$technologiesId"],
                  },
                },
              },
              {
                $project: {
                  technologyName: 1,
                  _id: 0,
                },
              },
            ],
            as: "developerTechnologies",
          },
        },
        {
          $unwind: "$agencyId",
        }
      );

      aggregation.push({
        $project: {
          firstName: 1,
          lastName: 1,
          developerExpertise: 1,
          developerPriceRange: 1,
          developerExperience: 1,
          developerTechnologies: 1,
          isRemoteDeveloper: 1,
          developerDesignation: 1,
          isDeveloperActive: 1,
          developerDocuments: 1,
          agencyId: 1,
          isVerified: 1,
          isTested: 1,
          developerRoles: 1,
          expectedPrice: 1,
        },
      });

      aggregation.push({
        $sort: {
          createdAt: -1,
        },
      });

      const aggregatePipeline = Developer.aggregate(aggregation);
      const getAllDeveloper = await Developer.aggregatePaginate(
        aggregatePipeline,
        options
      );
      return res.status(200).json({ success: true, getAllDeveloper });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  setDeveloper: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        developerDesignation,
        developerTechnologies,
        agencyName,
        developerExperience,
        developerPriceRange,
        developerAvailability,
        expectedPrice,
        isTested,
        developerRoles,
      } = req.body;
      let ids = [];
      for (let i = 0; i < developerTechnologies.length; i++) {
        let Obj = await Technology.findOne({
          technologyName: developerTechnologies[i],
        });
        ids.push(Obj._id);
      }
      let agency = await Agency.findOne({ agencyName });
      let developer_role = await DeveloperRole.findOne({
        roleName: developerRoles,
      });
      const devDoc = new Developer({
        firstName,
        lastName,
        developerDesignation,
        developerTechnologies: ids,
        agencyId: agency._id,
        developerExperience,
        developerPriceRange,
        developerAvailability,
        expectedPrice,
        isTested,
        developerRoles: developer_role._id,
      });
      await devDoc.save();
      return res
        .status(200)
        .json({ success: true, msg: "developer created successfully" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  updateSingleDeveloper: async (req, res) => {
    try {
      const findDeveloper = await Developer.findOne({ _id: req.params.id });
      const { expectedPrice, isVerified, isTested } = req.body;
      findDeveloper.expectedPrice =
        +expectedPrice || findDeveloper.expectedPrice;
      findDeveloper.isVerified = isVerified || findDeveloper.isVerified;
      findDeveloper.isTested = isTested || findDeveloper.isTested;
      const updatedDeveloper = await findDeveloper.save();
      return res
        .status(200)
        .json({ success: true, msg: "Updated Successfully " });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  getAllDeveloperName: async (req, res) => {
    try {
      const allName = await Developer.aggregate([
        {
          $project: {
            firstName: 1,
            lastName: 1,
          },
        },
      ]);
      return res.status(200).json({ success: true, allName });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  getAllRole: async (req, res) => {
    try {
      const gelAllRole = await DeveloperRole.aggregate([
        {
          $project: {
            roleName: 1,
          },
        },
      ]);
      return res.status(200).json({ success: true, gelAllRole });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  getAllTech: async (req, res) => {
    try {
      const getAllTech = await Technology.aggregate([
        {
          $project: {
            technologyName: 1,
          },
        },
      ]);
      return res.status(200).json({ success: true, getAllTech });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  getSpecificDevelopers: async (req, res) => {
    try {
      const { none, verified, available, unavailable } = req.query;
      let arr = [];
      let file_name;
      if (verified) {
        file_name = "verifiedDevelopers";
        arr = await Developer.find({ isVerified: true })
          .populate({
            path: "developerTechnologies",
            select: { _id: 0, technologyName: 1 },
          })
          .populate({
            path: "agencyId",
            select: { _id: 0, agencyName: 1 },
          });
        // .populate({
        //   path: "developerRoles",
        //   select: { _id: 0, roleName: 1 },
        // });
      }
      if (available) {
        file_name = "availableDevelopers";
        arr = await Developer.find({ developerAvailability: true })
          .populate({
            path: "developerTechnologies",
            select: { _id: 0, technologyName: 1 },
          })
          .populate({
            path: "agencyId",
            select: { _id: 0, agencyName: 1 },
          });
        // .populate({
        //   path: "developerRoles",
        //   select: { _id: 0, roleName: 1 },
        // });
      }
      if (unavailable) {
        file_name = "unAvailableDevelopers";
        arr = await Developer.find({ developerAvailability: false })
          .populate({
            path: "developerTechnologies",
            select: { _id: 0, technologyName: 1 },
          })
          .populate({
            path: "agencyId",
            select: { _id: 0, agencyName: 1 },
          });
        // .populate({
        //   path: "developerRoles",
        //   select: { _id: 0, roleName: 1 },
        // });
      }
      let data = [];
      for (let i = 0; i < arr.length; i++) {
        let obj = {};
        obj.firstName = arr[i].firstName;
        obj.lastName = arr[i].lastName;
        obj.agencyName = arr[i].agencyId.agencyName;
        obj.developerEmail = "";
        obj.developerTechnologies = arr[i].developerTechnologies
          .map((element) => element.technologyName)
          .join(", ");
        obj.developerDesignation = arr[i].developerDesignation;
        obj.developerRole = "";
        obj.developerExperience = arr[i].developerExperience;
        obj.developerPriceRange = arr[i].developerPriceRange;
        obj.expectedPrice = arr[i].expectedPrice;
        obj.isDeveloperActive = arr[i].isDeveloperActive;
        obj.isDeveloperVerified = arr[i].isVerified;
        obj.developerAvailability = arr[i].developerAvailability;
        obj.developerDocuments = arr[i].developerDocuments
          .map((element) => element.documentLink)
          .join(", ");
        data.push(obj);
      }
      const workbook = new excelJS.Workbook(); // Create a new workbook
      const worksheet = workbook.addWorksheet("My Users"); // New Worksheet
      // Column for data in excel. key must match data key
      worksheet.columns = [
        { header: "S no.", key: "s_no", width: 20 },
        { header: "firstName", key: "firstName", width: 20 },
        { header: "lastName", key: "lastName", width: 20 },
        { header: "agencyName", key: "agencyName", width: 20 },
        { header: "developerEmail", key: "developerEmail", width: 20 },
        {
          header: "developerTechnologies",
          key: "developerTechnologies",
          width: 20,
        },
        {
          header: "developerDesignation",
          key: "developerDesignation",
          width: 20,
        },
        { header: "developerRole", key: "developerRole", width: 20 },
        {
          header: "developerExperience",
          key: "developerExperience",
          width: 20,
        },
        {
          header: "developerPriceRange",
          key: "developerPriceRange",
          width: 20,
        },
        { header: "expectedPrice", key: "expectedPrice", width: 20 },
        { header: "isDeveloperActive", key: "isDeveloperActive", width: 20 },
        {
          header: "isDeveloperVerified",
          key: "isDeveloperVerified",
          width: 20,
        },
        {
          header: "developerAvailability",
          key: "developerAvailability",
          width: 20,
        },
        { header: "developerDocuments", key: "developerDocuments", width: 20 },
      ];
      // Looping through User data
      let counter = 1;
      data.forEach((user) => {
        user.s_no = counter;
        worksheet.addRow(user); // Add data in worksheet
        counter++;
      });
      // Making first line in excel bold
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + `${file_name}.xlsx`
      );
      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  setInterviewSchedule: async (req, res) => {
    try {
      const { time, date, meetLink, clientId } = req.body;
      const { developerId } = req.params;
      let agencyId = await Developer.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(developerId) } },
        { $project: { _id: 0, agencyId: 1 } },
      ]);
      let doc = new interviewScheduleModel({
        date,
        time,
        googleMeetLink: meetLink,
        developerId: developerId,
        clientId: clientId,
        agencyId: agencyId[0].agencyId,
        status: "pending",
      });
      await doc.save();
      let result = await interviewScheduleModel
        .find({ developerId })
        .sort({ createdAt: -1 })
        .populate({
          path: "developerId",
          select: { _id: 0, firstName: 1, lastName: 1 },
        })
        .populate({ path: "clientId", select: { _id: 0, companyName: 1 } })
        .populate({ path: "agencyId", select: { _id: 0, agencyName: 1 } });
      let emailIds = await User.aggregate([
        { $match: { role: "Admin" } },
        { $project: { _id: 0, email: 1 } },
      ]);
      let adminEmail = emailIds.map((element) => element.email);
      let obj = {
        developerName:
          result[0].developerId.firstName +
          " " +
          result[0].developerId.lastName,
        onDate: result[0].date,
        onTime: result[0].time,
        meetLink: result[0].googleMeetLink,
        clientName: result[0].clientId.companyName,
        agencyName: result[0].agencyId.agencyName,
        status: result[0].status,
      };
      let check2 = await InterviewHistory.findOneAndUpdate(
        { developerId },
        { $push: { history: obj } }
      );
      if (check2) {
      } else {
        let doc2 = new InterviewHistory({
          developerId: developerId,
          history: obj,
        });
        await doc2.save();
      }
      sendEmail(adminEmail, "Interview Schedule", "testing3.hbs", obj);
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getInterviewHistory: async (req, res) => {
    try {
      const { id } = req.params;
      let result = await InterviewHistory.findOne({ developerId: id });
      return res.status(200).json({ success: "true", result });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  developerDeployment: async (req, res) => {
    try {
      const { clientName, startDate, endDate, contractDuration } = req.body;
      const { developerId } = req.params;
      // let result = await Agency.aggregate;
      let doc = new DeveloperDeployment({
        developer: developerId,
        agency: agencyId,
        clientName,
        startDate,
        endDate,
        contractDuration,
      });
      await doc.save();
      return res.status(200).json({ success: "true" });

      //      developer: { type: mongoose.Types.ObjectId, ref: "Developer" },
      // agency: { type: mongoose.Types.ObjectId, ref: "Agency" },
      // clientName: { type: String, required: true },
      // startDate: { type: Date, required: true },
      // endDate: { type: Date, required: true },
      // contractDuration: { type: String, required: true },
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = developer;
