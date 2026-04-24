const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: false,
      trim: true,
    },
    blogimage: {
      type: String,
      required: true,
    },
    useofproduct: {
      type: String,
    },

    description: {
      type: String,
      required: true,
    },
    sections: [
      {
        heading: {
          type: String,
        },
        bullets: [{ type: String }],
        description: {
          type: String,
        },
      },
    ],
    recommendedProducts: {
      type: String,
    },

    // finalthoughts:{
    //     type: String
    // },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("blogs", blogSchema);
