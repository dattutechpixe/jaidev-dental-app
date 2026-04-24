const Equipment = require("../../models/equipmentSchema");
const mongoose = require("mongoose");

// =====================================
// CREATE
// =====================================
exports.createEquipment = async (req, res) => {
  try {
    let { equipmentName, equipmentdescription, description, features, indications } = req.body;

    if (equipmentName) equipmentName = equipmentName.trim();
    if (description) description = description.trim();

    // Robust features/indications parsing (supports JSON array or comma-separated string)
    const parseToArray = (input) => {
      if (!input) return [];
      if (Array.isArray(input)) return input;
      if (typeof input === "string") {
        input = input.trim();
        if (input.startsWith("[") && input.endsWith("]")) {
          try { return JSON.parse(input); } catch { /* Fallback */ }
        }
        return input.split(",").map(s => s.trim()).filter(Boolean);
      }
      return [];
    };

    features = parseToArray(features);
    indications = parseToArray(indications);

    // Robust images capture
    let images = [];
    if (req.files) {
      const allFiles = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
      images = allFiles.filter(f => ["images", "profileImage", "image", "files"].includes(f.fieldname)).map(f => f.location);
    } else if (req.file && ["images", "profileImage", "image", "files"].includes(req.file.fieldname)) {
      images = [req.file.location];
    }

    const newProduct = await Equipment.create({
      equipmentName,
      equipmentdescription,
      description,
      indications,
      features,
      images,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// GET ALL (paginated)
// =====================================
exports.getAllEquipment = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const total = await Equipment.countDocuments();
    const data = await Equipment.find().skip(skip).limit(limit).lean();

    return res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// GET SINGLE
// =====================================
exports.getSingleEquipment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const item = await Equipment.findById(req.params.id).lean();
    if (!item)
      return res.status(404).json({ success: false, message: "Product not found" });

    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// UPDATE
// =====================================
exports.updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    let { equipmentName, equipmentdescription, description, features, indications } = req.body;

    if (equipmentName) equipmentName = equipmentName.trim();
    if (description) description = description.trim();

    // Robust features/indications parsing (supports JSON array or comma-separated string)
    const parseToUpdateArray = (input) => {
      if (!input) return undefined;
      if (Array.isArray(input)) return input;
      if (typeof input === "string") {
        input = input.trim();
        if (input.startsWith("[") && input.endsWith("]")) {
          try { return JSON.parse(input); } catch { /* Fallback */ }
        }
        return input.split(",").map(s => s.trim()).filter(Boolean);
      }
      return undefined;
    };

    features = parseToUpdateArray(features);
    indications = parseToUpdateArray(indications);

    let images;
    // 1️⃣ Capture new uploads
    let newImages = [];
    if (req.files) {
      const allFiles = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
      newImages = allFiles
        .filter(f => ["images", "profileImage", "image", "files"].includes(f.fieldname))
        .map(f => f.location);
    } else if (req.file && ["images", "profileImage", "image", "files"].includes(req.file.fieldname)) {
      newImages = [req.file.location];
    }

    // 2️⃣ Capture existing images to keep (if any)
    let existingImages = [];
    if (req.body.existingImages) {
      try {
        existingImages = typeof req.body.existingImages === 'string'
          ? JSON.parse(req.body.existingImages)
          : req.body.existingImages;
      } catch (e) {
        existingImages = [req.body.existingImages];
      }
    }

    // 3️⃣ Combine them if either exists
    if (newImages.length > 0 || req.body.existingImages !== undefined) {
      images = [...(Array.isArray(existingImages) ? existingImages : []), ...newImages];
    }

    const updateData = Object.fromEntries(
      Object.entries({ equipmentName, equipmentdescription, description, features, indications, images })
        .filter(([, v]) => v !== undefined)
    );

    const updated = await Equipment.findByIdAndUpdate(
      id,
      { $set: updateData, $unset: { profileImage: 1 } },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ success: false, message: "Product not found" });

    return res.status(200).json({ success: true, message: "Product updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// DELETE
// =====================================
exports.deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const deleted = await Equipment.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Product not found" });

    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
