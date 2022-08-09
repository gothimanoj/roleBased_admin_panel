require("dotenv").config();
const Developer = require("../models/developersModel");
const DeveloperRole = require("../models/developerRolesModel");
const Technology = require("../models/technologiesModel");
const Agency = require("../models/agenciesModel");
const Client = require("../models/clientsModel");
const interviewScheduleModel = require("../models/interviewSchedule");
const InterviewHistory = require("../models/interviewHistory");
const NotificationModel = require("../models/notificationsModel");
const DeveloperDeployment = require("../models/deploymentModel");
const DeploymentHistory = require("../models/deploymentHistory");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const excelJS = require("exceljs");
const sendEmail = require("../helpers/mailHelper");
const sendNotification = require("../helpers/notificationSender");

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
          isInterviewScheduled: 1,
          developerRoles: 1,
          expectedPrice: 1,
          createdAt:1
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
      let doc = new NotificationModel({
        notificationTitle: "congratulations a new developer has registered",
        notificationData: "A new developer has registered successfully",
        userId: req.user._id,
        userType: "Admin",
        url: "",
      });
      await doc.save();
      return res.status(200).json({
        success: true,
        msg: "developer created successfully",
        notification: doc,
      });
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
      const { startTime, endTime, date, meetLink, clientId } = req.body;
      const { developerId } = req.params;
      let agencyId = await Developer.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(developerId) } },
        { $project: { _id: 0, agencyId: 1 } },
      ]);
      let doc = new interviewScheduleModel({
        date,
        startTime,
        endTime,
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
        startTime: result[0].startTime,
        endTime: result[0].endTime,
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
      let doc3 = new NotificationModel({
        notificationTitle:
          "congratulations your developer's interview has been scheduled",
        notificationData: "A developer's interview has been scheduled",
        userId: req.user._id,
        userType: "Admin",
        url: "",
      });
      await doc3.save();
      return res.status(200).json({ success: true, notification: doc3 });
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
      const { clientId, startDate, endDate, contractDuration } = req.body;
      const { developerId } = req.params;
      let result = await Developer.findOne({
        _id: mongoose.Types.ObjectId(developerId),
      }).populate({ path: "agencyId", select: { _id: 1, agencyName: 1 } });
      let clientInfo = await Client.findOne({
        _id: mongoose.Types.ObjectId(clientId),
      });
      let doc = new DeveloperDeployment({
        developer: developerId,
        agency: result.agencyId._id,
        clientName: clientInfo.companyName,
        contactPersonName: clientInfo.firstName + " " + clientInfo.lastName,
        contactPersonEmail: clientInfo.userEmail,
        contactPersonPhone: clientInfo.countryCode + clientInfo.userPhone,
        startDate,
        endDate,
        contractDuration,
      });
      await doc.save();
      let obj = {
        developerName: result.firstName + " " + result.lastName,
        agencyName: result.agencyId.agencyName,
        clientName: clientInfo.companyName,
        contactPersonName: clientInfo.firstName + " " + clientInfo.lastName,
        contactPersonEmail: clientInfo.userEmail,
        contactPersonPhone: clientInfo.countryCode + clientInfo.userPhone,
        startDate: doc.startDate,
        endDate: doc.endDate,
        contractDuration: doc.contractDuration,
      };

      let check = await DeploymentHistory.findOneAndUpdate(
        { developerId },
        { $push: { deploymentHistory: obj } }
      );
      if (check) {
      } else {
        let doc2 = new DeploymentHistory({
          developerId: developerId,
          deploymentHistory: obj,
        });
        await doc2.save();
      }
      let doc3 = new NotificationModel({
        notificationTitle:
          "congratulations your developer deployed to a client",
        notificationData: "A developer has been deployed to a client",
        userId: req.user._id,
        userType: "Admin",
        url: "",
      });
      await doc3.save();
      return res.status(200).json({ success: "true", notification: doc3 });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getDeploymentHistory: async (req, res) => {
    try {
      const { developerId } = req.params;
      let result = await DeploymentHistory.findOne({
        developerId: developerId,
      });
      return res.status(200).json({ success: "true", result });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getSearchDeveloper: async (req, res) => {
    try {
      const { page, limit } = req.params;
      const options = {
        page: +page || 0,
        limit: +limit || 20,
        select: "-password",
      };
      console.log(req.params)
      const developers = await Developer.find(
        {
          $or: [
            { firstName: { $regex: req.params.key,$options:'i' }},
            { lastName: { $regex: req.params.key,$options:'i' } },
            // { userName: { $regex: req.params.key } },
          ],
        },
     
      ).populate("developerTechnologies")
      // .populate("agencyId");
      res.status(200).json({ success: true, developers });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
};

module.exports = developer;
