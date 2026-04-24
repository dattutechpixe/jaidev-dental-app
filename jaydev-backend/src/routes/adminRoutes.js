const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/authController/adminController.js");
const {
  adminAuthenticate,
  isAdmin,
  authenticate,
} = require("../middlewares/authentication.js");
const { dynamicUpload } = require("../middlewares/multer.js");

router.post("/signup", AdminController.adminSignup);
router.post("/login", AdminController.adminLogin);
router.post(
  "/adminProfile",
  adminAuthenticate,
  isAdmin,
  dynamicUpload("files"),
  AdminController.uploadadminProfilePic
);
router.patch(
  "/updateAdminProfile",
  adminAuthenticate,
  isAdmin,
  AdminController.adminProfileUpdate
);
router.patch(
  "/updatePassword",
  adminAuthenticate,
  isAdmin,
  AdminController.changePassword
);
router.post("/forgetPassword", AdminController.adminforgetpassword);
router.put("/adminsetNewPassword/", AdminController.adminsetnewpassword);
router.get(
  "/getadminData",
  adminAuthenticate,
  isAdmin,
  AdminController.getadmindata
);









module.exports = router;
