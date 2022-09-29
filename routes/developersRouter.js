const router = require('express').Router()
const developerCtrl = require('../controllers/developersCtrl')
const upload =require('../middleware/multer')
const auth =require('../middleware/access')

router.get('/getAll/:page/:limit',auth,developerCtrl.getAllDeveloper);
router.get('/getDeveloper',auth,developerCtrl.getAllDeveloperName);
router.get('/getDeveloperRole',auth,developerCtrl.getAllRole);
router.post('/setDeveloper',auth,upload.single([ {name: 'resume', maxCount: 1 },{name: 'marksheets', maxCount: 4 }]),developerCtrl.setDeveloper);
router.patch("/updateSingleDeveloper/:id",auth, developerCtrl.updateSingleDeveloper);
router.get('/getAllTech',auth,developerCtrl.getAllTech);
router.get('/getSpecificDevelopers',auth,developerCtrl.getSpecificDevelopers);
router.post("/setInterviewSchedule/:developerId",auth,developerCtrl.setInterviewSchedule);
router.get("/getInterviewHistory/:id/:page/:limit",auth,developerCtrl.getInterviewHistory);//page limit route added
router.post("/setDeveloperDeployment/:developerId", auth, developerCtrl.developerDeployment);
router.get("/getDeploymentHistory/:developerId",auth,developerCtrl.getDeploymentHistory);
router.get("/SearchDeveloper/:key", auth, developerCtrl.getSearchDeveloper);
router.get("/todaysInterview",auth,developerCtrl.getTodaysInterview);
router.patch("/setInterviewStatus/:id/:historyId/:status",auth,developerCtrl.setInterviewStatus);
router.get("/getAllInterviews",auth,developerCtrl.getAllInterviews);

module.exports = router ;



// router.post("/setInterviewSchedule/:developerId",auth,developerCtrl.setInterviewSchedule);
// router.get("/getInterviewHistory/:id",auth,developerCtrl.getInterviewHistory);
// router.get("/todaysInterview",auth,developerCtrl.getTodaysInterview);
// router.patch("/setInterviewStatus/:id/:historyId/:status",auth,developerCtrl.setInterviewStatus);
// router.post("/setDeveloperDeployment/:developerId", auth, developerCtrl.developerDeployment);
// router.get("/getDeploymentHistory/:developerId",auth,developerCtrl.getDeploymentHistory);



