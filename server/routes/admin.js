const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Member = require('../models/Member');
const News = require('../models/News');
const Event = require('../models/Event');
const Relationship = require('../models/Relationship');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Audit log function
const logAdminAction = async (action, userId, details) => {
  // In a real app, you'd save this to a database
  console.log(`ADMIN ACTION: ${action} by user ${userId} - ${JSON.stringify(details)}`);
};

// @route   GET api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Admin
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const [userCount, familyCount, newsCount, eventCount] = await Promise.all([
      User.countDocuments(),
      Member.countDocuments(),
      News.countDocuments(),
      Event.countDocuments()
    ]);

    res.json({
      stats: {
        users: userCount,
        familyMembers: familyCount,
        news: newsCount,
        events: eventCount
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/admin/users
// @desc    Create user
// @access  Admin
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

// @route   PUT api/admin/users/:id
// @desc    Update user
// @access  Admin
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

// @route   DELETE api/admin/users/:id
// @desc    Delete user
// @access  Admin
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

// @route   GET api/admin/family-members
// @desc    Get all family members
// @access  Admin
router.get('/family-members', adminAuth, async (req, res) => {
  try {
    const members = await Member.find().sort({ serNo: 1 });
    res.json(members);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/admin/family-members
// @desc    Create family member
// @access  Admin
router.post('/family-members', adminAuth, [
  body('serNo', 'Serial number is required').isNumeric(),
  body('firstName', 'First name is required').notEmpty(),
  body('lastName', 'Last name is required').notEmpty()
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

// @route   PUT api/admin/family-members/:id
// @desc    Update family member
// @access  Admin
router.put('/family-members/:id', adminAuth, async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!member) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    await logAdminAction('UPDATE_FAMILY_MEMBER', req.user.id, { memberId: req.params.id, serNo: member.serNo });

    res.json({ message: 'Family member updated successfully', member });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/admin/family-members/:id
// @desc    Delete family member
// @access  Admin
router.delete('/family-members/:id', adminAuth, async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    // Also clean up relationships when deleting a member
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

// @route   GET api/admin/news
// @desc    Get all news
// @access  Admin
router.get('/news', adminAuth, async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/admin/news
// @desc    Create news
// @access  Admin
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

// @route   PUT api/admin/news/:id
// @desc    Update news
// @access  Admin
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

// @route   DELETE api/admin/news/:id
// @desc    Delete news
// @access  Admin
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

// @route   GET api/admin/events
// @desc    Get all events
// @access  Admin
router.get('/events', adminAuth, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/admin/events
// @desc    Create event
// @access  Admin
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

// @route   PUT api/admin/events/:id
// @desc    Update event
// @access  Admin
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

// @route   DELETE api/admin/events/:id
// @desc    Delete event
// @access  Admin
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

// @route   GET api/admin/relationships
// @desc    Get all relationships
// @access  Admin
router.get('/relationships', adminAuth, async (req, res) => {
  try {
    const relationships = await Relationship.find().populate('person1 person2');
    res.json(relationships);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/admin/relationships
// @desc    Create relationship
// @access  Admin
router.post('/relationships', adminAuth, [
  body('person1', 'Person 1 is required').isMongoId(),
  body('person2', 'Person 2 is required').isMongoId(),
  body('relationshipType', 'Relationship type is required').notEmpty()
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
      person1: relationship.person1,
      person2: relationship.person2,
      type: relationship.relationshipType
    });

    res.json({ message: 'Relationship created successfully', relationship });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/admin/relationships/:id
// @desc    Update relationship
// @access  Admin
router.put('/relationships/:id', adminAuth, async (req, res) => {
  try {
    const relationship = await Relationship.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!relationship) {
      return res.status(404).json({ message: 'Relationship not found' });
    }

    await logAdminAction('UPDATE_RELATIONSHIP', req.user.id, { relationshipId: req.params.id });

    res.json({ message: 'Relationship updated successfully', relationship });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/admin/relationships/:id
// @desc    Delete relationship
// @access  Admin
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

module.exports = router;