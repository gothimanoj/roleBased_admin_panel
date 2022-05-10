const router = require('express').Router()
const developerCtrl = require('../controllers/developersCtrl')
const upload =require('../middleware/multer')
const auth =require('../middleware/access')

router.get('/getAll/:page/:limit',auth,developerCtrl.getAllDeveloper)

router.get('/getDeveloper',auth,developerCtrl.getAllDeveloperName)
router.get('/getDeveloperRole',auth,developerCtrl.getAllRole)
router.patch("/updateSingleDeveloper/:id",auth, developerCtrl.updateSingleDeveloper);
router.get('/getAllTech',auth,developerCtrl.getAllTech)




module.exports = router