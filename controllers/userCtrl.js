require("dotenv").config();
const Users = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const client = require("../models/clientsModel");
const userCtrl = {
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, Password } = req.body;
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
      let userObj = new Object({ firstName, lastName, email, password });
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
      return res.json({ msg: req.user });
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
      const adminClient = await client.find({ userEmail: "info@sourcebae.com" });
      const clientId = adminClient[0]._id
      return res.json({ success: true, token, clientId });
    } catch (error) {
      res.status(401).json({ success: false, error: error.message });
    }
  },
};

module.exports = userCtrl;
