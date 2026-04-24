const jwt = require("jsonwebtoken");
require("dotenv").config();
const admins = require("../models/adminSchema.js");
const crypto = require('crypto');

const sitename = process.env.SITE_NAME;

// AES Keys
// const key1 = Buffer.from(process.env.KEY1, 'utf8');
// const iv1 = Buffer.from(process.env.IV1, 'utf8');
// const key2 = Buffer.from(process.env.KEY2, 'utf8');
// const iv2 = Buffer.from(process.env.IV2, 'utf8');

// ===== JWT: Generate Token =====
exports.generateUserToken = (user) => {
  const data = { id: user._id, status: user.status };
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// ===== Admin Authentication =====
exports.adminAuthenticate = async (req, res, next) => {
  try {
   
    const bearerKey = req.headers["authorization"];
    if (!bearerKey) return res.status(401).json({ error: "please login" });

    const token = bearerKey.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
  
    const admin = await admins.findById(decode.id);

    if (!admin) return res.status(404).json({ error: "Admin not found" });
    if (admin.status !== "active")
      return res.status(403).json({ error: "Account is inactive" });

    req.user = admin;
    next();
   
  } catch (error) {
    console.error("=== ERROR in adminAuthenticate ===", error);
    if (error.name === 'TokenExpiredError')
      return res.status(401).json({ message: 'Token expired', expiredAt: error.expiredAt });
    return res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

// ===== Optional Auth =====
exports.authenticateifNeeded = async (req, res, next) => {
  req.user = null;
  next();
};

// ===== Role Check =====
exports.isAdmin = async (req, res, next) => {
  if (!req.user || req.user.accountType !== "admin")
    return res.status(401).json({ message: "Unauthorized access" });
  next();
};

// ===== OTP =====
exports.genrateotp = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  const otp_expiry = new Date(Date.now() + 3*60 * 1000);
  return { otp, otp_expiry };
};

// ===== AES Double Encryption =====
function encryptLayer(text, key, iv) {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

exports.doubleEncrypt = async (plainText) => {
  try {
    const firstLayer = encryptLayer(plainText, key1, iv1);
    const secondLayer = encryptLayer(firstLayer, key2, iv2);
    return secondLayer;
  } catch (err) {
    console.error("Encryption failed:", err);
    throw new Error("Encryption failed");
  }
};
