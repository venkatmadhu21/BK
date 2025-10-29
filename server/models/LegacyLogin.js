const mongoose = require('mongoose');

// Legacy login collection schema (plaintext passwords)
// Collection name is explicitly set to 'login' to match existing data
const LegacyLoginSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true },
  username: { type: String, sparse: true },
  password: { type: String, required: true },
  serNo: { type: Number },
  serno: { type: Number },
  firstName: { type: String },
  lastName: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('LegacyLogin', LegacyLoginSchema, 'login');