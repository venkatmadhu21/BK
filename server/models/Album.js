const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
  // Album belongs to either an Event or News
  type: {
    type: String,
    enum: ['Event', 'News'],
    required: true
  },
  
  // Reference to the Event or News item
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'type'
  },
  
  // Album metadata
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  description: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  
  // Photos in the album
  photos: [{
    url: {
      type: String,
      required: true
    },
    thumbnail: String,
    caption: String,
    tags: [String],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Album tags (for filtering)
  tags: [String],
  
  // Year of the event/news (for filtering)
  year: {
    type: Number,
    required: true
  },
  
  // Creator of the album
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Album visibility
  isPublic: {
    type: Boolean,
    default: true
  },
  
  // Cover image (thumbnail for album display)
  coverImage: {
    url: String,
    thumbnail: String
  },
  
  // Metadata
  photoCount: {
    type: Number,
    default: 0
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
AlbumSchema.index({ type: 1, itemId: 1 });
AlbumSchema.index({ year: 1 });
AlbumSchema.index({ tags: 1 });
AlbumSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Album', AlbumSchema);