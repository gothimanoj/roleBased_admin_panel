const router = require('express').Router()
const clientsCtrl = require('../controllers/clientsCtrl')
const auth = require("../middleware/access");

router.get("/getAllClients/:page/:limit", clientsCtrl.getAllClients);
router.get("/getProjectByClientId/:id", clientsCtrl.getProjectByClientId);
router.get('/getProjectDetails/:id',clientsCtrl.getProjectDetails)
router.get('/getAllRequestForDeveloper/:id',clientsCtrl.getAllRequestForDeveloper)
router.get('/getDetailsForRequestedDeveloper/:id',clientsCtrl.getDetailsForRequestedDeveloper)
router.get('/SearchClient/:key',clientsCtrl.getSearchClient)


module.exports = router