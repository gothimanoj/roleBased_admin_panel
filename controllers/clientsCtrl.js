require("dotenv").config();
const mongoose = require("mongoose");

const Client = require("../models/clientsModel");
const HireDevelopers = require("../models/hireDevelopersModel");

const Project = require("../models/projectsModel");
const clientsCtrl = {
  getAllClients: async (req, res) => {
    try {
      const { page, limit } = req.params;
      const options = {
        page: +page || 0,
        limit: +limit || 20,
        select: "-password",
      };
      const clients = await Client.paginate({}, options);
      res.status(200).json({ success: true, clients });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  
  getProjectByClientId: async (req, res) => {
    try {
      const { id } = req.params;
      const getAllProjectOfClient = await Project.aggregate([
        {
          $match: { clientId: mongoose.Types.ObjectId(id) },
        },
        {
          $project: {
            _id: 1,
            projectCurrentStatus: 1,
            projectType: 1,
            projectName: 1,
            projectProposalCost: 1,
            agencyExperience: 1,
            projectPaymentModel: 1,
            projectFinalCost: 1,
            projectDomainId: 1,
            projectStartDate: 1,
            projectExpectedStartingDays: 1,
            createdAt: 1   // added
          },
        },
        {
          $lookup: {
            from: "domains",
            localField: "projectDomainId",
            foreignField: "_id",
            as: "projectDomainDetails",
          },
        },
        {
          $unwind: {
            path: "$projectDomainDetails",
            includeArrayIndex: "string",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $addFields: {
            domainIcon: "$projectDomainDetails.domainIcon",
            domainActive: "$projectDomainDetails.active",
            domainName: "$projectDomainDetails.domainName",
          },
        },
        {
          $project: { string: 0, projectDomainId: 0, projectDomainDetails: 0 },
        },
      ]);

      return res.status(200).json({ success: true, getAllProjectOfClient });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getProjectDetails: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await Project.findById(
        { _id: id },
        "-projectExpertiseRequired -projectStatuses -projectProposals.comments"
      )
        .populate(
          "projectTechnologiesRequired",
          "active serviceId technologyName -_id"
        )
        .populate(
          "projectServicesRequired",
          "serviceIcon active serviceName -_id"
        )
        .populate(
          "projectProposals.agencyId",
          "agencyName agencyEmail agencyPhone "
        )
        .populate("projectDomainId", "domainName");

      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAllRequestForDeveloper: async (req, res) => {
    try {
      const { id } = req.params;
      const RequestForDeveloper = await HireDevelopers.find({
        clientId: mongoose.Types.ObjectId(id),
      }).populate("developerTechnologiesRequired", "-_id technologyName")
      .populate("developerRolesRequired","-_id roleName")

      return res.status(200).json({ success: true, RequestForDeveloper });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getDetailsForRequestedDeveloper: async (req, res) => {
    try {
      const { id } = req.params;
      // const Details = await HireDevelopers.findById(id)
      //   .populate("agenciesMatched.agencyId", "agencyName")
      //   .populate("developerTechnologiesRequired", "-_id technologyName");
      const Details = await HireDevelopers.findOne({ _id: id }).populate("developerRolesRequired", "-_id roleName").populate("developerTechnologiesRequired","-_id technologyName")
      return res.status(200).json({ success: true, Details });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getSearchClient: async (req, res) => {
    try {
      const { page, limit } = req.params;
      const options = {
        page: +page || 0,
        limit: +limit || 20,
        select: "-password",
      };
      const clients = await Client.find(
        {
          $or: [
            { companyName: { $regex: req.params.key,$options: 'i' } },
            { userEmail: { $regex: req.params.key } },
            { userName: { $regex: req.params.key } },
          ],
        },
        "-password"
      );
      res.status(200).json({ success: true, clients });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getClients: async (req, res) => {
    try {
      let result = await Client.aggregate([{ $project: { companyName: 1 } }]);
      return res.status(200).json({ success: "true", result });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = clientsCtrl;
