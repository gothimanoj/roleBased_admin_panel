const router = require("express").Router();
const agenciesCtrl = require("../controllers/agenciesCtrl");
const auth = require("../middleware/access");

router.get(
  "/getAllAgencies/:tab/:page/:limit",
  agenciesCtrl.getAllAgencies
);

router.get("/getAgencyById/:id", agenciesCtrl.getAgencyById);

router.get("/getProjectAgencyById/:id", agenciesCtrl.getProjectAgencyById);

router.get("/getAllRequestForDeveloper/:id", agenciesCtrl.getAllRequestForDeveloper);

router.get("/getAgencyDeveloper/:id", agenciesCtrl.getAgencyDeveloper);

module.exports = router;
