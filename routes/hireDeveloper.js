const router = require("express").Router();
const hireDeveloper = require("../controllers/hireDeveloper");
const auth = require("../middleware/access");

router.get(
  "/getRequirement/:page/:limit",
  auth,
  hireDeveloper.getAllRequirement
);

router.get("/singleRequirement/:id", auth, hireDeveloper.singleRequirement);

router.get(
  "/singleRequirementById/:id",
  auth,
  hireDeveloper.singleRequirementById
);

router.patch(
  "/updateSingleRequirementById/:id",
  auth,
  hireDeveloper.updateSingleRequirementById
);

router.patch(
  "/notificationValidation/:value/:id",
  auth,
  hireDeveloper.notificationValidation
);

module.exports = router;
