const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
  {
    equipmentName:       { type: String, required: true, trim: true },
    equipmentdescription:{ type: String, trim: true },
    description:         { type: String, trim: true },
    indications:         [{ type: String }],
    features:            [{ type: String }],
    images:              [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("equipment", equipmentSchema);
