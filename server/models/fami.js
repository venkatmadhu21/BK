const mongoose = require("mongoose");

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
    spouseMobileNumber: { type: String, required: function() { return this.parent().remarriedDetails != null; } },
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

const familyMemberSchema = new mongoose.Schema(
  {
    personalDetails: personalDetailsSchema,
    divorcedDetails: divorcedDetailsSchema,
    marriedDetails: marriedDetailsSchema,
    remarriedDetails: remarriedDetailsSchema,
    widowedDetails: widowedDetailsSchema,
    parentsInformation: parentsInformationSchema,
    isapproved: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "Heirarchy_form" }
);

const FamilyMember = mongoose.model("FamilyMember", familyMemberSchema);

module.exports = FamilyMember;