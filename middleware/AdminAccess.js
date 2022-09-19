require("dotenv").config();
const Users = require("../models/userModel");
const jwt = require("jsonwebtoken");

 const checkAdmin = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res
        .status(401)
        .json({ success: false, error: "you must be logged in" });
    }
    let token = authorization.replace("Bearer ", "");
    // console.log(token)
    let { _id } = jwt.verify(token, process.env.JWT_SECRETKEY);
   
    const user = await Users.findById(_id).select("-password");
    console.log(user)
    if (!user) {
      return res.status(401).json({ success: false, error: "user not found" });
    }
    if (user.role == "User") {
      return res.status(401).json({ success: false, error: "access denied" });
    } 
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "invalid token" });
  }
};

module.exports = checkAdmin;