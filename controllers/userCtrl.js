require("dotenv").config();
const Users = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const client = require("../models/clientsModel");
const RequestFroDeveloper = require("../models/requestForDeveloper");

const userCtrl = {
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, Password, role } = req.body;
      let user = await Users.findOne({ $or: [{ email }] });
      if (user) {
        return res
          .status(400)
          .json({ success: false, error: "Email already exists" });
      }
      if (!firstName || !lastName || !email || !Password) {
        return res
          .status(400)
          .json({ success: false, error: "all fields are mandatory " });
      }
      const password = await bcrypt.hash(Password, 10);
      let userObj = new Object({ firstName, lastName, email, password, role });
      if (req.file) {
        userObj.profileImage = req.file.path;
      }
      const newUser = new Users(userObj);
      await newUser.save();
      const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRETKEY);
      return res.json({
        success: true,
        msg: "Account has been activated!",
        token,
      });
    } catch (error) {
      res.status(401).json({ success: false, error: error.message });
    }
  },
  getUserById: async (req, res) => {
    try {
      const allUser = await Users.aggregate([
        {
          $project: {
            password: 0,
          },
        },
      ]);
      return res.json({ allUser });
    } catch {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      let { email, password } = req.body;
      let user = null;
      if (email) {
        user = await Users.findOne({ email });
      }
     console.log(user);
      if (user) {
        const validPassword = await bcrypt.compare(
          password,
          user.password ? user.password : ""
        );
        if (!validPassword) {
          return res
            .status(404)
            .json({ success: false, error: "wrong password" });
        }
      } else {
        return res
          .status(404)
          .json({ success: false, error: "User does not exist" });
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRETKEY);
      const adminClient = await client.find({
        userEmail: "info@sourcebae.com",
      });
      const clientId = adminClient[0]._id;
      return res.json({
        success: true,
        token,
        clientId,
        role: user.role,
        id: user._id,
      });
    } catch (error) {
      res.status(401).json({ success: false, error: error.message });
    }
  },
  createNewRequest: async (req, res) => {
    try {
      const { userId, agencyId } = req.body;
      const newRequest = await RequestFroDeveloper.create({ userId, agencyId });
      return res.json({
        success: true,
        newRequest
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAllRequest: async (req, res) => {
    try {
      
      const allRequest = await RequestFroDeveloper.aggregate([
       {
         $lookup:{
            from: 'agencies',
            let :{id:"$agencyId"},
            pipeline:[
              {
                $match:{
                  $expr:{$eq:["$_id","$$id"]}
                }
              }
            ],
            as: 'agencyId'
         }
       }
      ]);
      return res.json({
        success: true,
        allRequest
      });

    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
};

module.exports = userCtrl;
