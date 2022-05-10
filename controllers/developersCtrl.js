require("dotenv").config();
const Developer = require("../models/developersModel");
const DeveloperRole = require("../models/developerRolesModel");
const Technology = require("../models/technologiesModel");
const mongoose = require("mongoose");
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
              $gte:+req.query.minPriceRange, 
              $lt:+req.query.maxPriceRange,
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
              $lt:+req.query.maxExperience,
            },
          },
        });
      }

      if (req.query.developerRole) {
        aggregation.push({
          $match: {
            developerRole:mongoose.Types.ObjectId(req.query.developerRole)
          },
        });
      }

      if (req.query.nameSearch) {
        aggregation.push({
          $match: {
            _id: mongoose.Types.ObjectId(req.query.nameSearch)
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
          isVerified:1,
          isTested:1,
          developerRoles:1,
          expectedPrice:1
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

  getAllTech:async (req, res) => {
    try {
     const getAllTech =await Technology.aggregate([
       {
         $project:{
          technologyName:1
         }
       }
     ])
     return res.status(200).json({ success: true, getAllTech });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
};

module.exports = developer;
