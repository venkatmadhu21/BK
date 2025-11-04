const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const LegacyLogin = require('../models/LegacyLogin');
const LegacyLoginCap = require('../models/LegacyLoginCap');
const auth = require('../middleware/auth');

const router = express.Router();

const titleCase = (value) => {
  if (!value || typeof value !== 'string') return '';
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

const extractLegacyNames = (legacy) => {
  if (!legacy) return { firstName: 'User', lastName: '' };
  const first =
    titleCase(legacy.firstName) ||
    titleCase(legacy.firstname) ||
    titleCase(legacy.first_name) ||
    titleCase(legacy.name);
  const last =
    titleCase(legacy.lastName) ||
    titleCase(legacy.lastname) ||
    titleCase(legacy.last_name);
  if (first || last) {
    return { firstName: first || 'User', lastName: last || '' };
  }
  const emailPrefix = typeof legacy.email === 'string' ? legacy.email.split('@')[0] : '';
  if (emailPrefix) {
    const formatted = titleCase(emailPrefix.replace(/[._-]+/g, ' '));
    if (formatted) {
      const parts = formatted.split(' ');
      return { firstName: parts[0] || 'User', lastName: parts.slice(1).join(' ') };
    }
  }
  const username = titleCase(legacy.username);
  if (username) {
    const parts = username.split(' ');
    return { firstName: parts[0] || 'User', lastName: parts.slice(1).join(' ') };
  }
  return { firstName: 'User', lastName: '' };
};

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

    // Save login credentials to LegacyLogin collection
    try {
      await LegacyLogin.updateOne(
        { email: email.toLowerCase() },
        { $set: {
          email: email.toLowerCase(),
          username: user.username || `${firstName.toLowerCase()}_${user._id.toString().slice(-6)}`,
          password: password,
          firstName: firstName,
          lastName: lastName,
          isActive: true
        }},
        { upsert: true }
      );
    } catch (legacyErr) {
      console.error(`⚠️ LegacyLogin save failed: ${legacyErr.message}`);
    }

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
  body('password').trim().notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('❌ Login validation error:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, username, password } = req.body;

  if (!email && !username) {
    console.error('❌ Login failed: No email or username provided. Body:', req.body);
    return res.status(400).json({ message: 'Please provide email or username' });
  }

  try {
    console.log(`🔐 Login attempt with email: ${email || 'N/A'}, username: ${username || 'N/A'}`);

    // Special admin credentials check - support both email and username
    const isAdminEmailLogin = email === 'admin123@gmail.com' && password === '1234567890';
    const isAdminUsernameLogin = username === 'admin_1' && password === 'admin1234';

    if (isAdminEmailLogin || isAdminUsernameLogin) {
      // Check if admin user exists, create if not
      let adminUser = await User.findOne({ $or: [{ email: 'admin123@gmail.com' }, { username: 'admin_1' }] });
      if (!adminUser) {
        // Create admin user
        adminUser = new User({
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin123@gmail.com',
          username: 'admin_1',
          password: isAdminUsernameLogin ? 'admin1234' : '1234567890', // Will be hashed below
          gender: 'Male',
          role: 'admin',
          isAdmin: true,
          isActive: true
        });
        const salt = await bcrypt.genSalt(10);
        adminUser.password = await bcrypt.hash(adminUser.password, salt);
        await adminUser.save();
        console.log(`✅ Admin user created with username: admin_1`);
      }

      const payload = {
        user: {
          id: adminUser.id,
          email: adminUser.email,
          username: adminUser.username,
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
          console.log(`✅ Admin login successful`);
          return res.json({
            token,
            user: {
              id: adminUser.id,
              firstName: adminUser.firstName,
              lastName: adminUser.lastName,
              email: adminUser.email,
              username: adminUser.username,
              isAdmin: true,
              role: 'admin',
              profilePicture: adminUser.profilePicture
            }
          });
        }
      );
    }

    // 1) Try modern Users collection (bcrypt) - search by email or username
    let user;
    if (email) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else if (username) {
      user = await User.findOne({ username: username.toLowerCase() });
    }

    if (user) {
      console.log(`📝 User found in Users collection: ${user.email}`);
      if (!user.isActive) {
        console.log(`❌ User account is deactivated: ${user.email}`);
        return res.status(400).json({ message: 'Account is deactivated. Contact administrator.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log(`❌ Invalid password for user: ${user.email}`);
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const payload = {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
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
          console.log(`✅ User login successful: ${user.email}`);
          return res.json({
            token,
            user: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              username: user.username,
              isAdmin: user.isAdmin,
              role: user.role,
              profilePicture: user.profilePicture
            }
          });
        }
      );
    }

    // 2) Fallback to legacy 'login' collection (plaintext)
    // Legacy collection supports both email and username login
    let legacy;
    
    if (email) {
      legacy = await LegacyLogin.findOne({ email: email.toLowerCase() });
      if (!legacy) {
        legacy = await LegacyLoginCap.findOne({ email: email.toLowerCase() });
      }
    } else if (username) {
      legacy = await LegacyLogin.findOne({ username: username.toLowerCase() });
      if (!legacy) {
        legacy = await LegacyLoginCap.findOne({ username: username.toLowerCase() });
      }
    }
    
    if (!legacy) {
      console.log(`❌ No login credentials found for email: ${email}, username: ${username}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log(`📝 Found legacy login record`);
    
    if (legacy.isActive === false) {
      console.log(`❌ Legacy account is deactivated`);
      return res.status(400).json({ message: 'Account is deactivated. Contact administrator.' });
    }

    // Legacy passwords are plaintext per your note
    if ((legacy.password || '').trim() !== (password || '').trim()) {
      console.log(`❌ Invalid password for legacy user`);
      return res.status(400).json({ message: 'Invalid credentials (legacy mismatch)' });
    }

    // Issue token with minimal profile for legacy users
    const legacyNames = extractLegacyNames(legacy);
    const payload = {
      user: {
        id: `legacy:${legacy._id}`,
        email: legacy.email,
        username: legacy.username || undefined,
        isAdmin: false,
        role: 'user',
        source: 'legacy',
        serNo: legacy.serNo || legacy.serno || undefined,
        firstName: legacyNames.firstName,
        lastName: legacyNames.lastName
      }
    };

    return jwt.sign(
      payload,
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        console.log(`✅ Legacy user login successful: ${legacy.email}`);
        return res.json({
          token,
          user: {
            id: `legacy:${legacy._id}`,
            firstName: legacyNames.firstName,
            lastName: legacyNames.lastName,
            email: legacy.email,
            username: legacy.username || undefined,
            isAdmin: false,
            role: 'user',
            profilePicture: ''
          }
        });
      }
    );
  } catch (error) {
    console.error('❌ Login error:', error.message);
    console.error('Stack:', error.stack);
    return res.status(500).send('Server error');
  }
});

// @route   GET api/auth/user
// @desc    Get user data (supports legacy tokens)
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    if (req.user?.source === 'legacy') {
      const legacyId = typeof req.user.id === 'string' && req.user.id.includes(':') ? req.user.id.split(':')[1] : null;
      let legacyRecord = null;
      if (req.user.email) {
        legacyRecord = await LegacyLogin.findOne({ email: req.user.email.toLowerCase() });
        if (!legacyRecord) {
          legacyRecord = await LegacyLoginCap.findOne({ email: req.user.email.toLowerCase() });
        }
      }
      if (!legacyRecord && legacyId) {
        legacyRecord = await LegacyLogin.findById(legacyId);
        if (!legacyRecord) {
          legacyRecord = await LegacyLoginCap.findById(legacyId);
        }
      }
      const legacyNames = extractLegacyNames(legacyRecord || req.user);
      return res.json({
        id: req.user.id,
        firstName: legacyNames.firstName,
        lastName: legacyNames.lastName,
        email: req.user.email,
        username: legacyRecord?.username || req.user.username,
        isAdmin: false,
        role: 'user',
        profilePicture: ''
      });
    }

    const user = await User.findById(req.user.id).select('-password');
    return res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
