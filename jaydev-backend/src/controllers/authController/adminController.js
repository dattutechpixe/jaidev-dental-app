const { default: mongoose } = require("mongoose");
const { generateUserToken } = require("../../middlewares/authentication.js");
// const { deleteOldImages } = require("../../middlewares/cloudinary.js");
const { sendEmail } = require("../../utils/sendMail.js");
const { AadminForgetPassword } = require("../../utils/emailTemplate.js");
const admins = require("../../models/adminSchema.js");

// Admin Signup Controller
exports.adminSignup = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Validate required fields
    if (!firstname || !lastname || !email || !password) {
      const error = new Error("All fields are required");
      error.statuscode = 400;
      error.status = "Bad Request";
      return next(error);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error("Invalid or missing email address");
      error.statuscode = 401;
      error.status = "Bad Request";
      return next(error);
    }


    // Check if admin already exists
    const existingAdmin = await admins.findOne({ email });
    if (existingAdmin) {
      const error = new Error("Email already exists, try another");
      error.statuscode = 409;
      error.status = "Conflict";
      return next(error);
    }

    // Create new admin
    const newAdmin = await admins.create({
      firstname,
      lastname,
      email,
      password,
      status: "active",
    });

    if (!newAdmin) {
      const error = new Error(
        "Unable to create account, please contact the support team"
      );
      error.statuscode = 500;
      error.status = "Database Error";
      return next(error);
    }

    // Success response
    return res.status(201).json({
      success: true,
      statuscode: 201,
      message: "Admin account created successfully",
    });
  } catch (error) {
    const err = new Error("Internal Server Error");
    err.statuscode = 500;
    err.status = error.message;
    return next(err);
  }
};

// Admin Login Controller
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      const error = new Error("All fields are required");
      error.statuscode = 400;
      error.status = "Bad Request";
      return next(error);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error("Invalid or missing email address");
      error.statuscode = 401;
      error.status = "Bad Request";
      return next(error);
    }

    // Find admin by email
    const admin = await admins
      .findOne({ email })
      .select("password firstname lastname accountType status");

    if (!admin) {
      const error = new Error("Incorrect email");
      error.statuscode = 404;
      error.status = "Not Found";
      return next(error);
    }

    // Check if role is admin
    if (admin.accountType !== "admin") {
      const error = new Error("You are not authorized to access this resource");
      error.statuscode = 403;
      error.status = "Unauthorized";
      return next(error);
    }

    // Check password existence
    if (!admin.password) {
      const error = new Error("Password not set for this account");
      error.statuscode = 400;
      error.status = "Bad Request";
      return next(error);
    }

    // Validate password
    const isValidPassword = await admin.comparePassword(password);
    if (!isValidPassword) {
      const error = new Error("Incorrect password");
      error.statuscode = 401;
      error.status = "Unauthorized";
      return next(error);
    }

    // Check account status
    if (admin.status === "inactive") {
      const error = new Error("Account is inactive, please verify");
      error.statuscode = 403;
      error.status = "Bad Request";
      return next(error);
    }

    // Generate JWT token
    const token = generateUserToken(admin);

    // Save login expiry time
    admin.verify_expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await admin.save();

    // Success response
    return res.status(200).json({
      success: true,
      statuscode: 200,
      message: "Login successful",
      JWTtoken: token,
      username: `${admin.firstname} ${admin.lastname}`,
      userID: admin._id,
      role: admin.accountType,
    });
  } catch (error) {
    const err = new Error("Internal Server Error");
    err.statuscode = 500;
    err.status = error.message;
    return next(err);
  }
};
exports.uploadadminProfilePic = async (req, res, next) => {
  try {
    // ✅ Step 1: Validate that file is uploaded
    if (!req.files && !req.file) {
      const error = new Error("Profile image is required");
      error.statuscode = 400;
      error.status = "Bad Request";
      return next(error);
    }

    // ✅ Step 2: Extract new uploaded image info from multer
    let profilePicUrl = "";
    if (req.files && req.files.length > 0) {
      profilePicUrl = req.files[0].location;
    } else if (req.file) {
      profilePicUrl = req.file.location;
    }

    // ✅ Step 3: Fetch the currently logged-in admin
    const admin = await admins.findById(req.user._id);
    if (!admin) {
      const error = new Error("Admin not found");
      error.statuscode = 404;
      error.status = "Not Found";
      return next(error);
    }

    // ✅ Step 4: If old image exists, delete it safely from S3
    if (admin.profileUrl) {
      try {
        const oldKey = decodeURIComponent(
          new URL(admin.profileUrl).pathname
        ).substring(1); // Remove leading '/'
        await deleteOldImages([oldKey]);
      } catch (err) {
        console.error("Error deleting old image:", err.message);
      }
    }

    // ✅ Step 5: Update admin profile image URL in DB
    admin.profileUrl = profilePicUrl;
    // admin.cloudinaryPublicId = publicId; // Field not in schema
    await admin.save();

    // ✅ Step 6: Return success response
    return res.status(200).json({
      success: true,
      statuscode: 200,
      message: "Profile image updated successfully",
      imageUrl: profilePicUrl,
    });
  } catch (error) {
    const err = new Error("Internal Server Error");
    err.statuscode = 500;
    err.status = error.message;
    return next(err);
  }
};
exports.adminProfileUpdate = async (req, res, next) => {
  try {
    // ✅ Step 1: Define allowed fields (whitelist)
    const allowed = ["firstname", "lastname", "email", "phone"];
    const updatedData = {};

    // ✅ Step 2: Copy only allowed fields from body
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        updatedData[field] = req.body[field];
      }
    });

    // ✅ Step 3: Update admin document
    const updatedAdmin = await admins.findByIdAndUpdate(req.user._id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedAdmin) {
      const error = new Error("Admin not found");
      error.statuscode = 404;
      error.status = "Not Found";
      return next(error);
    }

    // ✅ Step 4: Respond with success message
    return res.status(200).json({
      success: true,
      statuscode: 200,
      message: "Profile updated successfully",
      updatedData,
    });
  } catch (error) {
    return res.status(error.statuscode || 500).json({
    success: false,
    message: error.message,
  });
  }
};
exports.changePassword = async (req, res, next) => {
  try {
    const { oldpassword, newpassword } = req.body;

    // 1️⃣ Check input
    if (!oldpassword || !newpassword) {
      return res.status(400).json({ error: "Both fields are required" });
    }

    // 2️⃣ Get user by ID from JWT
    const admin = await admins.findById(req.user._id).select("+password");
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    // 3️⃣ Verify old password
    const isMatch = await admin.comparePassword(oldpassword);
    if (!isMatch) {
      const error = new Error("Incorrect old password");
      error.statuscode = 401;
      error.status = "Bad Request";
      return next(error);
    }

    // 4️⃣ Prevent reusing the same password
    const samePassword = await admin.comparePassword(newpassword);
    if (samePassword) {
      const error = new Error("New password cannot be same as old password");
      error.statuscode = 401;
      error.status = "Bad Request";
      return next(error);
    }

    // 5️⃣ Save new password (auto-hashed by pre-save)
    admin.password = newpassword;
    await admin.save();

    // 6️⃣ Respond success
    return res.status(200).json({
      success: true,
      message: "Password updated successfully. Please login again.",
    });
  } catch (error) {
    const err = new Error("Internal Server Error");
    err.statuscode = 500;
    err.status = error.message;
    return next(err);
  }
};
exports.adminforgetpassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      const error = new Error('Email is required')
      error.statuscode = 400;
      error.status = 'Bad Request'
      return next(error)
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error('Invalid or missing email address')
      error.statuscode = 400;
      error.status = 'Bad Request'
      return next(error)
    }
    const user = await admins.findOne({ email })
    if (!user) {
      const error = new Error('User not found')
      error.statuscode = 404;
      error.status = 'Not Found'
      return next(error)
    }
    const fullname = user.firstname + ' ' + user.lastname;
    const role = user.accountType;
    await sendEmail({
      to: email,
      subject: 'Password Reset Request',
      text: AadminForgetPassword(fullname, email, role)
    })
    return res.status(200).json({
      success: true,
      statuscode: 200,
      message: 'Passowrd reset link sent successfully',
    })
  } catch (error) {
    const err = new Error('Internal Server Error')
    err.statuscode = 500;
    err.status = 'Server Error';
    return next(err);
  }
};

