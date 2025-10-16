const mongoose = require('mongoose');

// Legacy login collection schema (plaintext passwords)
// Collection name is explicitly set to 'login' to match existing data
const LegacyLoginSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, index: true },
  password: { type: String, required: true }, // plaintext per legacy system
  serNo: { type: Number }, // some DBs use serNo
  serno: { type: Number }, // some DBs use serno
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('LegacyLogin', LegacyLoginSchema, 'login');