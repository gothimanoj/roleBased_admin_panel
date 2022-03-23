const router = require("express").Router();
const clientsCtrl = require("../controllers/clientsCtrl");
const auth = require("../middleware/access");

router.get("/getAllClients/:page/:limit", auth, clientsCtrl.getAllClients);
router.get("/getProjectByClientId/:id", auth, clientsCtrl.getProjectByClientId);
router.get("/getProjectDetails/:id", auth, clientsCtrl.getProjectDetails);
router.get(
  "/getAllRequestForDeveloper/:id",
  auth,
  clientsCtrl.getAllRequestForDeveloper
);
router.get(
  "/getDetailsForRequestedDeveloper/:id",
  auth,
  clientsCtrl.getDetailsForRequestedDeveloper
);
router.get("/SearchClient/:key", auth, clientsCtrl.getSearchClient);

module.exports = router;
