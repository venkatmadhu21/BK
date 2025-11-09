const express = require('express');
const { body, validationResult } = require('express-validator');
const Media = require('../models/Media');
const auth = require('../middleware/auth');

const router = express.Router();

const MAX_IMAGES_PER_UPLOAD = 50;
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

const validateImagesArray = body('images')
  .isArray({ min: 1 })
  .withMessage('At least one image is required')
  .custom((images) => {
    if (images.length > MAX_IMAGES_PER_UPLOAD) {
      throw new Error(`A maximum of ${MAX_IMAGES_PER_UPLOAD} images can be uploaded at once`);
    }
    const invalid = images.some((image) => {
      if (!image || typeof image !== 'object') {
        return true;
      }
      if (typeof image.data !== 'string' || image.data.trim().length === 0) {
        return true;
      }
      const isBase64 = /^data:image\/(png|jpe?g|gif|webp);base64,/.test(image.data);
      if (!isBase64) {
        return true;
      }
      if (image.size && Number(image.size) > MAX_IMAGE_SIZE_BYTES) {
        return true;
      }
      return false;
    });
    if (invalid) {
      throw new Error('Each image must include a valid base64 data URI (PNG, JPG, GIF, or WEBP) and be 10MB or smaller');
    }
    return true;
  });

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 50));

    const [mediaItems, total] = await Promise.all([
      Media.find()
        .populate('uploadedBy', 'firstName lastName profilePicture')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Media.estimatedDocumentCount()
    ]);

    res.json({
      media: mediaItems,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum
    });
  } catch (error) {
    console.error('Failed to fetch media items', error);
    res.status(500).json({ message: 'Failed to fetch media items' });
  }
});

router.post(
  '/',
  [
    auth,
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 120 }),
    body('description').optional().isString().isLength({ max: 500 }),
    validateImagesArray,
    body('images.*.name').optional().isString().isLength({ max: 200 }),
    body('images.*.mimeType').optional().isString().isLength({ max: 100 }),
    body('images.*.size').optional().isNumeric()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description = '', images } = req.body;

      const sanitizedImages = images.map((image) => ({
        data: image.data,
        name: image.name || '',
        mimeType: image.mimeType || '',
        size: image.size || 0
      }));

      const media = new Media({
        title: title.trim(),
        description: description.trim(),
        images: sanitizedImages,
        uploadedBy: req.user.id
      });

      await media.save();

      const populatedMedia = await Media.findById(media._id)
        .populate('uploadedBy', 'firstName lastName profilePicture')
        .lean();

      res.status(201).json(populatedMedia);
    } catch (error) {
      console.error('Failed to create media item', error);
      res.status(500).json({ message: 'Failed to create media item' });
    }
  }
);

module.exports = router;
