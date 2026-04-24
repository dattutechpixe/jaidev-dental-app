const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    heading: { type: String, trim: true },
    description: { type: String, trim: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
