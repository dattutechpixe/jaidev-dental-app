const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// --------------------------------------------
// VALIDATION
// --------------------------------------------
const validateFile = (req, file, cb) => {
  if (!file) return cb(new Error("No file uploaded."), false);
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files allowed."), false);
  }
  cb(null, true);
};

// --------------------------------------------
// LIMITS
// --------------------------------------------
const fileLimits = {
  fileSize: 20 * 1024 * 1024, // 20MB
};

// --------------------------------------------
// LOCAL DISK STORAGE
// Saves to: <project>/storage/<folder>/
// Sets file.location = public URL  (mirrors multer-s3 interface)
// --------------------------------------------
const localDiskStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(process.cwd(), "storage", folder);
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const fileName = `${Date.now()}_${file.originalname}`;
      file._folder = folder;
      cb(null, fileName);
    },
  });

const attachLocation = (req, res, next) => {
  const base = `https://${req.get("host")}/storage`;
  if (req.file) {
    req.file.location = `${base}/${req.file._folder}/${req.file.filename}`;
  }
  if (req.files) {
    const files = Array.isArray(req.files)
      ? req.files
      : Object.values(req.files).flat();
    files.forEach((f) => {
      f.location = `${base}/${f._folder}/${f.filename}`;
    });
  }
  next();
};

// --------------------------------------------
// PROFILE IMAGES
// --------------------------------------------
const profileImages = multer({
  storage: localDiskStorage("profileImages"),
  limits: fileLimits,
  fileFilter: validateFile,
});

// --------------------------------------------
// REVIEW IMAGES
// --------------------------------------------
const reviewimages = multer({
  storage: localDiskStorage("reviewImages"),
  limits: fileLimits,
  fileFilter: validateFile,
});

// --------------------------------------------
// DYNAMIC UPLOAD FOR ANY CATEGORY
// --------------------------------------------
const dynamicUpload = (mode) => (req, res, next) => {
  const category = req.params.category || "others";

  const uploader = multer({
    storage: localDiskStorage(category),
    limits: fileLimits,
    fileFilter: validateFile,
  });

  let upload;
  if (mode === "create") {
    upload = uploader.any(); // Accept any field names
  } else if (mode === "profile") {
    upload = uploader.single("profileImage");
  } else if (mode === "files") {
    upload = uploader.any();
  } else {
    upload = uploader.any();
  }

  upload(req, res, (err) => {
    if (err)
      return res.status(400).json({ success: false, message: err.message });
    attachLocation(req, res, next);
  });
};

// --------------------------------------------
// EXPORT
// --------------------------------------------
module.exports = {
  profileImages,
  reviewimages,
  dynamicUpload,
};






// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("cloudinary").v2;
// require("dotenv").config();

// // --------------------------------------------
// // CLOUDINARY CONFIG
// // --------------------------------------------
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // --------------------------------------------
// // VALIDATION
// // --------------------------------------------
// const validateFile = (req, file, cb) => {
//   if (!file) return cb(new Error("No file uploaded."), false);
//   if (!file.mimetype.startsWith("image/")) {
//     return cb(new Error("Only image files allowed."), false);
//   }
//   cb(null, true);
// };

// // --------------------------------------------
// // LIMITS
// // --------------------------------------------
// const fileLimits = {
//   fileSize: 20 * 1024 * 1024, // 20MB
// };

// const profileImages = multer({
//   storage: new CloudinaryStorage({
//     cloudinary,
//     params: {
//       folder: "profileImages", // STATIC FOLDER
//       allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
//       transformation: [{ quality: "auto", fetch_format: "auto" }],
//     },
//   }),
//   limits: fileLimits,
//   fileFilter: validateFile,
// });


// const reviewimages = multer({
//   storage: new CloudinaryStorage({
//     cloudinary,
//     params: {
//       folder: "reviewImages",
//       allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
//       transformation: [{ quality: "auto", fetch_format: "auto" }],
//     },
//   }),
//   limits: fileLimits,
//   fileFilter: validateFile,
// });

// // --------------------------------------------
// // DYNAMIC STORAGE FOR ANY CATEGORY (doctor, nurse, labtech, equipment)
// // --------------------------------------------
// const createStorage = (folderName) =>
//   new CloudinaryStorage({
//     cloudinary,
//     params: {
//       folder: folderName,
//       allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
//       transformation: [{ quality: "auto", fetch_format: "auto" }],
//     },
//   });

// // --------------------------------------------
// // DYNAMIC UPLOADER
// // mode = "create" | "profile" | "files"
// // --------------------------------------------
// const dynamicUpload = (mode) => (req, res, next) => {
//   const category = req.params.category || "others"; // automatic folder

//   const storage = createStorage(category); // dynamic folder
//   const uploader = multer({
//     storage,
//     limits: fileLimits,
//     fileFilter: validateFile,
//   });

//   let upload;

//   if (mode === "create") {
//     upload = uploader.fields([
//       { name: "blogimage", maxCount: 1 },
//       { name: "profileImage", maxCount: 1 },
//       { name: "certificates", maxCount: 20 },
//       { name: "images", maxCount: 20 },
//     ]);
//   } else if (mode === "profile") {
//     upload = uploader.single("profileImage");
//   } else if (mode === "files") {
//     upload = uploader.any();
//   } else {
//     upload = uploader.any();
//   }

//   upload(req, res, (err) => {
//     if (err)
//       return res.status(400).json({
//         success: false,
//         message: err.message,
//       });

//     next();
//   });
// };

// // --------------------------------------------
// // EXPORT
// // --------------------------------------------
// module.exports = {
//   cloudinary,
//   profileImages,  // ⭐ KEEP THIS
//   reviewimages,   // ⭐ KEEP THIS
//   dynamicUpload,  // ⭐ NEW (use this for unified resources)
// };

// console.log("☁️ Cloudinary Unified + Fixed Upload System is Live 🚀");
