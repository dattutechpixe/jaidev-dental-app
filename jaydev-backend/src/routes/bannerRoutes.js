const express = require("express");
const router = express.Router();
const { adminAuthenticate, isAdmin } = require("../middlewares/authentication");
const { dynamicUpload } = require("../middlewares/multer");
const {
  createBanner,
  getAllBanners,
  getSingleBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/banners/bannerController");

// Use dynamicUpload("files") which already supports .any()
router.post("/create", adminAuthenticate, isAdmin, dynamicUpload("files"), createBanner);
router.get("/all", getAllBanners);
router.get("/:id", getSingleBanner);
router.put("/update/:id", adminAuthenticate, isAdmin, dynamicUpload("files"), updateBanner);
router.delete("/delete/:id", adminAuthenticate, isAdmin, deleteBanner);

module.exports = router;
