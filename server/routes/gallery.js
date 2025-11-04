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
    const {
      type = 'all',
      year = 'all',
      tags = '',
      page = 1,
      limit = 20,
      search = '',
      sortBy = 'uploadedAt',
      sortOrder = 'desc',
      uploader = ''
    } = req.query;

    const numericLimit = Math.max(1, Math.min(parseInt(limit, 10) || 20, 200));
    const numericPage = Math.max(1, parseInt(page, 10) || 1);

    const query = { isPublic: true };

    if (type && type !== 'all') {
      query.type = type;
    }

    if (year && year !== 'all') {
      const parsedYear = parseInt(year, 10);
      if (!Number.isNaN(parsedYear)) {
        query.year = parsedYear;
      }
    }

    if (tags) {
      const tagArray = tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
      if (tagArray.length) {
        query.tags = { $in: tagArray };
      }
    }

    const albums = await Album.find(query)
      .populate('createdBy', 'firstName lastName profilePicture')
      .populate({
        path: 'photos.uploadedBy',
        select: 'firstName lastName profilePicture'
      })
      .populate('itemId')
      .sort({ createdAt: -1 });

    const allPhotos = [];
    albums.forEach(album => {
      album.photos.forEach(photo => {
        const photoData = photo.toObject();
        allPhotos.push({
          ...photoData,
          albumId: album._id,
          albumTitle: album.title,
          itemType: album.type,
          itemTitle: album.itemId?.title || album.itemId?.name || 'Unknown',
          year: album.year,
          createdBy: album.createdBy,
          albumCreatedAt: album.createdAt
        });
      });
    });

    const searchTerm = search.trim();
    let filteredPhotos = allPhotos;

    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      filteredPhotos = filteredPhotos.filter(photo => {
        const uploaderName = photo.uploadedBy
          ? `${photo.uploadedBy.firstName || ''} ${photo.uploadedBy.lastName || ''}`.trim()
          : '';
        const creatorName = photo.createdBy
          ? `${photo.createdBy.firstName || ''} ${photo.createdBy.lastName || ''}`.trim()
          : '';
        const tagLine = Array.isArray(photo.tags) ? photo.tags.join(' ') : '';
        return (
          regex.test(photo.albumTitle || '') ||
          regex.test(photo.itemTitle || '') ||
          regex.test(photo.caption || '') ||
          regex.test(uploaderName) ||
          regex.test(creatorName) ||
          regex.test(tagLine)
        );
      });
    }

    if (uploader && uploader !== 'all') {
      const uploaderIds = uploader
        .split(',')
        .map(id => id.trim())
        .filter(Boolean);
      if (uploaderIds.length) {
        filteredPhotos = filteredPhotos.filter(photo => {
          if (!photo.uploadedBy) {
            return false;
          }
          const photoUploaderId = photo.uploadedBy._id?.toString();
          return photoUploaderId && uploaderIds.includes(photoUploaderId);
        });
      }
    }

    const orderModifier = sortOrder === 'asc' ? 1 : -1;
    filteredPhotos.sort((a, b) => {
      const getComparable = (value) => {
        if (value instanceof Date) {
          return value.getTime();
        }
        if (typeof value === 'string') {
          return value.toLowerCase();
        }
        return value ?? 0;
      };

      let aValue;
      let bValue;

      switch (sortBy) {
        case 'albumTitle':
          aValue = a.albumTitle || '';
          bValue = b.albumTitle || '';
          break;
        case 'itemTitle':
          aValue = a.itemTitle || '';
          bValue = b.itemTitle || '';
          break;
        case 'year':
          aValue = a.year || 0;
          bValue = b.year || 0;
          break;
        case 'albumCreatedAt':
          aValue = a.albumCreatedAt || a.uploadedAt || 0;
          bValue = b.albumCreatedAt || b.uploadedAt || 0;
          break;
        case 'uploadedAt':
        default:
          aValue = a.uploadedAt || a.albumCreatedAt || 0;
          bValue = b.uploadedAt || b.albumCreatedAt || 0;
          break;
      }

      const left = getComparable(aValue);
      const right = getComparable(bValue);

      if (typeof left === 'string' && typeof right === 'string') {
        if (left === right) {
          return 0;
        }
        return left < right ? -1 * orderModifier : 1 * orderModifier;
      }

      return (left - right) * orderModifier;
    });

    const total = filteredPhotos.length;
    const startIndex = (numericPage - 1) * numericLimit;
    const paginatedPhotos = filteredPhotos.slice(startIndex, startIndex + numericLimit);

    res.json({
      photos: paginatedPhotos,
      totalPages: Math.ceil(total / numericLimit) || 1,
      currentPage: numericPage,
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
    const albums = await Album.find({ isPublic: true })
      .select('tags photos')
      .populate('photos.uploadedBy', 'firstName lastName');
    const tagsSet = new Set();
    const uploaderMap = new Map();
    albums.forEach(album => {
      album.tags.forEach(tag => tagsSet.add(tag));
      album.photos.forEach(photo => {
        if (photo.uploadedBy) {
          const uploaderId = photo.uploadedBy._id.toString();
          if (!uploaderMap.has(uploaderId)) {
            const name = `${photo.uploadedBy.firstName || ''} ${photo.uploadedBy.lastName || ''}`.trim() || 'Unknown';
            uploaderMap.set(uploaderId, {
              id: uploaderId,
              name
            });
          }
        }
      });
    });
    const tags = Array.from(tagsSet);
    const uploaders = Array.from(uploaderMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    
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
      uploaders,
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