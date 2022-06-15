const router = require('express').Router()
const developerCtrl = require('../controllers/developersCtrl')
const upload =require('../middleware/multer')
const auth =require('../middleware/access')

router.get('/getAll/:page/:limit',auth,developerCtrl.getAllDeveloper)

router.get('/getDeveloper',auth,developerCtrl.getAllDeveloperName)
router.get('/getDeveloperRole',auth,developerCtrl.getAllRole)
router.post('/setDeveloper',auth,upload.single([ {name: 'resume', maxCount: 1 },{name: 'marksheets', maxCount: 4 }]),developerCtrl.setDeveloper)
router.patch("/updateSingleDeveloper/:id",auth, developerCtrl.updateSingleDeveloper);
router.get('/getAllTech',auth,developerCtrl.getAllTech)
router.get('/getVerifiedDevelopers/:verified',developerCtrl.getVerifiedDevelopers);
router.get('/getAvailableDevelopers/:available',developerCtrl.getAvailableDevelopers);
router.get('/getUnavailableDevelopers/:unavailable',developerCtrl.getUnavailableDevelopers);


module.exports = router