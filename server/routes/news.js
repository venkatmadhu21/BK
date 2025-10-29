const express = require('express');
const News = require('../models/News');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @route   GET api/news
// @desc    Get all published news
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
    const query = { isPublished: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }

    const news = await News.find(query)
      .populate('author', 'firstName lastName profilePicture')
      .sort({ priority: -1, publishDate: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .lean();

    const total = await News.countDocuments(query);

    res.json({
      news,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total
    });
  } catch (error) {
    console.error('News fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch news', error: error.message });
  }
});

// @route   GET api/news/:id
// @desc    Get news by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
      .populate('author', 'firstName lastName profilePicture')
      .populate('likes.user', 'firstName lastName')
      .populate('comments.user', 'firstName lastName profilePicture');

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Increment views
    news.views += 1;
    await news.save();

    res.json(news);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'News not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/news
// @desc    Create news
// @access  Private (Admin only)
router.post('/', [
  auth,
  body('title', 'Title is required').notEmpty(),
  body('content', 'Content is required').notEmpty(),
  body('category', 'Category is required').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      title,
      content,
      summary,
      category,
      images,
      priority,
      tags,
      isPublished
    } = req.body;

    const news = new News({
      title,
      content,
      summary,
      author: req.user.id,
      category,
      images,
      priority,
      tags,
      isPublished: isPublished || false,
      publishDate: isPublished ? new Date() : null
    });

    await news.save();

    const populatedNews = await News.findById(news._id)
      .populate('author', 'firstName lastName profilePicture');

    res.json(populatedNews);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/news/:id
// @desc    Update news
// @access  Private (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { isPublished, ...updateData } = req.body;
    
    if (isPublished && !req.body.publishDate) {
      updateData.publishDate = new Date();
    }
    
    updateData.isPublished = isPublished;

    const news = await News.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).populate('author', 'firstName lastName profilePicture');

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json(news);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/news/:id
// @desc    Delete news
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    await News.findByIdAndDelete(req.params.id);

    res.json({ message: 'News deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/news/:id/like
// @desc    Like/Unlike news
// @access  Private
router.put('/:id/like', auth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    const likeIndex = news.likes.findIndex(like => 
      like.user.toString() === req.user.id
    );

    if (likeIndex > -1) {
      // Unlike
      news.likes.splice(likeIndex, 1);
    } else {
      // Like
      news.likes.unshift({ user: req.user.id });
    }

    await news.save();

    res.json(news.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/news/:id/comment
// @desc    Add comment to news
// @access  Private
router.post('/:id/comment', [
  auth,
  body('text', 'Comment text is required').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    const newComment = {
      user: req.user.id,
      text: req.body.text
    };

    news.comments.unshift(newComment);
    await news.save();

    const populatedNews = await News.findById(req.params.id)
      .populate('comments.user', 'firstName lastName profilePicture');

    res.json(populatedNews.comments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/news/:id/comment/:comment_id
// @desc    Delete comment
// @access  Private
router.delete('/:id/comment/:comment_id', auth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    const comment = news.comments.find(comment => 
      comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns comment or is admin
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    news.comments = news.comments.filter(comment => 
      comment.id !== req.params.comment_id
    );

    await news.save();

    res.json(news.comments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;