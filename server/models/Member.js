const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  middleName: {
    type: String,
    trim: true,
    default: ''
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  vansh: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  serNo: {
    type: Number,
    required: true,
    unique: true
  },
  sonDaughterCount: {
    type: Number,
    default: 0
  },
  fatherSerNo: {
    type: Number,
    default: null
  },
  motherSerNo: {
    type: Number,
    default: null
  },
  spouseSerNo: {
    type: Number,
    default: null
  },
  childrenSerNos: {
    type: [Number],
    default: []
  },
  level: {
    type: Number,
    required: true
  },
  dob: {
    type: String, // Using string as per the data structure
    default: null
  },
  dod: {
    type: String, // Using string as per the data structure
    default: null
  },
  profileImage: {
    type: String,
    default: ''
  },
  Bio: {
    type: String,
    default: ''
  },
  isAlive: {
    type: Boolean,
    default: true
  },
  maritalInfo: {
    married: { type: Boolean, default: false },
    marriageDate: { type: String, default: null },
    divorced: { type: Boolean, default: false },
    widowed: { type: Boolean, default: false },
    remarried: { type: Boolean, default: false }
  }
}, {
  timestamps: true,
  collection: 'members'
});

// Virtual for full name
MemberSchema.virtual('fullName').get(function() {
  const parts = [this.firstName, this.middleName, this.lastName].filter(part => part && part.trim());
  return parts.join(' ');
});

// Virtual for name (backward compatibility)
MemberSchema.virtual('name').get(function() {
  return this.fullName;
});

// Index for better query performance
MemberSchema.index({ serNo: 1 });
MemberSchema.index({ level: 1 });
MemberSchema.index({ fatherSerNo: 1, motherSerNo: 1 });
MemberSchema.index({ spouseSerNo: 1 });

// Ensure virtuals are included in JSON output
MemberSchema.set('toJSON', { virtuals: true });
MemberSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Member', MemberSchema);