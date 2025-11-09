const mongoose = require('mongoose');

const MediaImageSchema = new mongoose.Schema({
  data: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  mimeType: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 0
  }
}, {
  _id: false
});

const MediaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  images: {
    type: [MediaImageSchema],
    validate: {
      validator: (value) => Array.isArray(value) && value.length > 0,
      message: 'At least one image is required'
    }
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

MediaSchema.virtual('imageCount').get(function() {
  return Array.isArray(this.images) ? this.images.length : 0;
});

MediaSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Media', MediaSchema);
