const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    data: String, // base64 encoded image data
    mimeType: String,
    originalName: String,
  },
  { _id: false }
);

const personalDetailsSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    dateOfBirth: { type: Date, required: true },
    confirmDateOfBirth: { type: String, enum: ["yes", "no"], required: true },
    isAlive: { type: String, enum: ["yes", "no"], required: true },
    dateOfDeath: { type: Date },
    confirmDateOfDeath: { type: String, enum: ["yes", "no"], required: true },
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    alternateMobileNumber: { type: String },
    country: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, required: true },
    colonyStreet: { type: String, required: true },
    flatPlotNumber: { type: String, required: true },
    buildingNumber: { type: String },
    pinCode: { type: String, required: true },
    aboutYourself: { type: String, required: true },
    qualifications: { type: String, required: true },
    profession: { type: String },
    profileImage: imageSchema,
    everMarried: { type: String, enum: ["yes", "no"], required: true },
  },
  { _id: false }
);

const divorcedDetailsSchema = new mongoose.Schema(
  {
    description: String,
    spouseFirstName: { type: String, required: function() { return this.parent().divorcedDetails != null; } },
    spouseMiddleName: String,
    spouseLastName: { type: String, required: function() { return this.parent().divorcedDetails != null; } },
    dateOfDivorce: Date,
    spouseProfileImage: imageSchema,
    marriageDate: Date,
    everWidowed: { type: String, enum: ["yes", "no"], required: function() { return this.parent().divorcedDetails != null; } },
  },
  { _id: false }
);

const marriedDetailsSchema = new mongoose.Schema(
  {
    description: String,
    spouseFirstName: { type: String, required: function() { return this.parent().marriedDetails != null; } },
    spouseMiddleName: String,
    spouseLastName: { type: String, required: function() { return this.parent().marriedDetails != null; } },
    spouseGender: { type: String, enum: ["male", "female", "other"], required: function() { return this.parent().marriedDetails != null; } },
    dateOfMarriage: { type: Date, required: function() { return this.parent().marriedDetails != null; } },
    spouseDateOfBirth: { type: Date, required: function() { return this.parent().marriedDetails != null; } },
    spouseProfileImage: imageSchema,
    spouseEmail: String,
    spouseMobileNumber: String,
    everDivorced: { type: String, enum: ["yes", "no"], required: function() { return this.parent().marriedDetails != null; } },
  },
  { _id: false }
);

const remarriedDetailsSchema = new mongoose.Schema(
  {
    description: String,
    spouseFirstName: { type: String, required: function() { return this.parent().remarriedDetails != null; } },
    spouseMiddleName: String,
    spouseLastName: { type: String, required: function() { return this.parent().remarriedDetails != null; } },
    spouseGender: { type: String, enum: ["male", "female", "other"], required: function() { return this.parent().remarriedDetails != null; } },
    dateOfMarriage: { type: Date, required: function() { return this.parent().remarriedDetails != null; } },
    spouseDateOfBirth: { type: Date, required: function() { return this.parent().remarriedDetails != null; } },
    spouseEmail: String,
    spouseMobileNumber: String,
    spouseProfileImage: imageSchema,
  },
  { _id: false }
);

const widowedDetailsSchema = new mongoose.Schema(
  {
    description: String,
    spouseFirstName: { type: String, required: function() { return this.parent().widowedDetails != null; } },
    spouseMiddleName: String,
    spouseLastName: { type: String, required: function() { return this.parent().widowedDetails != null; } },
    spouseDateOfDeath: Date,
    spouseGender: { type: String, enum: ["male", "female", "other"], required: function() { return this.parent().widowedDetails != null; } },
    dateOfMarriage: Date,
    spouseDateOfBirth: Date,
    spouseEmail: String,
    spouseMobileNumber: String,
    spouseProfileImage: imageSchema,
    everRemarried: { type: String, enum: ["yes", "no"], required: function() { return this.parent().widowedDetails != null; } },
  },
  { _id: false }
);

const parentsInformationSchema = new mongoose.Schema(
  {
    description: String,
    fatherFirstName: { type: String, required: true },
    fatherMiddleName: String,
    fatherLastName: { type: String, required: true },
    fatherEmail: { type: String },
    fatherMobileNumber: { type: String },
    fatherDateOfBirth: { type: Date },
    fatherProfileImage: imageSchema,
    motherFirstName: { type: String, required: true },
    motherMiddleName: String,
    motherLastName: { type: String, required: true },
    motherMobileNumber: { type: String },
    motherDateOfBirth: { type: Date },
    motherProfileImage: imageSchema,
  },
  { _id: false }
);

const MemberSchema = new mongoose.Schema({
  // Approval status
  isapproved: {
    type: Boolean,
    default: false,
  },

  // Hierarchy form fields
  personalDetails: personalDetailsSchema,
  divorcedDetails: divorcedDetailsSchema,
  marriedDetails: marriedDetailsSchema,
  remarriedDetails: remarriedDetailsSchema,
  widowedDetails: widowedDetailsSchema,
  parentsInformation: parentsInformationSchema,

  // Family tree relationships
  vansh: {
    type: String,
    trim: true
  },
  serNo: {
    type: Number,
    required: false,
    unique: true,
    sparse: true
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
  }
}, {
  timestamps: true,
  collection: 'members'
});

// Virtual for full name
MemberSchema.virtual('fullName').get(function() {
  const personalDetails = this.personalDetails || {};
  const parts = [personalDetails.firstName, personalDetails.middleName, personalDetails.lastName].filter(part => part && part.trim());
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