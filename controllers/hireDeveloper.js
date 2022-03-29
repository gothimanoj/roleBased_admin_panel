require("dotenv").config();
const HireDeveloper = require("../models/hireDevelopersModel");
const mongoose = require("mongoose");
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
                },
              },
            ],
            as: "clientId",
          },
        },
      ]);

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
          },
        },
      ]);

      return res.json({ success: true, singleRequirement });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = hireDeveloper;
