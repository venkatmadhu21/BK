const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  occupation: {
    type: String,
    trim: true
  },
  maritalStatus: {
    type: String,
    enum: ['Single', 'Married', 'Divorced', 'Widowed'],
    default: 'Single'
  },
  // Backward-compatible admin flag
  isAdmin: {
    type: Boolean,
    default: false
  },
  // Role-based access control
  role: {
    type: String,
    enum: ['admin', 'dataentry', 'user'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);