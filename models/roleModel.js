const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema({
  fullName:{
    type:String,
    required: [true,"Please enter your name!"],
  },  
  role: {
      type: String,
      enum: ["Manager", "Associate" , "Executive" ],
      required:[true ,"Please Select role!"]
       
    },
    email:{
      type: String,
      required:[true ,"Please enter your email!"]
    },
    password: {
      type: String,
      minlength:8,
      required: [true, "Please enter your password!"],
    },
    mobileNo:{
      type: String,
      required:[true ,"Please enter your mobile number!"]
    },
    profileImage:{
      type: String,
    }
},
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Roles", roleSchema);