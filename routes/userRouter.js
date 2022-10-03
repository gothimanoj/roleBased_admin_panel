const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const roleCtrl = require("../controllers/roleCtrl");
const AdminAccess = require("../middleware/AdminAccess")
const upload = require("../middleware/multer");
const auth = require("../middleware/access");
const {live} = require("../middleware/roleAccess");

router.post("/register",auth,upload.single("image"), userCtrl.register);
router.get("/getUser", auth, userCtrl.getUserById);
// router.get("/getUser", live(["Admin","Manager","Associate"]),userCtrl.getUserById);

// router.post("/login",live(["Admin","Manager"]), userCtrl.login);
router.post("/login",userCtrl.login);

router.post("/newRequest", userCtrl.createNewRequest);
router.get("/getAllRequest", userCtrl.getAllRequest);

//AdminRoleRouters
router.post("/role",AdminAccess,upload.single("image"),roleCtrl.createRole);
router.get("/getRole",AdminAccess,roleCtrl.getRoleAdmin);

//get StatusError Api
router.get("/geterrorStatus",auth,userCtrl.getErrorStatus);

module.exports = router;