exports.adminsetnewpassword = async (req, res, next) => {
  try {
    //console.log('Request body:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      //console.log('Missing email or password');
      const error = new Error('Email and password are required');
      error.statuscode = 400;
      error.status = 'Bad Request';
      return next(error);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      //console.log('Invalid email format:', email);
      const error = new Error('Invalid or missing email address');
      error.statuscode = 400;
      error.status = 'Bad Request';
      return next(error);
    }

    //console.log('Looking for user with email:', email);
    const user = await admins.findOne({ email });
    if (!user) {
      //console.log('User not found with email:', email);
      const error = new Error('User not found');
      error.statuscode = 404;
      error.status = 'Not Found';
      return next(error);
    }

    //console.log('Updating password for user:', email);
    user.password = password;
    await user.save();

    //console.log('Password updated successfully for user:', email);
    return res.status(200).json({
      success: true,
      statuscode: 200,
      message: 'Password updated successfully, Please Login',
    });

  } catch (error) {
    //console.error('Error in adminsetnewpassword:', error);
    const err = new Error(error.message || 'Internal Server Error');
    err.statuscode = error.statuscode || 500;
    err.status = error.status || 'Server Error';
    return next(err);
  }
};
exports.getadmindata = async (req, res, next) => {
  try {
    const id = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error('Invalid user ID format')
      error.statuscode = 400;
      error.status = 'Bad Request';
      return next(error)
    }
    const user = await admins.findById(id).select('-verify_expiry -createdAt -updatedAt -password_attempts -isTermsAndConditions -__v')
    if (!user) {
      const error = new Error('User not found')
      error.statuscode = 404;
      error.status = 'Not Found';
      return next(error);
    }
    return res.status(200).json({
      success: true,
      statuscode: 200,
      message: "Admin data retrieved successfully",
      data: user

    })
  }
  catch (error) {
    const err = new Error('Internal Server Error');
    err.statuscode = 500;
    err.status = 'Server Error';
    return next(err);
  }
};


