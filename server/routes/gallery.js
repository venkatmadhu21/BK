const express = require('express');
const Album = require('../models/Album');
const Event = require('../models/Event');
const News = require('../models/News');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// ============ GALLERY ENDPOINTS ============

// @route   GET api/gallery
// @desc    Get all photos with filters (type, year, tags, search)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { type = 'all', year = 'all', tags = '', page = 1, limit = 20 } = req.query;
    
    const query = { isPublic: true };
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (year && year !== 'all') {
      query.year = parseInt(year);
    }
    
    // Filter by tags (can be comma-separated)
    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim());
      query.tags = { $in: tagArray };
    }
    
    const albums = await Album.find(query)
      .populate('createdBy', 'firstName lastName profilePicture')
      .populate('itemId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    // Flatten photos from all albums
    const allPhotos = [];
    albums.forEach(album => {
      album.photos.forEach(photo => {
        allPhotos.push({
          ...photo.toObject(),
          albumId: album._id,
          albumTitle: album.title,
          itemType: album.type,
          itemTitle: album.itemId?.title || 'Unknown',
          year: album.year,
          createdBy: album.createdBy
        });
      });
    });
    
    const total = await Album.countDocuments(query);
    
    res.json({
      photos: allPhotos,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/gallery/stats
// @desc    Get gallery statistics (years, tags, counts)
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    // Get available years
    const years = await Album.distinct('year', { isPublic: true });
    
    // Get all tags
    const albums = await Album.find({ isPublic: true }, 'tags');
    const tagsSet = new Set();
    albums.forEach(album => {
      album.tags.forEach(tag => tagsSet.add(tag));
    });
    const tags = Array.from(tagsSet);
    
    // Get counts by type
    const eventCount = await Album.countDocuments({ type: 'Event', isPublic: true });
    const newsCount = await Album.countDocuments({ type: 'News', isPublic: true });
    const totalPhotos = await Album.aggregate([
      { $match: { isPublic: true } },
      { $group: { _id: null, total: { $sum: '$photoCount' } } }
    ]);
    
    res.json({
      years: years.sort((a, b) => b - a),
      tags: tags.sort(),
      counts: {
        events: eventCount,
        news: newsCount,
        totalPhotos: totalPhotos[0]?.total || 0
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// ============ ALBUM ENDPOINTS ============

// @route   GET api/gallery/albums/item/:type/:itemId
// @desc    Get album for a specific event or news
// @access  Private
router.get('/albums/item/:type/:itemId', auth, async (req, res) => {
  try {
    const { type, itemId } = req.params;
    
    if (!['Event', 'News'].includes(type)) {
      return res.status(400).json({ message: 'Invalid type' });
    }
    
    let album = await Album.findOne({ type, itemId })
      .populate('createdBy', 'firstName lastName profilePicture')
      .populate('photos.uploadedBy', 'firstName lastName profilePicture')
      .populate('itemId');
    
    if (!album) {
      // Return empty album structure if it doesn't exist yet
      return res.json(null);
    }
    
    res.json(album);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/gallery/albums
// @desc    Create or get album for event/news
// @access  Private
router.post('/albums', [
  auth,
  body('type', 'Type must be Event or News').isIn(['Event', 'News']),
  body('itemId', 'Item ID is required').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { type, itemId } = req.body;
    
    // Check if item exists
    const Model = type === 'Event' ? Event : News;
    const item = await Model.findById(itemId);
    
    if (!item) {
      return res.status(404).json({ message: `${type} not found` });
    }
    
    // Get year from item
    const year = type === 'Event' 
      ? new Date(item.startDate).getFullYear()
      : new Date(item.publishDate).getFullYear();
    
    // Check if album exists
    let album = await Album.findOne({ type, itemId });
    
    if (!album) {
      // Create new album
      album = new Album({
        type,
        itemId,
        title: item.title,
        description: item.description || item.content || '',
        tags: type === 'News' ? item.tags : [],
        year,
        createdBy: req.user.id,
        isPublic: type === 'Event' ? item.isPublic : item.isPublished
      });
      
      await album.save();
    }
    
    const populatedAlbum = await Album.findById(album._id)
      .populate('createdBy', 'firstName lastName profilePicture')
      .populate('photos.uploadedBy', 'firstName lastName profilePicture')
      .populate('itemId');
    
    res.json(populatedAlbum);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/gallery/albums/:albumId/photos
// @desc    Add photo to album
// @access  Private
router.post('/albums/:albumId/photos', [
  auth,
  body('url', 'Photo URL is required').notEmpty(),
  body('caption', 'Caption is optional').optional()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { url, thumbnail, caption, tags = [] } = req.body;
    const album = await Album.findById(req.params.albumId);
    
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }
    
    // Check authorization - creator or admin can add photos
    if (album.createdBy.toString() !== req.user.id && !req.user.isAdmin) {
      // Check if user is the organizer/author of the event/news
      if (album.type === 'Event') {
        const event = await Event.findById(album.itemId);
        if (event.organizer.toString() !== req.user.id) {
          return res.status(401).json({ message: 'Not authorized to add photos' });
        }
      } else {
        const news = await News.findById(album.itemId);
        if (news.author.toString() !== req.user.id) {
          return res.status(401).json({ message: 'Not authorized to add photos' });
        }
      }
    }
    
    const newPhoto = {
      url,
      thumbnail: thumbnail || url,
      caption: caption || '',
      tags: Array.isArray(tags) ? tags : [],
      uploadedBy: req.user.id
    };
    
    album.photos.push(newPhoto);
    album.photoCount = album.photos.length;
    
    // Set cover image if it's the first photo
    if (album.photos.length === 1) {
      album.coverImage = {
        url: url,
        thumbnail: thumbnail || url
      };
    }
    
    // Update album tags
    const allTags = new Set(album.tags);
    tags.forEach(tag => allTags.add(tag));
    album.tags = Array.from(allTags);
    
    await album.save();
    
    const populatedAlbum = await Album.findById(album._id)
      .populate('createdBy', 'firstName lastName profilePicture')
      .populate('photos.uploadedBy', 'firstName lastName profilePicture')
      .populate('itemId');
    
    res.json(populatedAlbum);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/gallery/albums/:albumId/photos/:photoId
// @desc    Update photo info
// @access  Private
router.put('/albums/:albumId/photos/:photoId', auth, async (req, res) => {
  try {
    const { caption, tags } = req.body;
    const album = await Album.findById(req.params.albumId);
    
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }
    
    const photoIndex = album.photos.findIndex(p => p._id.toString() === req.params.photoId);
    
    if (photoIndex === -1) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    
    // Check authorization - photo uploader or admin
    if (album.photos[photoIndex].uploadedBy.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (caption !== undefined) {
      album.photos[photoIndex].caption = caption;
    }
    
    if (tags !== undefined) {
      album.photos[photoIndex].tags = Array.isArray(tags) ? tags : [];
      
      // Update album tags
      const allTags = new Set(album.tags);
      album.photos.forEach(photo => {
        photo.tags.forEach(tag => allTags.add(tag));
      });
      album.tags = Array.from(allTags);
    }
    
    await album.save();
    
    const populatedAlbum = await Album.findById(album._id)
      .populate('createdBy', 'firstName lastName profilePicture')
      .populate('photos.uploadedBy', 'firstName lastName profilePicture')
      .populate('itemId');
    
    res.json(populatedAlbum);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/gallery/albums/:albumId/photos/:photoId
// @desc    Delete photo from album
// @access  Private
router.delete('/albums/:albumId/photos/:photoId', auth, async (req, res) => {
  try {
    const album = await Album.findById(req.params.albumId);
    
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }
    
    const photoIndex = album.photos.findIndex(p => p._id.toString() === req.params.photoId);
    
    if (photoIndex === -1) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    
    // Check authorization - photo uploader or admin
    if (album.photos[photoIndex].uploadedBy.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    album.photos.splice(photoIndex, 1);
    album.photoCount = album.photos.length;
    
    // Update cover image if deleted was cover
    if (album.coverImage && album.photos.length > 0) {
      const isDeletedCover = album.photos.some(p => 
        p.url === album.coverImage.url && p._id.toString() === req.params.photoId
      );
      if (isDeletedCover) {
        const firstPhoto = album.photos[0];
        album.coverImage = {
          url: firstPhoto.url,
          thumbnail: firstPhoto.thumbnail
        };
      }
    }
    
    await album.save();
    
    const populatedAlbum = await Album.findById(album._id)
      .populate('createdBy', 'firstName lastName profilePicture')
      .populate('photos.uploadedBy', 'firstName lastName profilePicture')
      .populate('itemId');
    
    res.json(populatedAlbum);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/gallery/albums/:albumId
// @desc    Delete entire album
// @access  Private
router.delete('/albums/:albumId', auth, async (req, res) => {
  try {
    const album = await Album.findById(req.params.albumId);
    
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }
    
    // Check authorization - creator or admin
    if (album.createdBy.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized to delete album' });
    }
    
    await Album.findByIdAndDelete(req.params.albumId);
    
    res.json({ message: 'Album deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;