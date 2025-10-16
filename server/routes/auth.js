const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const LegacyLogin = require('../models/LegacyLogin');
const LegacyLoginCap = require('../models/LegacyLoginCap');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
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

  const { firstName, lastName, email, password, phone, dateOfBirth, gender, address, occupation } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      address,
      occupation
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
            role: user.role
          }
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token (supports Users and legacy Login collection)
// @access  Public
router.post('/login', [
  body('email').trim().isEmail().withMessage('Please include a valid email').normalizeEmail(),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Special admin credentials check
    if (email === 'admin123@gmail.com' && password === '1234567890') {
      // Check if admin user exists, create if not
      let adminUser = await User.findOne({ email: 'admin123@gmail.com' });
      if (!adminUser) {
        // Create admin user
        adminUser = new User({
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin123@gmail.com',
          password: '1234567890', // Will be hashed below
          gender: 'Male',
          role: 'admin',
          isAdmin: true,
          isActive: true
        });
        const salt = await bcrypt.genSalt(10);
        adminUser.password = await bcrypt.hash(password, salt);
        await adminUser.save();
      }

      const payload = {
        user: {
          id: adminUser.id,
          email: adminUser.email,
          isAdmin: true,
          role: 'admin',
          source: 'users'
        }
      };

      return jwt.sign(
        payload,
        process.env.JWT_SECRET || 'defaultsecret',
        { expiresIn: '24h' },
        (err, token) => {
          if (err) throw err;
          return res.json({
            token,
            user: {
              id: adminUser.id,
              firstName: adminUser.firstName,
              lastName: adminUser.lastName,
              email: adminUser.email,
              isAdmin: true,
              role: 'admin',
              profilePicture: adminUser.profilePicture
            }
          });
        }
      );
    }

    // 1) Try modern Users collection (bcrypt)
    let user = await User.findOne({ email });
    if (user) {
      if (!user.isActive) {
        return res.status(400).json({ message: 'Account is deactivated. Contact administrator.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const payload = {
        user: {
          id: user.id,
          email: user.email,
          isAdmin: user.isAdmin,
          role: user.role,
          source: 'users'
        }
      };

      return jwt.sign(
        payload,
        process.env.JWT_SECRET || 'defaultsecret',
        { expiresIn: '24h' },
        (err, token) => {
          if (err) throw err;
          return res.json({
            token,
            user: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              isAdmin: user.isAdmin,
              role: user.role,
              profilePicture: user.profilePicture
            }
          });
        }
      );
    }

    // 2) Fallback to legacy 'login' collection (plaintext)
    // Try both 'login' and 'Login' collections just in case
    let legacy = await LegacyLogin.findOne({ email: email.toLowerCase() });
    if (!legacy) {
      legacy = await LegacyLoginCap.findOne({ email: email.toLowerCase() });
    }
    if (!legacy) {
      return res.status(400).json({ message: 'Invalid credentials (legacy not found)' });
    }
    if (legacy.isActive === false) {
      return res.status(400).json({ message: 'Account is deactivated. Contact administrator.' });
    }

    // Legacy passwords are plaintext per your note
    if ((legacy.password || '').trim() !== (password || '').trim()) {
      return res.status(400).json({ message: 'Invalid credentials (legacy mismatch)' });
    }

    // Issue token with minimal profile for legacy users
    const payload = {
      user: {
        id: `legacy:${legacy._id}`,
        email: legacy.email,
        isAdmin: false,
        role: 'user',
        source: 'legacy',
        serNo: legacy.serNo || legacy.serno || undefined
      }
    };

    return jwt.sign(
      payload,
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        return res.json({
          token,
          user: {
            id: `legacy:${legacy._id}`,
            firstName: 'User',
            lastName: '',
            email: legacy.email,
            isAdmin: false,
            role: 'user',
            profilePicture: ''
          }
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server error');
  }
});

// @route   GET api/auth/user
// @desc    Get user data (supports legacy tokens)
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    // If token came from legacy source, return minimal profile
    if (req.user?.source === 'legacy') {
      return res.json({
        id: req.user.id,
        firstName: 'User',
        lastName: '',
        email: req.user.email,
        isAdmin: false,
        role: 'user',
        profilePicture: ''
      });
    }

    const user = await User.findById(req.user.id).select('-password');
    return res.json(user);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server error');
  }
});

module.exports = router;