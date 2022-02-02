const multer  = require('multer')

const data = multer.diskStorage({
    destination:(req,file,cd)=>{
        cd(null,"./image");
    },
    filename:(req,file,cd)=>{
        cd(null,Date.now()+req.body.firstname+"--"+file.originalname);
    }
});

const upload =multer({storage:data});


module.exports = upload


