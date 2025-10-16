const mongoose = require('mongoose');

// Same schema as LegacyLogin, but referencing collection name with capital 'L': 'Login'
const LegacyLoginCapSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  serNo: { type: Number },
  serno: { type: Number },
  isActive: { type: Boolean, default: true }
}, { timestamps: false });

module.exports = mongoose.model('LegacyLoginCap', LegacyLoginCapSchema, 'Login');