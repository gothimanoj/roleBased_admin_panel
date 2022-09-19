 
const AWS = require('aws-sdk');
const fs = require('fs') 

module.exports={

  
  aws:async(req,res,next)=>{
    try {
            const s3 = new AWS.S3({
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            });
            const filename = req.file.filename;
    
            const fileContent = fs.readFileSync(req.file.path);
            
            const params = {
              Bucket:process.env.AWS_BUCKET,
              Key: `${filename}`,
              Body: fileContent,
            };
            var obj = s3.upload(params).promise();
                 
                await obj.then((data)=>{
                console.log(data.Location)
                req.body.location = data.Location
                next()
                }).catch((err)=>{
                    // console.log(data)
                    return err
                })
          
          } catch (err) {
            console.log(err.message);
          }
   
 }, 
  awsDelete :async(req,res,next)=>{
  try {
          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          });
          const filename = req.params.filename;
  
           
          const params = {
            Bucket:process.env.AWS_BUCKET,
            Key: `${filename}`,
             
          };
          console.log(params)
         var del =  s3.deleteObject(params).promise() 
         console.log(del)
         await del.then((data)=>{
          console.log("Successfully deleted file from bucket")
          console.log(data)
          next()
          }).catch((err)=>{
              // console.log(data)
              return err
          })
    
    } catch (err) {
      console.log(err.message);
    }
    
  },   
    
  
   
 }