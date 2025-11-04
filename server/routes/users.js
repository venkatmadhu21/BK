const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const LegacyLogin = require('../models/LegacyLogin');
const LegacyLoginCap = require('../models/LegacyLoginCap');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @route   GET api/users
// @desc    Get all users (Admin only)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('-password')
      .sort({ firstName: 1, lastName: 1 });

    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const { id: userId, source } = req.user || {};

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (source === 'legacy') {
      return res.status(400).json({ message: 'Profile not available for legacy accounts' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user identifier' });
    }

    const user = await User.findById(userId)
      .select('-password')
      .populate('familyId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('firstName', 'First name is required').notEmpty(),
  body('lastName', 'Last name is required').notEmpty(),
  body('email', 'Please include a valid email').isEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id: userId, source } = req.user || {};

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (source === 'legacy') {
      return res.status(400).json({ message: 'Profile updates are not supported for legacy accounts' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user identifier' });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      profilePicture,
      address,
      occupation,
      maritalStatus
    } = req.body;

    const sanitizeString = (value) =>
      typeof value === 'string' ? value.trim() : value;

    const normalizedEmail = sanitizeString(email)?.toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ 
      email: normalizedEmail, 
      _id: { $ne: userId } 
    }).lean();

    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    let normalizedDate = null;
    if (dateOfBirth) {
      const parsedDate = new Date(dateOfBirth);
      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date of birth' });
      }
      normalizedDate = parsedDate;
    }

    const normalizedAddress = {
      street: sanitizeString(address?.street) || '',
      city: sanitizeString(address?.city) || '',
      state: sanitizeString(address?.state) || '',
      pincode: sanitizeString(address?.pincode) || '',
      country: sanitizeString(address?.country) || 'India'
    };

    const updatePayload = {
      firstName: sanitizeString(firstName),
      lastName: sanitizeString(lastName),
      email: normalizedEmail,
      phone: sanitizeString(phone) || '',
      dateOfBirth: normalizedDate,
      profilePicture: typeof profilePicture === 'string' ? profilePicture : '',
      address: normalizedAddress,
      occupation: sanitizeString(occupation) || '',
      maritalStatus: sanitizeString(maritalStatus) || 'Single'
    };

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updatePayload },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/change-password
// @desc    Change user password (syncs to both Users and LegacyLogin)
// @access  Private
router.put('/change-password', [
  auth,
  body('currentPassword', 'Current password is required').exists(),
  body('newPassword', 'New password must be 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id: userId, source } = req.user || {};
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (source === 'legacy') {
      return res.status(400).json({ message: 'Password changes are not supported for legacy accounts' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user identifier' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password for Users collection
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    // Also update LegacyLogin collection if user has serNo or serno
    if (user.familyId || req.user.serNo) {
      try {
        let serNo = req.user.serNo;
        
        if (!serNo) {
          // Try to find serNo from the user document
          const updatedUser = await User.findById(req.user.id);
          // Check if there's an embedded serNo or we need to look it up differently
          serNo = updatedUser.serNo || updatedUser.sNo;
        }

        if (serNo) {
          // Update LegacyLogin collection with new plaintext password
          // Note: This stores the plaintext password for backward compatibility
          const legacyUpdateResult = await LegacyLogin.updateOne(
            { serNo: serNo },
            { 
              $set: { 
                password: newPassword,
                updatedAt: new Date()
              }
            }
          );

          // Also try LegacyLoginCap collection
          if (legacyUpdateResult.matchedCount === 0) {
            await LegacyLoginCap.updateOne(
              { serNo: serNo },
              { 
                $set: { 
                  password: newPassword,
                  updatedAt: new Date()
                }
              }
            );
          }

          console.log(`✅ Password updated in Users collection and synced to LegacyLogin (serNo: ${serNo})`);
          res.json({ 
            message: 'Password updated successfully and synced to all systems',
            synced: true 
          });
        } else {
          console.log(`⚠️  Password updated in Users collection but no serNo found for LegacyLogin sync`);
          res.json({ 
            message: 'Password updated successfully',
            synced: false,
            warning: 'Could not sync to legacy system - no serial number found'
          });
        }
      } catch (legacyError) {
        console.error('⚠️  Error syncing password to LegacyLogin:', legacyError.message);
        res.json({ 
          message: 'Password updated successfully',
          synced: false,
          warning: 'Password updated in main system but sync to legacy system failed. Please notify admin.'
        });
      }
    } else {
      res.json({ 
        message: 'Password updated successfully',
        synced: false 
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/:id/status
// @desc    Activate/Deactivate user (Admin only)
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive } },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/:id/admin
// @desc    Grant/Revoke admin privileges (Super Admin only)
// @access  Private
router.put('/:id/admin', auth, async (req, res) => {
  try {
    const { isAdmin } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { isAdmin } },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/users/:id
// @desc    Delete user (Admin only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;