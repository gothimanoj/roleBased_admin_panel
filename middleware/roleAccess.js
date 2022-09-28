require("dotenv").config();
const Users = require("../models/userModel");
const Roles = require("../models/roleModel");
const jwt = require("jsonwebtoken");


module.exports = {
    live :(role)=>async(req,res,next)=>{
        console.log(role,"role")
     try{ 
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]
        console.log(token)
        const match = jwt.verify(token,process.env.JWT_SECRETKEY)
        console.log(match)
         
        const Admin = await (Users.findById(match))
        const Manager = await (Roles.findById(match))
        console.log(Admin)
        console.log(Manager)
        if(Admin){

            const arr = role.map(item=>(item===Admin.role))
            console.log(arr,"arr")
            req.arr=arr
            arr[0]?next(): res.status(401).json({ success: false, error: "access denied" });
            }
            else if(Manager){
                console.log(Manager)
                const Arr = role.map(item=>(item===Manager.role))
                console.log(Arr)
                if(Arr[1]||Arr[2]){ 
                    req.arr=Arr
                    next();
                }
                    else
                    res.status(401).json({ success: false, error: "access denied" });
                     

            } 
        }catch (error) {
            return res.status(401).json({ success: false, error: "invalid token" });
          }          
           
            
},

}
  