const mongoose = require('mongoose');

const FamilyMemberSchema = new mongoose.Schema({
  name: {
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
  spouse: {
    name: String,
    serNo: Number
  },
  fatherSerNo: {
    type: Number
  },
  motherSerNo: {
    type: Number
  },
  childrenSerNos: {
    type: [Number],
    default: []
  },
  level: {
    type: Number,
    required: true
  },
  // Additional fields that might be useful
  dateOfBirth: {
    type: Date
  },
  dateOfDeath: {
    type: Date
  },
  profilePicture: {
    type: String,
    default: ''
  },
  occupation: {
    type: String,
    trim: true
  },
  biography: {
    type: String,
    maxlength: 1000
  },
  achievements: [{
    title: String,
    description: String,
    date: Date
  }],
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  }
}, {
  timestamps: true
});

// Index for better query performance
FamilyMemberSchema.index({ serNo: 1 });
FamilyMemberSchema.index({ level: 1 });
FamilyMemberSchema.index({ fatherSerNo: 1, motherSerNo: 1 });

module.exports = mongoose.models.FamilyMember || mongoose.model('FamilyMember', FamilyMemberSchema);