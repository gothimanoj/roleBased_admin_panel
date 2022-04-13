require("dotenv").config();
const Agency = require("../models/agenciesModel");
const Project = require("../models/projectsModel");
const mongoose = require("mongoose");
const HireDeveloper = require("../models/hireDevelopersModel");
const Developer = require("../models/developersModel");
const agenciesCtrl = {
  getAllAgencies: async (req, res) => {
    try {
      const { page, tab, limit } = req.params;
      const options = {
        page: +page || 1,
        limit: +limit || 20,
      };

      if (tab == 1) {
        const agencies = Agency.aggregate([
          {
            $lookup: {
              from: "hiredevelopers",
              let: { id: "$_id" },
              pipeline: [
                { $unwind: { path: "$agenciesMatched" } },
                {
                  $match: {
                    $expr: { $eq: ["$agenciesMatched.agencyId", "$$id"] },
                  },
                },
                { $sort: { "agenciesMatched.updatedAt": -1 } },
                {
                  $addFields: {
                    updatedAt1: "$agenciesMatched.updatedAt",
                  },
                },
                {
                  $project: {
                    _id: 0,
                    updatedAt1: 1,
                  },
                },
                { $limit: 1 },
              ],
              as: "hiredevelopers",
            },
          },
          {
            $lookup: {
              from: "developers",
              let: { id: "$_id" },
              pipeline: [
                { $match: { $expr: { $eq: ["$agencyId", "$$id"] } } },
                { $sort: { updatedAt: -1 } },
                {
                  $addFields: {
                    updatedAt1: "$updatedAt",
                  },
                },
                {
                  $project: {
                    _id: 0,
                    updatedAt1: 1,
                  },
                },
                { $limit: 1 },
              ],
              as: "AgenciesDevelopers",
            },
          },
          {
            $match: {
              $or: [
                {
                  hiredevelopers: {
                    $gte: [
                      {
                        $size: "$hiredevelopers",
                      },
                      0,
                    ],
                  },
                },
                {
                  AgenciesDevelopers: {
                    $gte: [
                      {
                        $size: "$AgenciesDevelopers",
                      },
                      0,
                    ],
                  },
                },
              ],
            },
          },
          {
            $project: {
              _id: 1,
              isAgencyVerified: 1,
              isUserEmailVerified: 1,
              agencyName: 1,
              ownerName: 1,
              agencyEmail: 1,
              agencyPhone: 1,
              agencyLogo: 1,
              incorporationDate: 1,
              agencyTeamSize: 1,
              createdAt: 1,
              AgenciesDevelopers: 1,
              hiredevelopers: 1,
            },
          },
        ]);
        const Agencies = await Agency.aggregatePaginate(agencies, options);
        return res.status(200).json({ success: true, Agencies });
      }

      if (tab == 2) {
        const agencies = Agency.aggregate([
          {
            $match: { isAgencyVerified: true },
          },
          {
            $match: { verificationMessage: "Agency verification successful." },
          },
          {
            $project: {
              _id: 1,
              isAgencyVerified: 1,
              isUserEmailVerified: 1,
              verificationMessage: 1,
              agencyName: 1,
              ownerName: 1,
              agencyEmail: 1,
              agencyPhone: 1,
              agencyLogo: 1,
              incorporationDate: 1,
              agencyTeamSize: 1,
              createdAt: 1,
            },
          },
        ]);

        const Agencies = await Agency.aggregatePaginate(agencies, options);
        console.log("all VerifiedAgency");
        return res.status(200).json({ success: true, Agencies });
      }

      if (tab == 3) {
        const agencies = Agency.aggregate([
          {
            $match: { isAgencyVerified: false },
          },
          {
            $match: {
              verificationMessage:
                "Agency verification is still pending by our team.",
            },
          },
          {
            $project: {
              _id: 1,
              isAgencyVerified: 1,
              isUserEmailVerified: 1,
              verificationMessage: 1,
              agencyName: 1,
              ownerName: 1,
              agencyEmail: 1,
              agencyPhone: 1,
              agencyLogo: 1,
              incorporationDate: 1,
              agencyTeamSize: 1,
              createdAt: 1,
            },
          },
        ]);
        const Agencies = await Agency.aggregatePaginate(agencies, options);
        console.log("all pendingAgency");
        return res.status(200).json({ success: true, Agencies });
      }

      if (tab == 4) {
        const aggregateRejectedAgency = Agency.aggregate([
          {
            $match: { isAgencyVerified: false },
          },
          {
            $match: { verificationMessage: "Agency rejected." },
          },
          {
            $project: {
              _id: 1,
              isAgencyVerified: 1,
              isUserEmailVerified: 1,
              verificationMessage: 1,
              agencyName: 1,
              ownerName: 1,
              agencyEmail: 1,
              agencyPhone: 1,
              agencyLogo: 1,
              incorporationDate: 1,
              agencyTeamSize: 1,
              createdAt: 1,
            },
          },
        ]);
        const Agencies = await Agency.aggregatePaginate(
          aggregateRejectedAgency,
          options
        );
        console.log("all rejectedAgency");
        return res.status(200).json({ success: true, Agencies });
      }

      if (tab == 6) {
        const aggregateRejectedAgency = Agency.aggregate([
          {
            $project:
             {
              _id: 1,
              isAgencyVerified: 1,
              isUserEmailVerified: 1,
              verificationMessage: 1,
              agencyName: 1,
              ownerName: 1,
              agencyEmail: 1,
              agencyPhone: 1,
              agencyLogo: 1,
              incorporationDate: 1,
              agencyTeamSize: 1,
              createdAt: 1,
             },
          },
        ]);
        const Agencies = await Agency.aggregatePaginate(
          aggregateRejectedAgency,
          options
        );
        return res.status(200).json({ success: true, Agencies });
      }
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  getAgencyById: async (req, res) => {
    try {
      const { id } = req.params;
      const Agencies = await Agency.findById(
        id,
        "-password -socialPlatformDetails -agencyRules"
      )
        .populate("agencyServices", "serviceIcon active serviceName -_id")
        .populate("agencyTechnologies", "active serviceId technologyName -_id")
        .populate(
          "agencyDomains.domainId",
          "domainIcon active domainName -_id"
        );
      return res.status(200).json({ success: true, Agencies });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  getProjectAgencyById: async (req, res) => {
    try {
      const { id } = req.params;
      const Projects = await Project.aggregate([
        {
          $project: {
            projectProposals: 1,
            agencyExperience: 1,
            createdAt: 1,
            projectProposals: 1,
            projectProposalCost: 1,
            projectName: 1,
            projectType: 1,
            projectCurrentStatus: 1,
          },
        },
        {
          $unwind: {
            path: "$projectProposals",
          },
        },
        {
          $addFields: {
            newField: "$projectProposals.agencyId",
            isShortListed: "$projectProposals.isShortListed",
            isAskedForQuotation: "$projectProposals.isAskedForQuotation",
          },
        },
        {
          $match: {
            newField: mongoose.Types.ObjectId(id),
          },
        },
        {
          $match: {
            isShortListed: true,
          },
        },
        {
          $match: {
            isAskedForQuotation: true,
          },
        },
        {
          $project: {
            projectProposals: 0,
          },
        },
      ]);

      return res.status(200).json({ success: true, Projects });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  getAgencyDeveloper: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await Developer.find(
        { agencyId: mongoose.Types.ObjectId(id) },
        "isRemoteDeveloper developerExperience developerPriceRange isDeveloperActive firstName lastName developerDesignation developerTechnologies developerDocuments"
      ).populate({
        path: "developerTechnologies",
        select: {
          _id: 0,
          technologyName: 1,
        },
      });
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  getAllRequestForDeveloper: async (req, res) => {
    try {
      const { id } = req.params;
      const RequestForDeveloper = await HireDeveloper.aggregate([
        {
          $unwind: {
            path: "$agenciesMatched",
          },
        },
        {
          $addFields: {
            agencyId: "$agenciesMatched.agencyId",
          },
        },
        {
          $match: {
            agencyId: mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "clients",
            localField: "clientId",
            foreignField: "_id",
            as: "clients",
          },
        },
        {
          $unwind: {
            path: "$clients",
          },
        },
        {
          $addFields: {
            companyName: "$clients.companyName",
          },
        },
        {
          $project: {
            companyName: 1,
            developerRolesRequired: 1,
            requirementName: 1,
            numberOfResourcesRequired: 1,
            developerExperienceRequired: 1,
            preferredBillingMode: 1,
            averageBudget: 1,
            expectedStartDate: 1,
            contractPeriod: 1,
            createdAt: 1,
          },
        },
      ]);
      return res.status(200).json({ success: true, RequestForDeveloper });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = agenciesCtrl;
