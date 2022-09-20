require("dotenv").config();
const Users = require("../models/userModel");
const jwt = require("jsonwebtoken");

const checkLogin = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res
        .status(401)
        .json({ success: false, error: "you must be logged in" });
    }
    // console.log(authorization)
    let token = authorization.replace("Bearer ", "");
    // console.log(token)
    let { _id } = jwt.verify(token, process.env.JWT_SECRETKEY);
    const user = await Users.findById(_id).select("-password");
    console.log(user)
    if (!user) {
      console.log(res.error)
      return res.status(401).json({ success: false, error: "user not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error,"error2")
    return res.status(401).json({ success: false, error: "invalid token" });
  }
};

module.exports = checkLogin;