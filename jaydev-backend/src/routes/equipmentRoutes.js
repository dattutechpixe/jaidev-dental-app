const express = require("express");
const router = express.Router();
const { adminAuthenticate } = require("../middlewares/authentication");
const { dynamicUpload } = require("../middlewares/multer");
const {
  createEquipment,
  getAllEquipment,
  getSingleEquipment,
  updateEquipment,
  deleteEquipment,
} = require("../controllers/services/equipmentController");

router.post("/create", adminAuthenticate, dynamicUpload("files"), createEquipment);
router.get("/all", getAllEquipment);
router.get("/:id", getSingleEquipment);
router.put("/update/:id", adminAuthenticate, dynamicUpload("files"), updateEquipment);
router.delete("/delete/:id", adminAuthenticate, deleteEquipment);

module.exports = router;
