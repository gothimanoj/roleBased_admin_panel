const router = require("express").Router();
const hireDeveloper = require("../controllers/hireDeveloper");
const auth = require("../middleware/access");

router.get(
  "/getRequirement/:page/:limit",
  auth,
  hireDeveloper.getAllRequirement
);
router.get("/singleRequirement/:id", auth, hireDeveloper.singleRequirement);

module.exports = router;
