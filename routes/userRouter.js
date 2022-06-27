const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const upload = require("../middleware/multer");
const auth = require("../middleware/access");

router.post("/register", upload.single("image"), userCtrl.register);
router.get("/getUser", auth, userCtrl.getUserById);
router.post("/login", userCtrl.login);
router.post("/newRequest", userCtrl.createNewRequest);
router.get("/getAllRequest", userCtrl.getAllRequest);
module.exports = router;
