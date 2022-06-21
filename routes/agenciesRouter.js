const router = require("express").Router();
const agenciesCtrl = require("../controllers/agenciesCtrl");
const auth = require("../middleware/access");
const checkAdmin = require("../middleware/AdminAccess");

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

router.get("/SearchAgency/:key", auth, agenciesCtrl.getSearchAgencies);

router.patch("/addUserInAgency/:id", checkAdmin, agenciesCtrl.addUserInAgency);

router.get("/getAgency", auth, agenciesCtrl.getAllAgenciesName);
router.patch(
  "/notificationValidation/:value/:id",
  auth,
  agenciesCtrl.notificationValidation
);
module.exports = router;
