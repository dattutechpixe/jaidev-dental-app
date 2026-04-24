const mongoose = require("mongoose");
const blog = require("../../models/blogsSchema.js");
// const { deleteOldImages } = require("../../middlewares/cloudinary.js");

exports.createblog = async (req, res) => {
  try {
    let { category, title, description, sections, conclusion, useofproduct } =
      req.body;
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        statuscode: 400,
        message: "All fields are required",
        error: "Bad Request",
      });
    }
    // -------- FIXED IMAGE HANDLING --------
    const files = Array.isArray(req.files)
      ? req.files
      : Object.values(req.files || {}).flat();

    const file = files.find(
      (f) => f.fieldname === "blogimage" || f.fieldname === "files",
    );

    if (!file) {
      return res.status(400).json({
        success: false,
        statuscode: 400,
        message: "Image is required",
        error: "Bad Request",
      });
    }

    const blogimage = file.location || file.path;

    // Parse sections if string
    if (sections && typeof sections === "string") {
      try {
        sections = JSON.parse(sections);
      } catch (e) {
        console.error("Error parsing sections:", e);
        return res.status(400).json({
          success: false,
          statuscode: 400,
          message: "Invalid sections format",
          error: "Invalid JSON in sections field",
        });
      }
    }

    const blogSections = Array.isArray(sections)
      ? sections.map((section) => ({
          heading: section?.heading || "",
          bullets: Array.isArray(section?.bullets)
            ? section.bullets.map((bullet) => String(bullet || "").trim())
            : [],
          description: section?.description || "",
        }))
      : [];

    const newblog = await blog.create({
      userId: req.user._id,
      category: category,
      title: title,

      description: description,
      sections: blogSections,
      recommendedProducts: conclusion,
      useofproduct: useofproduct,

      blogimage: blogimage,
    });
    if (!newblog) {
      return res.status(400).json({
        success: false,
        statuscode: 400,
        message: "Failed to create blog",
        error: "Bad Request",
      });
    }
    return res.status(200).json({
      success: true,
      statuscode: 200,
      message: "Blog created successfully",
      data: newblog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statuscode: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.updateblog = async (req, res) => {
  try {
    const { id } = req.params;
    let { category, title, description, sections, conclusion, useofproduct } =
      req.body;

    // 1. Check if blog exists yes done
    const blog_response = await blog.findById(id);
    if (!blog_response) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    // 2. Format Sections (Clean the data if it exists)
    if (sections && typeof sections === "string") {
      try {
        sections = JSON.parse(sections);
      } catch (e) {
        // Ignored
      }
    }

    let blogSections = blog_response.sections;
    if (sections && Array.isArray(sections)) {
      blogSections = sections.map((section) => ({
        heading: section?.heading || "",
        bullets: Array.isArray(section?.bullets) ? section.bullets : [],
        description: section?.description || "",
      }));
    }

    // Handle new image upload if exists
    let newBlogImage = blog_response.blogimage;
    const files = Array.isArray(req.files)
      ? req.files
      : Object.values(req.files || {}).flat();

    const file = files.find((f) => f.fieldname === "blogimage" || f.fieldname === "files");
    if (file) {
      newBlogImage = file.location || file.path;
    }

    // 3. Update with Mongoose
    const updatedblog = await blog.findByIdAndUpdate(
      id,
      {
        title,
        category,
        description,
        sections: blogSections,
        recommendedProducts: conclusion, // Stays as string
        useofproduct,
        blogimage: newBlogImage,
      },
      { new: true },
    );

    return res.status(200).json({ success: true, data: updatedblog });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateblogimage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        statuscode: 400,
        message: "Invalid ID",
        error: "Bad Request",
      });
    }

    // multer.any(): find blogimage manually
    const files = Array.isArray(req.files)
      ? req.files
      : Object.values(req.files || {}).flat();

    const file = files.find(
      (f) => f.fieldname === "blogimage" || f.fieldname === "files",
    );

    if (!file) {
      return res.status(400).json({
        success: false,
        statuscode: 400,
        message: "Image is required",
        error: "Bad Request",
      });
    }

    const blogimage = file.location || file.path;

    const blog_response = await blog.findById(id);
    if (!blog_response) {
      return res.status(404).json({
        success: false,
        statuscode: 404,
        message: "Blog not found",
        error: "Not Found",
      });
    }

    // Delete old image
    // if (blog_response.blogimage) {
    //   const key = decodeURIComponent(new URL(blog_response.blogimage).pathname).substring(1);
    //   await deleteOldImages(key);
    // }

    // Save new image
    blog_response.blogimage = blogimage;
    await blog_response.save();

    return res.status(200).json({
      success: true,
      statuscode: 200,
      message: "Blog image updated successfully",
      data: blog_response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statuscode: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.deleteblog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        statuscode: 400,
        message: "Invalid ID",
        error: "Bad Request",
      });
    }
    const blog_response = await blog.findById(id);
    if (!blog_response) {
      return res.status(404).json({
        success: false,
        statuscode: 404,
        message: "Blog not found",
        error: "Not Found",
      });
    }

    // Delete the blog image from S3 if it exists
    // if (blog_response.blogimage) {
    //   const key = decodeURIComponent(
    //     new URL(blog_response.blogimage).pathname
    //   ).substring(1);
    //   await deleteOldImages(key);
    // }

    // Delete the blog document
    const deletedBlog = await blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({
        success: false,
        statuscode: 404,
        message: "Failed to delete blog",
        error: "Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      statuscode: 200,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statuscode: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.getallblogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const allblogs = await blog
      .find()
      .skip(skip)
      .limit(limit)
      .select("blogimage title description category createdAt updatedAt _id");
    if (!allblogs) {
      return res.status(400).json({
        success: false,
        statuscode: 400,
        message: "No blogs found",
        error: "Bad Request",
      });
    }
    const total = await blog.countDocuments();
    return res.status(200).json({
      success: true,
      statuscode: 200,
      message: "Blogs fetched successfully",
      data: allblogs,
      total,
      totalpages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statuscode: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.getblogbyidortitle = async (req, res) => {
  try {
    const { id } = req.params;
    let blog_response = null;

    if (id && id !== "undefined" && mongoose.Types.ObjectId.isValid(id)) {
      blog_response = await blog.findById(id);
    }

    // if (!blog_response && title && title !== "undefined")
    //   blog_response = await blog.findOne({
    //     title: { $regex: new RegExp(title, "i") },
    //   });
    // }

    if (!blog_response) {
      return res.status(404).json({
        success: false,
        statuscode: 404,
        message: "Blog not found",
        error: "Not Found",
      });
    }
    blog_response.views = blog_response.views + 1;
    await blog_response.save();
    return res.status(200).json({
      success: true,
      statuscode: 200,
      message: "Blog fetched successfully",
      data: blog_response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statuscode: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
