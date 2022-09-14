require("dotenv").config();
const HireDeveloper = require("../models/hireDevelopersModel");
const mongoose = require("mongoose");
const sendEmail = require("../helpers/mailHelper");
const developer = require("./developersCtrl");

const hireDeveloper = {
  getAllRequirement: async (req, res) => {
    try {
      const { page, limit } = req.params;
      const options = {
        page: +page || 1,
        limit: +limit || 20,
      };
      const agencies = HireDeveloper.aggregate([
        {
          $lookup: {
            from: "technologies",
            let: { technologiesId: "$developerTechnologiesRequired" },
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
            as: "developerTechnologiesRequired",
          },
        },
        {
          $lookup: {
            from: "clients",
            let: { clientId: "$clientId" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$clientId"] } } },
              {
                $project: {
                  firstName: 1,
                  lastName: 1,
                  userName: 1,
                  companyName: 1,
                  userEmail:1,
                  countryCode:1,
                  userPhone:1,
                  userDesignation:1
                },
              },
            ],
            as: "clientId",
          },
        },
        {
          $lookup: {
            from: "developerroles",
            let: { developerroles: "$developerRolesRequired" },

            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ["$_id", "$$developerroles"],
                  },
                },
              },
              {
                $project: {
                  roleName: 1
                },
              },

            ],
            as: "developerRolesRequired",
          },
        },
        { $sort: { createdAt: -1 }} ,
      ])
      const allRequirement = await HireDeveloper.aggregatePaginate(
        agencies,
        options
      );
      return res.json({ success: true, allRequirement });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  singleRequirement: async (req, res) => {
    try {
      const { id } = req.params;
           console.log(id)
           
      const singleRequirement = await HireDeveloper.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(id),
          },
        },
        {
          $unwind: {
            path: "$developersShared",
          },
        },
        {
          $lookup: {
            from: "agencies",
            localField: "developersShared.agencyId",
            foreignField: "_id",
            as: "agency",
          },
        },
        
        {
          $lookup: {
            from: "developers",
            localField: "developersShared.developerId",
            foreignField: "_id",
            as: "developer",
          },
        },
        {
          $lookup: {
            from: "clients",
            let: { id: "$clientId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$id"] },
                },
              },
              {
                $project: {
                  companyName: 1,
                  userDesignation:1,
                  firstName:1,
                  lastName:1,
                  userName:1,
                  countryCode:1,
                  userPhone:1,

                },
              },
            ],
            as: "clientDetails",
          },
        },
        {
          $lookup: {
            from: "technologies",
            let: { id: "$developerTechnologiesRequired" },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$_id", "$$id"] },
                },
              },
              {
                $project: {
                  technologyName: 1,
                },
              },
            ],
            as: "developerTechnologiesRequired",
          },
        },{
          $lookup: {
            from: "developerroles",
            let: { id: "$developerRolesRequired" },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$_id", "$$id"] },
                },
              },
              {
                $project: {
                  roleName: 1,
                },
              },
            ],
            as: "developerRolesRequired",
          },
        },
        {
          $unwind: {
            path: "$agency",
          },
        },
        {
          $unwind: {
            path: "$developer",
          },
        },
        {
          $project: {
            agency: 1,
            developer: 1,
            developersShared: 1,
            requirementName: 1,
            jobDescription: 1,
            clientDetails:1,
            developerRolesRequired: 1,
            numberOfResourcesRequired: 1,
            developerExperienceRequired: 1,
            averageBudget: 1,
            developerTechnologiesRequired: 1,
            contractPeriod: 1,
            expectedStartTime: 1,
            createdAt: 1
          },
        },
        { $sort: { createdAt: -1 } },
      ]);

      return res.json({ success: true, singleRequirement });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  singleRequirementById: async (req, res) => {
    try {
      const { id } = req.params;
      const singleRequirementById = await HireDeveloper.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "technologies",
            let: { id: "$developerTechnologiesRequired" },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$_id", "$$id"] },
                },
              },
              {
                $project: {
                  technologyName: 1,
                },
              },
            ],
            as: "developerTechnologiesRequired",
          },
        },
        {
          $project: {
            requirementName: 1,
            jobDescription: 1,
            developerRolesRequired: 1,
            numberOfResourcesRequired: 1,
            developerExperienceRequired: 1,
            averageBudget: 1,
            developerTechnologiesRequired: 1,
            contractPeriod: 1,
            expectedStartDate: 1,
            createdAt: 1
          },
        },
 
      ]);

      return res.json({ success: true, singleRequirementById });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  updateSingleRequirementById: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        requirementName,
        developerRolesRequired,
        numberOfResourcesRequired,
        developerTechnologiesRequired,
        developerExperienceRequired,
        preferredBillingMode,
        averageBudget,
        jobDescription,
        expectedStartTime,
        contractPeriod,
        clientId,
      } = req.body;
      const singleRequirementById = await HireDeveloper.findOne(
        mongoose.Types.ObjectId(id)
      );

      singleRequirementById.requirementName =
        requirementName || singleRequirementById.requirementName;
      singleRequirementById.developerRolesRequired =
        developerRolesRequired || singleRequirementById.developerRolesRequired;
      singleRequirementById.numberOfResourcesRequired =
        numberOfResourcesRequired || singleRequirementById.numberOfResourcesRequired;
      singleRequirementById.developerTechnologiesRequired =
        developerTechnologiesRequired || singleRequirementById.developerTechnologiesRequired;
      singleRequirementById.developerExperienceRequired =
        developerExperienceRequired ||
        singleRequirementById.developerExperienceRequired;
      singleRequirementById.preferredBillingMode =
        preferredBillingMode || singleRequirementById.preferredBillingMode;
      singleRequirementById.jobDescription =
        jobDescription || singleRequirementById.jobDescription;
      singleRequirementById.averageBudget =
        averageBudget || singleRequirementById.averageBudget;
      singleRequirementById.expectedStartDate =
        expectedStartTime?.toString() ||
        singleRequirementById.expectedStartDate;
      singleRequirementById.contractPeriod =
        contractPeriod || singleRequirementById.contractPeriod;
      singleRequirementById.clientId = clientId || singleRequirementById.clientId;
      await singleRequirementById.save();
      return res.json({ success: true, msg: "successfully updated" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  notificationValidation: async (req, res) => {
    try {
      const { value, id } = req.params;
      let check = parseInt(value);
      if (check) {
        await HireDeveloper.updateOne(
          {
            _id: mongoose.Types.ObjectId(id),
          }, 
          { $set: { isVerifiedByAdmin: true, isVisible: true } }
        );
      } else {
        await HireDeveloper.updateOne(
          { _id: mongoose.Types.ObjectId(id) },
          { $set: { isVerifiedByAdmin: false, isVisible: false } }
        );
      }
      let result = await HireDeveloper.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(id),
          },
        },
        {
          $project: {
            _id: 0,
            requirementName: 1,
            clientId: 1,
          },
        },
        {
          $lookup: {
            from: "clients",
            localField: "clientId",
            foreignField: "_id",
            as: "result",
          },
        },
      ]);

      let userEmail = [
        "guptamns3786@gmail.com",
        "bindu12patel@gmail.com",
        "shubham@shethink.in",
      ];
      sendEmail(userEmail, "user creation", "testing2.hbs", {
        requirementName: result[0].requirementName,
        clientName: result[0].result[0].companyName,
        adminName: req.user.firstName,
        link: `http://test.recruitbae.sourcebae.com`,
      });
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
}

module.exports = hireDeveloper;
