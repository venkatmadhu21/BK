const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  eventType: {
    type: String,
    enum: ['Birthday', 'Anniversary', 'Wedding', 'Festival', 'Reunion', 'Memorial', 'Cultural', 'Religious', 'Other'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  venue: {
    name: {
      type: String,
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' }
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coOrganizers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  images: [{
    url: String,
    caption: String
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  maxAttendees: {
    type: Number,
    default: null
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['Going', 'Maybe', 'Not Going'],
      default: 'Going'
    },
    registrationDate: {
      type: Date,
      default: Date.now
    }
  }],
  requirements: [{
    item: String,
    isRequired: Boolean,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  reminderSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for date-based queries
EventSchema.index({ startDate: 1, endDate: 1 });
EventSchema.index({ eventType: 1, startDate: 1 });

module.exports = mongoose.model('Event', EventSchema);