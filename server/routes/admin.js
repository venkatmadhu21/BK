const express = require('express');
const { body, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const Member = require('../models/Member');
const News = require('../models/News');
const Event = require('../models/Event');
const Relationship = require('../models/Relationship');
const HeirarchyFormEntry = require('../models/fami');
const TempMember = require('../models/TempMember');
const FamilyMember = require('../models/FamilyMember');
const LegacyLogin = require('../models/LegacyLogin');
const { adminAuth } = require('../middleware/auth');
const emailService = require('../utils/emailService');

const router = express.Router();

const getNextSerNo = async () => {
  try {
    const lastMember = await Member.findOne().sort({ serNo: -1 });
    const maxSerNo = lastMember?.serNo || 0;
    
    const nextSerNo = maxSerNo + 1;
    
    const existingMember = await Member.findOne({ serNo: nextSerNo });
    
    if (existingMember) {
      let candidate = nextSerNo + 1;
      let attempts = 0;
      while (attempts < 100) {
        const existingCandidate = await Member.findOne({ serNo: candidate });
        if (!existingCandidate) {
          return candidate;
        }
        candidate++;
        attempts++;
      }
      throw new Error('Could not find available serial number after 100 attempts');
    }
    
    return nextSerNo;
  } catch (error) {
    console.error('Error in getNextSerNo:', error);
    throw error;
  }
};

const generateTemporaryPassword = () => {
  const length = 12;
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  let password = '';
  
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

const validateMemberData = (formData) => {
  const errors = [];
  const personalDetails = formData.personalDetails || {};
  
  if (!personalDetails.firstName) errors.push('First name is required');
  if (!personalDetails.lastName) errors.push('Last name is required');
  if (!personalDetails.gender) errors.push('Gender is required');
  if (!personalDetails.dateOfBirth) errors.push('Date of birth is required');
  if (!personalDetails.confirmDateOfBirth) errors.push('Date of birth confirmation is required');
  if (!personalDetails.isAlive) errors.push('Alive status is required');
  if (!personalDetails.confirmDateOfDeath) errors.push('Date of death confirmation is required');
  if (!personalDetails.email) errors.push('Email is required');
  if (!personalDetails.mobileNumber) errors.push('Mobile number is required');
  if (!personalDetails.country) errors.push('Country is required');
  if (!personalDetails.state) errors.push('State is required');
  if (!personalDetails.district) errors.push('District is required');
  if (!personalDetails.city) errors.push('City is required');
  if (!personalDetails.area) errors.push('Area is required');
  if (!personalDetails.colonyStreet) errors.push('Colony/Street is required');
  if (!personalDetails.flatPlotNumber) errors.push('Flat/Plot number is required');
  if (!personalDetails.pinCode) errors.push('Postal code is required');
  if (!personalDetails.aboutYourself) errors.push('About yourself is required');
  if (!personalDetails.qualifications) errors.push('Qualifications are required');
  if (!personalDetails.everMarried) errors.push('Marital history is required');
  
  return errors;
};

const convertFormToMember = async (formData) => {
  const nextSerNo = await getNextSerNo();
  
  return {
    isapproved: true,
    
    personalDetails: formData.personalDetails || null,
    divorcedDetails: formData.divorcedDetails || null,
    marriedDetails: formData.marriedDetails || null,
    remarriedDetails: formData.remarriedDetails || null,
    widowedDetails: formData.widowedDetails || null,
    parentsInformation: formData.parentsInformation || null,
    
    vansh: null,
    serNo: nextSerNo,
    fatherSerNo: null,
    motherSerNo: null,
    spouseSerNo: null,
    childrenSerNos: [],
    level: 1
  };
};

const logAdminAction = async (action, userId, details) => {
  console.log(`ADMIN ACTION: ${action} by user ${userId} - ${JSON.stringify(details)}`);
};

router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const [userCount, familyCount, newsCount, eventCount, loginCount] = await Promise.all([
      User.countDocuments(),
      Member.countDocuments(),
      News.countDocuments(),
      Event.countDocuments(),
      LegacyLogin.countDocuments()
    ]);

    res.json({
      stats: {
        users: userCount,
        familyMembers: familyCount,
        news: newsCount,
        events: eventCount,
        loginDetails: loginCount
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.get('/login-details', adminAuth, async (req, res) => {
  try {
    const loginDetails = await LegacyLogin.find().sort({ createdAt: -1 });
    res.json(loginDetails);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.post('/users', [
  adminAuth,
  body('firstName', 'First name is required').notEmpty(),
  body('lastName', 'Last name is required').notEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  body('gender', 'Gender is required').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password, phone, gender, role = 'user', isActive = true } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      gender,
      role,
      isAdmin: role === 'admin',
      isActive
    });

    const salt = await require('bcryptjs').genSalt(10);
    user.password = await require('bcryptjs').hash(password, salt);

    await user.save();

    await logAdminAction('CREATE_USER', req.user.id, { newUserId: user.id, email });

    res.json({ message: 'User created successfully', user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.put('/users/:id', adminAuth, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, gender, role, isActive, password } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (gender) updateData.gender = gender;
    if (role) {
      updateData.role = role;
      updateData.isAdmin = role === 'admin';
    }
    if (isActive !== undefined) updateData.isActive = isActive;

    if (password) {
      const salt = await require('bcryptjs').genSalt(10);
      updateData.password = await require('bcryptjs').hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await logAdminAction('UPDATE_USER', req.user.id, { userId: req.params.id, changes: Object.keys(updateData) });

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await logAdminAction('DELETE_USER', req.user.id, { deletedUserId: req.params.id, email: user.email });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.get('/family-members', adminAuth, async (req, res) => {
  try {
    const members = await Member.find().sort({ serNo: 1 });
    res.json(members);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.post('/family-members', adminAuth, [
  body('serNo', 'Serial number is required').isNumeric(),
  body('personalDetails.firstName', 'First name is required').notEmpty(),
  body('personalDetails.lastName', 'Last name is required').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const member = new Member(req.body);
    await member.save();

    await logAdminAction('CREATE_FAMILY_MEMBER', req.user.id, { memberId: member.id, serNo: member.serNo });

    res.json({ message: 'Family member created successfully', member });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.put('/family-members/:id', adminAuth, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    const updateData = req.body;
    const fieldsToIgnore = ['_id', '__v', 'createdAt', 'updatedAt'];
    
    Object.keys(updateData).forEach(key => {
      if (fieldsToIgnore.includes(key)) {
        return;
      }
      
      const newValue = updateData[key];
      
      if (newValue === null || newValue === undefined) {
        return;
      }
      
      if (typeof newValue === 'object' && !Array.isArray(newValue) && !(newValue instanceof Date)) {
        const existingValue = member[key];
        if (existingValue && typeof existingValue === 'object') {
          const plainExisting = JSON.parse(JSON.stringify(existingValue));
          const merged = Object.assign(plainExisting, newValue);
          member[key] = merged;
        } else {
          member[key] = newValue;
        }
      } else {
        member[key] = newValue;
      }
    });

    await member.save({ validateBeforeSave: false });

    const updatedMember = await Member.findById(req.params.id);
    await logAdminAction('UPDATE_FAMILY_MEMBER', req.user.id, { memberId: req.params.id, serNo: updatedMember.serNo });

    res.json({ message: 'Family member updated successfully', member: updatedMember });
  } catch (error) {
    console.error('Error updating family member:', error.message);
    console.error('Error details:', error);
    
    let errorMessage = error.message || 'Unknown server error';
    let validationErrors = [];
    
    if (error.errors) {
      validationErrors = Object.values(error.errors).map(e => e.message);
    }
    
    res.status(500).json({ 
      message: errorMessage,
      errors: validationErrors.length > 0 ? validationErrors : [errorMessage]
    });
  }
});

router.delete('/family-members/:id', adminAuth, async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    await Relationship.deleteMany({
      $or: [
        { member1: member.serNo },
        { member2: member.serNo }
      ]
    });

    await logAdminAction('DELETE_FAMILY_MEMBER', req.user.id, { deletedMemberId: req.params.id, serNo: member.serNo });

    res.json({ message: 'Family member deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.get('/news', adminAuth, async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.post('/news', adminAuth, [
  body('title', 'Title is required').notEmpty(),
  body('content', 'Content is required').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const news = new News(req.body);
    await news.save();

    await logAdminAction('CREATE_NEWS', req.user.id, { newsId: news.id, title: news.title });

    res.json({ message: 'News created successfully', news });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.put('/news/:id', adminAuth, async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    await logAdminAction('UPDATE_NEWS', req.user.id, { newsId: req.params.id, title: news.title });

    res.json({ message: 'News updated successfully', news });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.delete('/news/:id', adminAuth, async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    await logAdminAction('DELETE_NEWS', req.user.id, { deletedNewsId: req.params.id, title: news.title });

    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.get('/events', adminAuth, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.post('/events', adminAuth, [
  body('title', 'Title is required').notEmpty(),
  body('description', 'Description is required').notEmpty(),
  body('date', 'Date is required').isISO8601()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const event = new Event(req.body);
    await event.save();

    await logAdminAction('CREATE_EVENT', req.user.id, { eventId: event.id, title: event.title });

    res.json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.put('/events/:id', adminAuth, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await logAdminAction('UPDATE_EVENT', req.user.id, { eventId: req.params.id, title: event.title });

    res.json({ message: 'Event updated successfully', event });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.delete('/events/:id', adminAuth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await logAdminAction('DELETE_EVENT', req.user.id, { deletedEventId: req.params.id, title: event.title });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.get('/relationships', adminAuth, async (req, res) => {
  try {
    const relationships = await Relationship.find().sort({ createdAt: -1 });
    res.json(relationships);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.post('/relationships', adminAuth, [
  body('fromSerNo', 'From serial number is required').isInt(),
  body('toSerNo', 'To serial number is required').isInt(),
  body('relation', 'Relationship type is required').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const relationship = new Relationship(req.body);
    await relationship.save();

    await logAdminAction('CREATE_RELATIONSHIP', req.user.id, {
      relationshipId: relationship.id,
      fromSerNo: relationship.fromSerNo,
      toSerNo: relationship.toSerNo,
      relation: relationship.relation
    });

    res.json({ message: 'Relationship created successfully', relationship });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.put('/relationships/:id', adminAuth, async (req, res) => {
  try {
    const relationship = await Relationship.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!relationship) {
      return res.status(404).json({ message: 'Relationship not found' });
    }

    await logAdminAction('UPDATE_RELATIONSHIP', req.user.id, {
      relationshipId: req.params.id,
      fromSerNo: relationship.fromSerNo,
      toSerNo: relationship.toSerNo,
      relation: relationship.relation
    });

    res.json({ message: 'Relationship updated successfully', relationship });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.delete('/relationships/:id', adminAuth, async (req, res) => {
  try {
    const relationship = await Relationship.findByIdAndDelete(req.params.id);

    if (!relationship) {
      return res.status(404).json({ message: 'Relationship not found' });
    }

    await logAdminAction('DELETE_RELATIONSHIP', req.user.id, { deletedRelationshipId: req.params.id });

    res.json({ message: 'Relationship deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.get('/heirarchy-form', adminAuth, async (req, res) => {
  try {
    const entries = await HeirarchyFormEntry.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.post('/heirarchy-form', adminAuth, async (req, res) => {
  try {
    const entry = await HeirarchyFormEntry.create(req.body);

    await logAdminAction('CREATE_HEIRARCHY_FORM_ENTRY', req.user.id, { entryId: entry.id });

    res.status(201).json({ message: 'Hierarchy form entry created successfully', entry });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.put('/heirarchy-form/:id', adminAuth, async (req, res) => {
  try {
    const currentEntry = await HeirarchyFormEntry.findById(req.params.id);
    
    if (!currentEntry) {
      return res.status(404).json({ message: 'Hierarchy form entry not found' });
    }

    const wasApproved = currentEntry.isapproved;
    const isBeingApproved = req.body.isapproved === true && !wasApproved;

    const entry = await HeirarchyFormEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (isBeingApproved) {
      try {
        const validationErrors = validateMemberData(entry);
        if (validationErrors.length > 0) {
          await HeirarchyFormEntry.findByIdAndUpdate(req.params.id, { isapproved: false });
          return res.status(400).json({ 
            message: 'Cannot approve form due to missing required fields',
            errors: validationErrors
          });
        }

        const memberData = await convertFormToMember(entry);
        const newMember = await Member.create(memberData);
        
        const personalDetails = entry.personalDetails || {};
        console.log(`✅ Member created with ser no: ${newMember.serNo}`);

        const temporaryPassword = generateTemporaryPassword();
        const email = personalDetails.email;
        const firstName = personalDetails.firstName;
        const lastName = personalDetails.lastName;
        const username = `${firstName.toLowerCase()}_${newMember.serNo}`;

        let userCreated = false;
        let emailSent = false;
        let credentialDetails = {
          username,
          email,
          tempPassword: temporaryPassword,
          serNo: newMember.serNo
        };

        try {
          let user = await User.findOne({ email });
          
          if (!user) {
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(temporaryPassword, salt);

            user = new User({
              firstName,
              lastName,
              email,
              username,
              password: hashedPassword,
              gender: personalDetails.gender ? personalDetails.gender.charAt(0).toUpperCase() + personalDetails.gender.slice(1).toLowerCase() : 'Other',
              role: 'user',
              isAdmin: false,
              isActive: true,
              familyId: newMember._id,
              phone: personalDetails.mobileNumber
            });

            await user.save();
            userCreated = true;
            console.log(`👤 User account created for ${email}`);
          } else {
            console.log(`ℹ️  User account already exists for ${email}, skipping user creation`);
          }

          // SAVE CREDENTIALS TO LEGACY LOGIN TABLE FOR ALL USERS (NEW OR EXISTING)
          try {
            // Validate email exists before saving
            if (!email || email.trim() === '') {
              console.error(`❌ Cannot save legacy login record: email is empty or undefined`);
              console.error(`   personalDetails:`, personalDetails);
            } else {
              const legacyLoginData = {
                email: email.toLowerCase(),
                username: username,
                password: temporaryPassword,
                serNo: newMember.serNo,
                serno: newMember.serNo,
                firstName: firstName,
                lastName: lastName,
                isActive: true
              };
              
              // Use updateOne with upsert to save/update the record
              const updateResult = await LegacyLogin.updateOne(
                { email: email.toLowerCase() },
                { $set: legacyLoginData },
                { upsert: true }
              );
              
              // Verify the record was actually created/updated
              if (updateResult.matchedCount === 0 && updateResult.upsertedId === null) {
                console.error(`⚠️  updateOne completed but no record was matched or upserted for email: ${email}`);
                // Try an alternative approach - create directly if upsert failed
                try {
                  const existingRecord = await LegacyLogin.findOne({ email: email.toLowerCase() });
                  if (!existingRecord) {
                    const newRecord = new LegacyLogin(legacyLoginData);
                    await newRecord.save();
                    console.log(`📝 Legacy login record created directly (upsert backup) for ${email}`);
                  }
                } catch (createError) {
                  console.error(`❌ Failed to create legacy login record as backup: ${createError.message}`);
                }
              } else {
                console.log(`📝 Legacy login record saved for ${email}`);
                console.log(`   Fields: email=${email}, username=${username}, serNo=${newMember.serNo}, firstName=${firstName}, lastName=${lastName}`);
                console.log(`   Matched: ${updateResult.matchedCount}, Upserted: ${updateResult.upsertedId ? 'yes' : 'no'}`);
              }
            }
          } catch (legacyError) {
            console.error(`❌ Failed to save legacy login record: ${legacyError.message}`);
            console.error(`   Error details:`, legacyError);
            console.error(`   Attempted data:`, { email, username, serNo: newMember.serNo });
          }

          try {
            await emailService.sendCredentialsEmail(
              email,
              firstName,
              lastName,
              username,
              temporaryPassword,
              newMember.serNo
            );
            emailSent = true;
            console.log(`✉️  Credentials sent to ${email}`);
          } catch (emailError) {
            console.error(`⚠️  Email sending failed: ${emailError.message}`);
            emailSent = false;
          }

        } catch (credentialError) {
          console.error('⚠️  Error in credential creation:', credentialError.message);
        }

        await logAdminAction('APPROVE_AND_CREATE_MEMBER', req.user.id, { 
          hierarchyFormId: req.params.id,
          memberId: newMember._id,
          serNo: newMember.serNo,
          name: `${firstName} ${lastName}`,
          userCreated,
          emailSent,
          email
        });

        return res.json({ 
          message: `Hierarchy form approved! Member created with ser no: ${newMember.serNo}. ${userCreated ? 'User account created. ' : ''}${emailSent ? 'Credentials email sent.' : 'Email sending failed - please send credentials manually.'}`, 
          entry,
          member: newMember,
          credentials: emailSent ? credentialDetails : null,
          userCreated,
          emailSent
        });
      } catch (memberError) {
        console.error('Error creating member:', memberError.message);
        console.error('Full error:', memberError);
        await HeirarchyFormEntry.findByIdAndUpdate(req.params.id, { isapproved: false });
        
        if (memberError.code === 11000) {
          const field = Object.keys(memberError.keyPattern)[0];
          const value = memberError.keyValue[field];
          return res.status(409).json({ 
            message: `Duplicate entry detected: ${field} with value ${value} already exists`,
            error: `E11000_DUPLICATE_KEY`,
            field: field
          });
        }
        
        return res.status(500).json({ 
          message: 'Error creating member record: ' + memberError.message,
          details: memberError.errors ? Object.entries(memberError.errors).map(([key, val]) => `${key}: ${val.message}`) : []
        });
      }
    }

    await logAdminAction('UPDATE_HEIRARCHY_FORM_ENTRY', req.user.id, { entryId: req.params.id });

    res.json({ message: 'Hierarchy form entry updated successfully', entry });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.delete('/heirarchy-form/:id', adminAuth, async (req, res) => {
  try {
    const entry = await HeirarchyFormEntry.findByIdAndDelete(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Hierarchy form entry not found' });
    }

    await logAdminAction('DELETE_HEIRARCHY_FORM_ENTRY', req.user.id, { entryId: req.params.id });

    res.json({ message: 'Hierarchy form entry deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.get('/temp-members', adminAuth, async (req, res) => {
  try {
    const tempMembers = await TempMember.find().sort({ createdAt: -1 });
    res.json(tempMembers);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.post('/temp-members', adminAuth, async (req, res) => {
  try {
    const tempMember = await TempMember.create(req.body);

    await logAdminAction('CREATE_TEMP_MEMBER', req.user.id, { tempMemberId: tempMember.id });

    res.status(201).json({ message: 'Temp member created successfully', tempMember });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.put('/temp-members/:id', adminAuth, async (req, res) => {
  try {
    const tempMember = await TempMember.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!tempMember) {
      return res.status(404).json({ message: 'Temp member not found' });
    }

    await logAdminAction('UPDATE_TEMP_MEMBER', req.user.id, { tempMemberId: req.params.id });

    res.json({ message: 'Temp member updated successfully', tempMember });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.delete('/temp-members/:id', adminAuth, async (req, res) => {
  try {
    const tempMember = await TempMember.findByIdAndDelete(req.params.id);

    if (!tempMember) {
      return res.status(404).json({ message: 'Temp member not found' });
    }

    await logAdminAction('DELETE_TEMP_MEMBER', req.user.id, { tempMemberId: req.params.id });

    res.json({ message: 'Temp member deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.post('/save-email-credentials', adminAuth, async (req, res) => {
  try {
    const { email, username, password, firstName, lastName, serNo } = req.body;
    
    // Validate required fields
    if (!email || email.trim() === '') {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    if (!password || password.trim() === '') {
      return res.status(400).json({ message: 'Password is required' });
    }
    
    console.log(`\n🔐 Admin saving email credentials for ${email}`);
    console.log(`   Username: ${username}, serNo: ${serNo}`);
    
    try {
      const legacyLoginData = {
        email: email.toLowerCase(),
        username: username || null,
        password: password,
        firstName: firstName || '',
        lastName: lastName || '',
        isActive: true
      };
      
      // Add serNo if provided
      if (serNo) {
        legacyLoginData.serNo = serNo;
        legacyLoginData.serno = serNo;
      }
      
      // Save/update the record with upsert
      const updateResult = await LegacyLogin.updateOne(
        { email: email.toLowerCase() },
        { $set: legacyLoginData },
        { upsert: true }
      );
      
      // Verify the record was saved
      if (updateResult.matchedCount > 0 || updateResult.upsertedId) {
        console.log(`✅ Email credentials saved successfully for ${email}`);
        console.log(`   Record matched: ${updateResult.matchedCount}, Upserted: ${updateResult.upsertedId ? 'yes' : 'no'}`);
        
        // Log the action
        await logAdminAction('SAVE_EMAIL_CREDENTIALS', req.user.id, { 
          email: email,
          username: username,
          serNo: serNo
        });
        
        return res.json({
          message: 'Email credentials saved successfully',
          data: {
            email: email,
            username: username,
            serNo: serNo
          }
        });
      } else {
        // Fallback: Try direct create
        console.error(`⚠️  updateOne did not create/match record, trying direct create`);
        const existingRecord = await LegacyLogin.findOne({ email: email.toLowerCase() });
        
        if (existingRecord) {
          return res.json({
            message: 'Email credentials already saved',
            data: legacyLoginData
          });
        }
        
        const newRecord = new LegacyLogin(legacyLoginData);
        await newRecord.save();
        console.log(`📝 Email credentials created directly for ${email}`);
        
        return res.json({
          message: 'Email credentials saved successfully',
          data: legacyLoginData
        });
      }
    } catch (saveError) {
      console.error(`❌ Failed to save email credentials: ${saveError.message}`);
      console.error(`   Error details:`, saveError);
      
      return res.status(500).json({
        message: 'Failed to save email credentials',
        error: saveError.message
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.put('/users/:userId/reset-credentials', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const temporaryPassword = generateTemporaryPassword();
    const email = user.email;
    const firstName = user.firstName;
    const lastName = user.lastName;
    
    console.log(`\n🔐 Admin resetting credentials for ${firstName} ${lastName} (${email})`);

    try {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(temporaryPassword, salt);
      
      user.password = hashedPassword;
      await user.save();
      console.log(`✅ Users collection password updated`);

      if (user.serNo) {
        const legacyUpdateResult = await LegacyLogin.updateOne(
          { serNo: user.serNo },
          { 
            $set: { 
              password: temporaryPassword,
              updatedAt: new Date()
            }
          }
        );

        if (legacyUpdateResult.matchedCount === 0) {
          console.log(`⚠️  No record found in LegacyLogin with serNo ${user.serNo}, trying LegacyLoginCap`);
          const capUpdateResult = await LegacyLoginCap.updateOne(
            { serNo: user.serNo },
            { 
              $set: { 
                password: temporaryPassword,
                updatedAt: new Date()
              }
            }
          );
          
          if (capUpdateResult.matchedCount === 0) {
            console.warn(`⚠️  No record found in either LegacyLogin or LegacyLoginCap with serNo ${user.serNo}`);
            console.warn(`   Email: ${email}, attempting to update by email instead`);
            
            // Fallback: Try to update by email
            const emailUpdateResult = await LegacyLogin.updateOne(
              { email: email.toLowerCase() },
              { 
                $set: { 
                  password: temporaryPassword,
                  serNo: user.serNo,
                  updatedAt: new Date()
                }
              },
              { upsert: true }
            );
            
            if (emailUpdateResult.matchedCount > 0 || emailUpdateResult.upsertedId) {
              console.log(`✅ LegacyLogin password updated via email fallback (email: ${email})`);
            } else {
              console.error(`❌ Failed to update LegacyLogin records via any method for serNo: ${user.serNo}, email: ${email}`);
            }
          } else {
            console.log(`✅ LegacyLoginCap collection password updated (serNo: ${user.serNo})`);
          }
        } else {
          console.log(`✅ LegacyLogin collection password updated (serNo: ${user.serNo})`);
        }
      } else {
        console.log(`⚠️  No serNo found for user, attempting to update by email`);
        if (email) {
          const emailUpdateResult = await LegacyLogin.updateOne(
            { email: email.toLowerCase() },
            { 
              $set: { 
                password: temporaryPassword,
                updatedAt: new Date()
              }
            }
          );
          
          if (emailUpdateResult.matchedCount > 0) {
            console.log(`✅ LegacyLogin password updated by email (${email})`);
          } else {
            console.warn(`⚠️  No LegacyLogin record found for email: ${email}`);
          }
        }
      }

      let emailSent = false;
      try {
        await emailService.sendCredentialsEmail(
          email,
          firstName,
          lastName,
          user.username || `${firstName.toLowerCase()}_${user.serNo}`,
          temporaryPassword,
          user.serNo
        );
        emailSent = true;
        console.log(`✉️  New credentials email sent to ${email}`);
      } catch (emailError) {
        console.error(`⚠️  Email sending failed: ${emailError.message}`);
      }

      await logAdminAction('RESET_USER_CREDENTIALS', req.user.id, { 
        userId: req.params.userId,
        userName: `${firstName} ${lastName}`,
        email: email,
        emailSent
      });

      return res.json({
        message: 'Credentials reset successfully',
        credentials: {
          username: user.username || `${firstName.toLowerCase()}_${user.serNo}`,
          temporaryPassword: temporaryPassword,
          email: email,
          firstName: firstName,
          lastName: lastName
        },
        emailSent: emailSent,
        note: emailSent ? 'New credentials sent to user email' : 'Email sending failed - please send credentials manually'
      });

    } catch (resetError) {
      console.error('❌ Error during credential reset:', resetError.message);
      return res.status(500).json({ 
        message: 'Error resetting credentials',
        error: resetError.message
      });
    }

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
