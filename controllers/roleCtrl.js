require("dotenv").config();
const Roles = require('../models/roleModel');
 const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


 const roleCtrl = {
    createRole: async (req,res)=>{
        try{
        const { fullName, email,  role, mobileNo , Password } = req.body;
        
        let user = await Roles.findOne({ $or: [{ email }] });
         
        if (user) {
          return res
            .status(400)
            .json({ success: false, error: "Email already exists" });
        }
        if (!fullName || !role || !email || !mobileNo || !Password ) {
          return res
            .status(400)
            .json({ success: false, error: "all fields are mandatory " });
        }
      const password = await bcrypt.hash(Password, 10);
         
        let roleObj = new Object({ fullName, role, email, password, mobileNo  });
        
        if (req.file) {
          roleObj.profileImage = req.file.path;
        }
        const newRoles = new Roles(roleObj);
        
        await newRoles.save();
        const token = jwt.sign({ _id: newRoles._id }, process.env.JWT_SECRETKEY);
        return res.json({
          success: true,
          msg: "Role has been activated!",
          token,
        });
      } catch (error) {
        console.log(error)
        res.status(401).json({ success: false, error: error });
      }
    },
    getRoleAdmin:async(req,res)=>{
        try{
               const allRoles = await Roles.aggregate([

                {
                  $project: {
                    password: 0,
                  },
                },
              ]);
                return res.json({ allRoles });

        }catch(error){
            res.status(401).json({ success: false, error: error.message });

        }
    },
    


     
}
module.exports = roleCtrl;