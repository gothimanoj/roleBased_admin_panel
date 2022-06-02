require("dotenv").config();
const Notification = require("../models/notificationsModel");
const Agency = require("../models/agenciesModel");
const Client = require("../models/clientsModel");
const connection = require("../config/mysqlConfig");
const mongoose = require("mongoose");
var moment = require("moment");
const sendEmail = require("../helpers/mailHelper");
const { getAllData } = require("../helpers/mysqlCallBack");
const bcrypt = require("bcrypt");

const testRequest = {
  getAllRequest: async (req, res) => {
    try {
      if (req.query.tab == "1") {
        const allRequest = await Notification.aggregate([
          {
            $match: {
              userType: "Admin",
              notificationTitle: "showing interest in RecruitBae",
            },
          },
          {
            $lookup: {
              from: "agencies",
              let: { id: "$userId" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$_id", "$$id"] },
                  },
                },
                {
                  $project: {
                    agencyName: 1,
                    ownerName: 1,
                    agencyEmail: 1,
                  },
                },
              ],
              as: "userId",
            },
          },
          {
            $addFields: {
              userCount: {
                $size: "$userId",
              },
            },
          },
          {
            $match: {
              userCount: { $gt: 0 },
            },
          },
        ]);
        return res.json({
          success: true,
          allRequest,
        });
      }
      if (req.query.tab == "2") {
        const allRequest = await Notification.aggregate([
          {
            $match: {
              userType: "Admin",
              notificationTitle: "showing interest in RecruitBae",
            },
          },
          {
            $lookup: {
              from: "clients",
              let: { id: "$userId" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$_id", "$$id"] },
                  },
                },
                {
                  $project: {
                    firstName: 1,
                    lastName: 1,
                    userName: 1,
                    companyName: 1,
                  },
                },
              ],
              as: "userId",
            },
          },
          {
            $addFields: {
              userCount: {
                $size: "$userId",
              },
            },
          },
          {
            $match: {
              userCount: { $gt: 0 },
            },
          },
        ]);
        return res.json({
          success: true,
          allRequest,
        });
      }
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const date = moment().format("YYYY-MM-DD hh:mm:ss");
      if (req.query.agencyId) {
        let agency = await Agency.findById(req.query.agencyId);
        var check = `SELECT * FROM users WHERE first_name = '${agency.firstName}' AND email = '${agency.userEmail}'`;
        const data = await getAllData(check);
        if (data.length > 0) {
          return res.json({
            msg: "you already create the user",
          });
        }

        const salt = await bcrypt.genSalt(10);

        const password = await bcrypt.hash("Password@123", salt);

        var sql = `INSERT INTO users (first_name,last_name,email,email_verified_at,password,created_by,updated_by,created_at,updated_at)VALUES ('${
          agency.firstName
        }','${agency.lastName}','${
          agency.userEmail
        }','${date}','${password}',${1},${1},'${date}','${date}')`;
        await getAllData(sql);

        var getNewUser = `SELECT * FROM users WHERE first_name = '${agency.firstName}' AND email = '${agency.userEmail}'`;
        const newUser = await getAllData(getNewUser);
        const addInRole = `INSERT INTO user_roles (user_id,role_id,created_by,updated_by,created_at,updated_at)VALUES (${newUser[0].id},2,2,2,'${date}','${date}')`;

        await getAllData(addInRole);

        await sendEmail(agency.userEmail, "user creation", "testing.hbs", {
          name: agency.firstName,
          username: agency.userEmail,
          password: "password@123",
          link: `http://test.recruitbae.sourcebae.com`,
        });
      }

      if (req.query.clientId) {
        var client = await Client.findById(req.query.clientId);

        const check = `SELECT * FROM users WHERE first_name = '${client.firstName}' AND email = '${client.userEmail}'`;
        const data = await getAllData(check);
        if (data.length > 0) {
          return res.json({
            msg: "you already create the user",
          });
        }
        const salt = await bcrypt.genSalt(10);

        const password = await bcrypt.hash("password@123", salt);

        var sql = `INSERT INTO users (first_name,last_name,email,email_verified_at,password,created_by,updated_by,created_at,updated_at)VALUES ('${
          client.firstName
        }','${client.lastName}','${
          client.userEmail
        }','${date}','${password}',${1},${1},'${date}','${date}')`;

        await getAllData(sql);

        var getNewUser = `SELECT * FROM users WHERE first_name = '${client.firstName}' AND email = '${client.userEmail}'`;

        const newUser = await getAllData(getNewUser);
       
        const addInRole = `INSERT INTO user_roles (user_id,role_id,created_by,updated_by,created_at,updated_at)VALUES (${newUser[0].id},3,2,2,'${date}','${date}')`;

        await getAllData(addInRole);

        await sendEmail(client.userEmail, "user creation", "testing.hbs", {
          name: client.firstName,
          username: client.lastName,
          password: password,
          link: `http://test.recruitbae.sourcebae.com`,
        });
      }

      return res.json({
        success: true,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  createOrganization: async (req, res) => {
    try {
      const date = moment().format("YYYY-MM-DD hh:mm:ss");
      if (req.query.agencyId) {
        const agency = await Agency.findById(req.query.agencyId);

        const checkFroUser = `SELECT * FROM users WHERE email = '${agency.userEmail}'`;
        const userExist = await getAllData(checkFroUser);
        if (userExist.length == 0) {
          return res.json({
            msg: "you have't create the user",
          });
        }

        const check = `SELECT * FROM organizations WHERE name = '${agency.agencyName}'`;
        const data = await getAllData(check);
        if (data.length > 0) {
          return res.json({
            msg: "you already create the organizations",
          });
        }

        var sql = `INSERT INTO organizations (name,logo,created_by,updated_by,created_at,updated_at)VALUES ('${agency.agencyName}','${agency.agencyLogo}',${userExist[0].created_by},${userExist[0].updated_by},'${date}','${date}')`;
        await getAllData(sql);
      }
      if (req.query.clientId) {
        const client = await Client.findById(req.query.clientId);

        const checkFroUser = `SELECT * FROM users WHERE email = '${client.userEmail}'`;
        const userExist = await getAllData(checkFroUser);
        if (userExist.length == 0) {
          return res.json({
            msg: "you have't create the user",
          });
        }

        const check = `SELECT * FROM organizations WHERE name = '${client.companyName}'`;
        const data = await getAllData(check);
        if (data.length > 0) {
          return res.json({
            msg: "you already create the organizations",
          });
        }
        var sql = `INSERT INTO organizations (name,logo,created_by,updated_by,created_at,updated_at)VALUES ('${client.companyName}','${client.clientLogo}',${userExist[0].created_by},${userExist[0].updated_by},'${date}','${date}')`;
        await getAllData(sql);
      }

      return res.json({
        success: true,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = testRequest;
