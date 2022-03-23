const router = require("express").Router();
const agenciesCtrl = require("../controllers/agenciesCtrl");
const auth = require("../middleware/access");

router.get(
  "/getAllAgencies/:tab/:page/:limit",
  auth,
  agenciesCtrl.getAllAgencies
);

router.get("/getAgencyById/:id", auth, agenciesCtrl.getAgencyById);

router.get(
  "/getProjectAgencyById/:id",
  auth,
  agenciesCtrl.getProjectAgencyById
);

router.get(
  "/getAllRequestForDeveloper/:id",
  auth,
  agenciesCtrl.getAllRequestForDeveloper
);

router.get("/getAgencyDeveloper/:id", auth, agenciesCtrl.getAgencyDeveloper);

module.exports = router;
