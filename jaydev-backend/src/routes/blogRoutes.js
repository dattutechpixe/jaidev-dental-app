const express = require('express')
const router = express.Router()
const { authenticate, adminAuthenticate, isAdmin } = require("../middlewares/authentication");
const blogs = require('../controllers/blogs/blogController')
const { dynamicUpload } = require("../middlewares/multer");


router.get('/allblogs',blogs.getallblogs)
router.get('/singleblog/:id',blogs.getblogbyidortitle)
router.post("/create", adminAuthenticate, dynamicUpload("create"), blogs.createblog)
router.post("/update/image/:id", adminAuthenticate, dynamicUpload("create"), blogs.updateblogimage)
router.put("/update/:id",adminAuthenticate,dynamicUpload("create"),blogs.updateblog)

router.delete("/delete/:id",adminAuthenticate,blogs.deleteblog)
module.exports = router