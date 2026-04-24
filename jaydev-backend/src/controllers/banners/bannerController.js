const Banner = require("../../models/bannerSchema");
const mongoose = require("mongoose");

// =====================================
// CREATE
// =====================================
exports.createBanner = async (req, res) => {
  try {
    let { heading, description } = req.body;

    let images = [];
    if (req.files) {
      const allFiles = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
      images = allFiles.filter(f => ["images", "bannerImage", "image", "files"].includes(f.fieldname)).map(f => f.location || f.path);
    } else if (req.file && ["images", "bannerImage", "image", "files"].includes(req.file.fieldname)) {
      images = [req.file.location || req.file.path];
    }

    const newBanner = await Banner.create({
      heading,
      description,
      images,
    });

    return res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: newBanner,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// GET ALL
// =====================================
exports.getAllBanners = async (req, res) => {
  try {
    const data = await Banner.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// GET SINGLE
// =====================================
exports.getSingleBanner = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const banner = await Banner.findById(req.params.id).lean();
    if (!banner)
      return res.status(404).json({ success: false, message: "Banner not found" });

    return res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// UPDATE
// =====================================
exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    let { heading, description, existingImages } = req.body;
    let finalImages;

    // 1. Process new uploads
    let newImages = [];
    if (req.files) {
      const allFiles = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
      newImages = allFiles.filter(f => ["images", "bannerImage", "image", "files"].includes(f.fieldname)).map(f => f.location || f.path);
    } else if (req.file && ["images", "bannerImage", "image", "files"].includes(req.file.fieldname)) {
      newImages = [req.file.location || req.file.path];
    }

    // 2. Combine with existing ones
    if (existingImages) {
      try {
        const parsedExisting = JSON.parse(existingImages);
        finalImages = [...(Array.isArray(parsedExisting) ? parsedExisting : []), ...newImages];
      } catch (e) {
        finalImages = newImages;
      }
    } else if (newImages.length > 0) {
      finalImages = newImages;
    }

    const updateData = {};
    if (heading !== undefined) updateData.heading = heading;
    if (description !== undefined) updateData.description = description;
    if (finalImages !== undefined) updateData.images = finalImages;

    const updated = await Banner.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated)
      return res.status(404).json({ success: false, message: "Banner not found" });

    return res.status(200).json({ success: true, message: "Banner updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================
// DELETE
// =====================================
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const deleted = await Banner.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Banner not found" });

    return res.status(200).json({ success: true, message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
