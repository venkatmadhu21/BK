import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Newspaper, 
  Search, 
  Filter, 
  Plus, 
  Heart, 
  MessageCircle, 
  Eye,
  Clock,
  User,
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  Loader2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import Scroller from '../components/Scroller';

const CreateNewsModal = ({
  formData,
  isSubmitting,
  onClose,
  onSubmit,
  onChange,
  onImageUpload,
  onRemoveImage,
  categoryOptions = [],
  priorityOptions = ['Low', 'Medium', 'High', 'Urgent']
}) => {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-[9999]" onClick={onClose} style={{ paddingTop: '80px' }}>
      <div className="bg-white w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Create News Article</h2>
            <p className="text-sm text-gray-500">Share the latest updates and stories with the family.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close create news modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={onChange}
                placeholder="Enter news title"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {categoryOptions
                  .filter((category) => category.value !== 'all')
                  .map((category) => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <div className="flex gap-2">
                {priorityOptions?.map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => onChange({ target: { name: 'priority', value: priority } })}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-all ${
                      formData.priority === priority
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-300 hover:border-orange-400'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Publish Status</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ target: { name: 'isPublished', value: true } })}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-all ${
                    formData.isPublished === true
                      ? 'border-green-500 bg-green-50 text-green-600'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  Publish Now
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ target: { name: 'isPublished', value: false } })}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-all ${
                    formData.isPublished === false
                      ? 'border-gray-500 bg-gray-50 text-gray-600'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Save Draft
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Summary</label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={onChange}
              placeholder="Brief summary of the news article"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={onChange}
              placeholder="Write the full news article content"
              rows={6}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={onChange}
              placeholder="Enter tags separated by commas (e.g., family, celebration, milestone)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <p className="text-xs text-gray-500">Tags help categorize and search for news articles</p>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Article Images</h3>
              <p className="text-xs text-gray-500">Upload images for the news article. The first image will be used as thumbnail.</p>
            </div>

            <div className="space-y-4">
              {/* Image Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/*"
                  onChange={onImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload size={32} className="text-gray-400" />
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-orange-600 hover:text-orange-700">Click to upload</span> or drag and drop
                  </div>
                  <div className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</div>
                </label>
              </div>

              {/* Preview Images */}
              {formData.images && Array.isArray(formData.images) && formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={image.thumbnail || image.url}
                          alt={`News image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => onRemoveImage(index)}
                          className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                          Thumbnail
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {formData.isPublished ? 'Publishing...' : 'Saving...'}
                </>
              ) : (
                formData.isPublished ? 'Publish News' : 'Save Draft'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const News = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNews, setSelectedNews] = useState(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const newsRef = useRef(null);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'General', label: 'General' },
    { value: 'Announcement', label: 'Announcement' },
    { value: 'Achievement', label: 'Achievement' },
    { value: 'Milestone', label: 'Milestone' },
    { value: 'Memorial', label: 'Memorial' },
    { value: 'Celebration', label: 'Celebration' }
  ];

  const priorityOptions = ['Low', 'Medium', 'High', 'Urgent'];

  const createInitialFormState = () => ({
    title: '',
    content: '',
    summary: '',
    category: 'General',
    priority: 'Medium',
    tags: '',
    isPublished: false,
    images: []
  });

  const [formData, setFormData] = useState(createInitialFormState());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData(createInitialFormState());
  };

  const closeCreateModal = () => {
    if (!isSubmitting) {
      setCreateModalOpen(false);
      resetForm();
    }
  };

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
    }));
  };

  // Image handling functions
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        addToast(`File ${file.name} is too large. Maximum size is 10MB.`, 'error');
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    try {
      const imagePromises = validFiles.map(file => convertToBase64(file));
      const base64Images = await Promise.all(imagePromises);
      
      const thumbnailPromises = base64Images.map(base64 => createThumbnail(base64));
      const thumbnails = await Promise.all(thumbnailPromises);
      
      const newImages = base64Images.map((base64, index) => ({
        url: base64,
        thumbnail: thumbnails[index],
        caption: validFiles[index].name
      }));

      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newImages]
      }));
    } catch (error) {
      addToast('Error processing images', 'error');
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const createThumbnail = (
    base64,
    { width: targetWidth = 600, height: targetHeight = 400 } = {}
  ) => {
    return new Promise((resolve) => {
      const image = new Image();

      image.onload = () => {
        const sourceWidth = image.width;
        const sourceHeight = image.height;

        if (!sourceWidth || !sourceHeight) {
          resolve(base64);
          return;
        }

        // Calculate cropping for center square or target ratio while avoiding distortion
        const targetRatio = targetWidth / targetHeight;
        const sourceRatio = sourceWidth / sourceHeight;

        let cropWidth = sourceWidth;
        let cropHeight = sourceHeight;

        if (sourceRatio > targetRatio) {
          // Source wider than target ratio - crop width
          cropWidth = sourceHeight * targetRatio;
        } else if (sourceRatio < targetRatio) {
          // Source taller than target ratio - crop height
          cropHeight = sourceWidth / targetRatio;
        }

        const cropX = (sourceWidth - cropWidth) / 2;
        const cropY = (sourceHeight - cropHeight) / 2;

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const context = canvas.getContext('2d');
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        // Draw cropped portion into target canvas to maintain sharpness
        context.drawImage(
          image,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          targetWidth,
          targetHeight
        );

        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };

      image.onerror = () => resolve(base64);
      image.src = base64;
    });
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, idx) => idx !== index)
    }));
  };

  const handleCreateNews = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const tagsArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    const payload = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      summary: formData.summary.trim(),
      category: formData.category,
      priority: formData.priority,
      tags: tagsArray,
      images: Array.isArray(formData.images) ? formData.images : [],
      isPublished: formData.isPublished
    };

    try {
      const response = await api.post('/api/news', payload);
      setNewsData((prev) => [response.data, ...prev]);
      addToast(formData.isPublished ? 'News published successfully' : 'News saved as draft', 'success');
      closeCreateModal();
      setSelectedNews(response.data);
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create news';
      addToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchNews = async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 50
      };

      if (filters.category && filters.category !== 'all') {
        params.category = filters.category;
      }

      const response = await api.get('/api/news', { params });
      setNewsData(response.data.news || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load news';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    fetchNews({ category: selectedCategory });
  };

  useEffect(() => {
    (async () => {
      await fetchNews({ category: selectedCategory });
      const newsId = location.state?.newsId;
      if (!newsId) {
        return;
      }
      try {
        const response = await api.get(`/api/news/${newsId}`);
        if (response.data) {
          setSelectedNews(response.data);
        }
      } catch (err) {
        const message = err.response?.data?.message || 'Unable to load selected news';
        addToast(message, 'error');
      }
    })();
  }, [addToast, location.state?.newsId]);

  // Fetch upcoming events for scroller
  useEffect(() => {
    const fetchUpcomingEventsData = async () => {
      setLoadingEvents(true);
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await api.get('/api/events', {
          params: {
            status: 'Upcoming',
            limit: 10,
            sortBy: 'startDate',
            sortOrder: 'asc'
          }
        });
        
        // Filter to only show events with startDate > today
        const upcoming = (response.data.events || [])
          .filter(event => {
            const eventDate = new Date(event.startDate).toISOString().split('T')[0];
            return eventDate > today;
          })
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
          .slice(0, 10);
        
        setUpcomingEvents(upcoming);
      } catch (err) {
        console.error('Failed to fetch upcoming events:', err);
        setUpcomingEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchUpcomingEventsData();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      applyFilters();
    }, 300);
    return () => clearTimeout(handler);
  }, [selectedCategory]);

  const getAuthorName = (author) => {
    if (!author) return 'Unknown Author';
    const fullName = [author.firstName, author.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();
    if (fullName) return fullName;
    if (author.name) return author.name;
    return 'Unknown Author';
  };

  const filteredNews = newsData.filter(news => {
    const authorName = getAuthorName(news.author).toLowerCase();
    const matchesSearch = news.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         authorName.includes(searchTerm.toLowerCase().trim());
    const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (newsRef.current) {
      observer.observe(newsRef.current);
    }

    return () => {
      if (newsRef.current) {
        observer.unobserve(newsRef.current);
      }
    };
  }, []);


  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (newsRef.current) {
      observer.observe(newsRef.current);
    }

    return () => {
      if (newsRef.current) {
        observer.unobserve(newsRef.current);
      }
    };
  }, []);

  const NewsCard = ({ news }) => (
    <div className="heritage-card modern-card rounded-2xl p-6 h-full flex flex-col">
      {/* Badge Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="gradient-badge px-3 py-1 rounded-full text-xs font-semibold">
            {news.category}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            news.priority === 'High' ? 'priority-badge' :
            news.priority === 'Medium' ? 'medium-priority-badge' :
            'low-priority-badge'
          }`}>
            {news.priority} Priority
          </span>
        </div>
      </div>

      {/* Title Section */}
      <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight flex-grow">
        {news.title}
      </h2>
      
      {/* Summary Section */}
      <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
        {news.summary}
      </p>

      {/* Author and Date Section */}
      <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
            <User size={14} className="text-orange-600" />
          </div>
          <span className="font-medium">{getAuthorName(news.author)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{formatDate(news.publishDate)}</span>
        </div>
      </div>

      {/* Tags Section */}
      {news.tags && news.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {news.tags.map((tag, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-orange-100 hover:text-orange-700 transition-all duration-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Section */}
      <div className="mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-all duration-300">
              <Heart size={16} />
              <span className="text-sm font-medium">{Array.isArray(news.likes) ? news.likes.length : Number.isFinite(news.likes) ? news.likes : 0}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-all duration-300">
              <MessageCircle size={16} />
              <span className="text-sm font-medium">{Array.isArray(news.comments) ? news.comments.length : Number.isFinite(news.comments) ? news.comments : 0}</span>
            </button>
            <div className="flex items-center gap-1 text-gray-500">
              <Eye size={16} />
              <span className="text-sm font-medium">{Number.isFinite(news.views) ? news.views : 0}</span>
            </div>
          </div>
          <button 
            onClick={() => setSelectedNews(news)}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold text-sm hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );

  const NewsModal = ({ news, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]" style={{ paddingTop: '80px' }}>
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[85vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{news.title}</h1>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={16} />
              </div>
              <span>By {getAuthorName(news.author)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{formatDate(news.publishDate)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye size={14} />
              <span>{news.views} views</span>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {Array.isArray(news.images) && news.images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Images</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {news.images.map((image, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={image.url || image.thumbnail}
                      alt={image.caption || `News image ${index + 1}`}
                      className="w-full h-64 object-cover"
                    />
                    {image.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm px-3 py-2">
                        {image.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{news.content}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Custom CSS for enhanced animations and modern design */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.3); }
          50% { box-shadow: 0 0 30px rgba(249, 115, 22, 0.6), 0 0 40px rgba(249, 115, 22, 0.4); }
        }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        .glow-effect {
          animation: glow 2s ease-in-out infinite alternate;
        }
        
        .modern-card {
          background: linear-gradient(145deg, #ffffff 0%, #fefefe 100%);
          border: 1px solid rgba(249, 115, 22, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .modern-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(249, 115, 22, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1);
          border-color: rgba(249, 115, 22, 0.2);
        }
        
        .gradient-badge {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .priority-badge {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .medium-priority-badge {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .low-priority-badge {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .floating-action-btn {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .floating-action-btn:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 12px 35px rgba(249, 115, 22, 0.4);
        }
        
        .filter-bar {
          background: linear-gradient(145deg, #ffffff 0%, #fefefe 100%);
          border: 1px solid rgba(249, 115, 22, 0.15);
          box-shadow: 0 4px 15px rgba(249, 115, 22, 0.08);
        }
        
        .pattern-bg {
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(249, 115, 22, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(249, 115, 22, 0.03) 0%, transparent 50%);
          background-size: 100px 100px;
        }
      `}</style>
      
      <div className="heritage-bg min-h-screen" ref={newsRef}>
        <div className="heritage-gradient-overlay"></div>
        <div className="heritage-decoration"></div>
        <div className="heritage-decoration"></div>
        <div className="heritage-decoration"></div>
        <div className="heritage-decoration"></div>
        <div className="heritage-content">
        
        {/* Show combined scroller for news and events - Sticky at top */}
        {(newsData.length > 0 || upcomingEvents.length > 0) && (
          <div className="sticky top-16 z-40 w-full">
            <Scroller 
              newsItems={newsData.slice(0, 5)}
              eventItems={upcomingEvents.slice(0, 5)}
            />
          </div>
        )}
        
        {/* Floating Action Button */}
        <button 
          onClick={() => setCreateModalOpen(true)}
          className="floating-action-btn flex items-center px-6 py-3 text-white rounded-full font-semibold text-sm shadow-lg"
        >
          <Plus size={20} className="mr-2" />
          <span className="hidden sm:inline">Create News</span>
        </button>

        {/* Modern Header Section */}
        <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
          <div className={`max-w-7xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 space-y-4 sm:space-y-0">
              <div className="text-center sm:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                  <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-700 bg-clip-text text-transparent">
                    Family News
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl leading-relaxed">
                  Stay connected with the latest updates, announcements, and stories from our family
                </p>
              </div>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 text-sm hover:scale-105 hover:shadow-lg"
              >
                <Plus size={16} className="mr-2" />
                Create News
              </button>
            </div>

            {/* Modern Combined Filter Bar */}
            <div className="heritage-card filter-bar rounded-2xl p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search news articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-base border-0 rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all duration-300 placeholder-gray-400"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter size={20} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Filter by:</span>
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-4 text-base border-0 rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all duration-300 text-gray-700 font-medium"
                  >
                    {categoryOptions.map(category => (
                      <option key={category.value} value={category.value}>{category.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern News Grid */}
        <div className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {filteredNews.map((news, index) => (
                <div 
                  key={news._id || news.id || `news-${index}`}
                  className="transition-all duration-500"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: isVisible ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                  }}
                >
                  <NewsCard news={news} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {filteredNews.length === 0 && (
          <div className="px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-7xl mx-auto">
              <div className="heritage-card modern-card rounded-2xl p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Newspaper size={32} className="text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No news found</h3>
                <p className="text-lg text-gray-600 mb-6">Try adjusting your search criteria or filters to find what you're looking for.</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* News Modal */}
        {selectedNews && (
          <NewsModal 
            news={selectedNews} 
            onClose={() => setSelectedNews(null)} 
          />
        )}

        {/* Create News Modal */}
        {isCreateModalOpen && (
          <CreateNewsModal
            formData={formData}
            isSubmitting={isSubmitting}
            onClose={closeCreateModal}
            onSubmit={handleCreateNews}
            onChange={handleChange}
            onImageUpload={handleImageUpload}
            onRemoveImage={handleRemoveImage}
            categoryOptions={categoryOptions}
            priorityOptions={priorityOptions}
          />
        )}
        </div>
      </div>
    </>
  );
};

export default News;