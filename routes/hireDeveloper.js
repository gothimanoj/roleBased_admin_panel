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

router.get("/SearchRequirement/:key", auth, hireDeveloper.getSearchRequirement);

router.get("/RequirementByFilter",auth,hireDeveloper.getRequirementFilter)


module.exports = router;
