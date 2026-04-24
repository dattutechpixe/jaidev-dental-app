const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogs/blogController');
const equipmentController = require('../controllers/services/equipmentController');
const bannerController = require('../controllers/banners/bannerController');

// PRODUCTS (EQUIPMENT) PUBLIC ROUTES
router.get("/products/all", equipmentController.getAllEquipment);
router.get("/products/:id", equipmentController.getSingleEquipment);

// BLOGS PUBLIC ROUTES
router.get("/blogs/all", blogController.getallblogs);

router.get("/blogs/:id", blogController.getblogbyidortitle);

// BANNERS PUBLIC ROUTES
router.get("/banners/all", bannerController.getAllBanners);
router.get("/banners/:id", bannerController.getSingleBanner);

module.exports = router;