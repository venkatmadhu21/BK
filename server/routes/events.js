const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @route   GET api/events
// @desc    Get all events
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { eventType, status, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (eventType && eventType !== 'all') {
      query.eventType = eventType;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const events = await Event.find(query)
      .populate('organizer', 'firstName lastName profilePicture')
      .populate('coOrganizers', 'firstName lastName profilePicture')
      .populate('attendees.user', 'firstName lastName profilePicture')
      .sort({ startDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(query);

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/events/:id
// @desc    Get event by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'firstName lastName profilePicture')
      .populate('coOrganizers', 'firstName lastName profilePicture')
      .populate('attendees.user', 'firstName lastName profilePicture')
      .populate('requirements.assignedTo', 'firstName lastName');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/events
// @desc    Create event
// @access  Private
router.post('/', [
  auth,
  body('title', 'Title is required').notEmpty(),
  body('description', 'Description is required').notEmpty(),
  body('eventType', 'Event type is required').notEmpty(),
  body('startDate', 'Start date is required').isISO8601(),
  body('endDate', 'End date is required').isISO8601(),
  body('startTime', 'Start time is required').notEmpty(),
  body('endTime', 'End time is required').notEmpty(),
  body('venue.name', 'Venue name is required').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      title,
      description,
      eventType,
      startDate,
      endDate,
      startTime,
      endTime,
      venue,
      coOrganizers,
      images,
      isPublic,
      maxAttendees,
      requirements,
      priority
    } = req.body;

    const organizerId = req.user?.id;
    if (!organizerId || !mongoose.Types.ObjectId.isValid(organizerId)) {
      return res.status(400).json({ message: 'Only registered members can create events' });
    }

    const event = new Event({
      title,
      description,
      eventType,
      startDate,
      endDate,
      startTime,
      endTime,
      venue,
      organizer: organizerId,
      coOrganizers,
      images,
      isPublic: isPublic !== false,
      maxAttendees,
      requirements,
      priority: priority || 'Medium'
    });

    await event.save();

    const populatedEvent = await Event.findById(event._id)
      .populate('organizer', 'firstName lastName profilePicture')
      .populate('coOrganizers', 'firstName lastName profilePicture');

    res.json(populatedEvent);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/events/:id
// @desc    Update event
// @access  Private (Organizer or Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is organizer or admin
    if (event.organizer.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('organizer', 'firstName lastName profilePicture')
     .populate('coOrganizers', 'firstName lastName profilePicture');

    res.json(event);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/events/:id
// @desc    Delete event
// @access  Private (Organizer or Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is organizer or admin
    if (event.organizer.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/events/:id/attend
// @desc    Register/Unregister for event
// @access  Private
router.put('/:id/attend', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const { status } = req.body; // 'Going', 'Maybe', 'Not Going'

    const attendeeIndex = event.attendees.findIndex(attendee => 
      attendee.user.toString() === req.user.id
    );

    if (attendeeIndex > -1) {
      if (status === 'Not Going') {
        // Remove attendee
        event.attendees.splice(attendeeIndex, 1);
      } else {
        // Update status
        event.attendees[attendeeIndex].status = status;
      }
    } else if (status !== 'Not Going') {
      // Add new attendee
      if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
        return res.status(400).json({ message: 'Event has reached maximum capacity' });
      }
      
      event.attendees.push({
        user: req.user.id,
        status: status || 'Going'
      });
    }

    await event.save();

    const populatedEvent = await Event.findById(req.params.id)
      .populate('attendees.user', 'firstName lastName profilePicture');

    res.json(populatedEvent.attendees);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/events/calendar/:year/:month
// @desc    Get events for specific month
// @access  Private
router.get('/calendar/:year/:month', auth, async (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const events = await Event.find({
      $or: [
        {
          startDate: {
            $gte: startDate,
            $lte: endDate
          }
        },
        {
          $and: [
            { startDate: { $lte: startDate } },
            { endDate: { $gte: startDate } }
          ]
        }
      ]
    })
    .populate('organizer', 'firstName lastName')
    .sort({ startDate: 1 });

    res.json(events);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;