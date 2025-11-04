import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Clock, 
  Users,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  X,
  Upload,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import Scroller from '../components/Scroller';
import '../styles/heritage-background.css';

const CreateEventModal = ({
  formData,
  requirements,
  isSubmitting,
  onClose,
  onSubmit,
  onChange,
  onRequirementChange,
  onAddRequirement,
  onRemoveRequirement,
  onImageUpload,
  onRemoveImage,
  priorityOptions = ['Low', 'Medium', 'High'],
  visibilityOptions = [
    { value: true, label: 'Public' },
    { value: false, label: 'Private' }
  ],
  eventTypes = []
}) => {
  const handlePriorityChange = (priority) => {
    onChange({ target: { name: 'priority', value: priority } });
  };

  const handleVisibilityChange = (visibility) => {
    onChange({ target: { name: 'isPublic', value: visibility } });
  };

  const handleRequirementItemChange = (index, value) => {
    onRequirementChange(index, 'item', value);
  };

  const handleRequirementRequiredChange = (index, value) => {
    onRequirementChange(index, 'isRequired', value);
  };

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
      <div className="bg-white w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Create Event</h2>
            <p className="text-sm text-gray-500">Fill out the details below to create a new family event.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close create event modal"
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
                placeholder="Enter event name"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Event Type</label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {eventTypes
                  .filter((type) => type.value !== 'all')
                  .map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={onChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={onChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={onChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={onChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onChange}
                placeholder="Describe the event purpose, agenda, and other details"
                rows={4}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Venue Name</label>
              <input
                type="text"
                name="venueName"
                value={formData.venueName}
                onChange={onChange}
                placeholder="e.g. Community Hall"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Venue Street</label>
              <input
                type="text"
                name="venueStreet"
                value={formData.venueStreet}
                onChange={onChange}
                placeholder="Street address"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="venueCity"
                value={formData.venueCity}
                onChange={onChange}
                placeholder="City"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                name="venueState"
                value={formData.venueState}
                onChange={onChange}
                placeholder="State"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Pincode</label>
              <input
                type="text"
                name="venuePincode"
                value={formData.venuePincode}
                onChange={onChange}
                placeholder="Postal code"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                name="venueCountry"
                value={formData.venueCountry}
                onChange={onChange}
                placeholder="Country"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Event Images</h3>
              <p className="text-xs text-gray-500">Upload images for the event. The first image will be used as thumbnail.</p>
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
                          alt={`Event image ${index + 1}`}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <div className="flex gap-2">
                {priorityOptions?.map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => handlePriorityChange(priority)}
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
              <label className="block text-sm font-medium text-gray-700">Visibility</label>
              <div className="flex gap-2">
                {visibilityOptions?.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => onChange({ target: { name: 'isPublic', value: option.value } })}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-all ${
                      formData.isPublic === option.value
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-300 hover:border-orange-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
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
                  Saving...
                </>
              ) : (
                'Create Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Events = () => {
  const location = useLocation();
  const priorityOptions = ['Low', 'Medium', 'High'];
  const visibilityOptions = [
    { value: true, label: 'Public' },
    { value: false, label: 'Private' }
  ];
  const { t } = useLanguage();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = React.useState('all');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [viewMode, setViewMode] = React.useState('grid'); // 'grid' or 'calendar'
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const [isCreateModalOpen, setCreateModalOpen] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [eventsData, setEventsData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [latestNews, setLatestNews] = React.useState([]);
  const [loadingNews, setLoadingNews] = React.useState(false);
  const eventsRef = React.useRef(null);

  const eventTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'Birthday', label: 'Birthday' },
    { value: 'Anniversary', label: 'Anniversary' },
    { value: 'Wedding', label: 'Wedding' },
    { value: 'Festival', label: 'Festival' },
    { value: 'Reunion', label: 'Reunion' },
    { value: 'Memorial', label: 'Memorial' },
    { value: 'Cultural', label: 'Cultural' },
    { value: 'Religious', label: 'Religious' },
    { value: 'Meeting', label: 'Meeting' },
    { value: 'Other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'Upcoming', label: 'Upcoming' },
    { value: 'Ongoing', label: 'Ongoing' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  const fetchEvents = async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 50
      };

      if (filters.eventType && filters.eventType !== 'all') {
        params.eventType = filters.eventType;
      }
      if (filters.status && filters.status !== 'all') {
        params.status = filters.status;
      }
      if (filters.searchTerm) {
        params.search = filters.searchTerm;
      }

      const response = await api.get('/api/events', { params });
      setEventsData(response.data.events || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load events';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    fetchEvents({ eventType: selectedType, status: selectedStatus, searchTerm });
  };

  useEffect(() => {
    fetchEvents({ eventType: selectedType, status: selectedStatus, searchTerm });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      const eventId = location.state?.eventId;
      if (!eventId) {
        return;
      }
      try {
        const response = await api.get(`/api/events/${eventId}`);
        if (response.data) {
          setSelectedEvent(response.data);
        }
      } catch (err) {
        const message = err.response?.data?.message || 'Unable to load event details';
        addToast(message, 'error');
      }
    })();
  }, [addToast, location.state?.eventId]);

  // Fetch latest news for scroller
  useEffect(() => {
    const fetchLatestNews = async () => {
      setLoadingNews(true);
      try {
        const response = await api.get('/api/news', {
          params: {
            limit: 10,
            sortBy: 'publishedDate',
            sortOrder: 'desc'
          }
        });
        
        setLatestNews((response.data.news || []).slice(0, 10));
      } catch (err) {
        console.error('Failed to fetch latest news:', err);
        setLatestNews([]);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchLatestNews();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      // Debounce to avoid spamming the API while typing
      applyFilters();
    }, 300);

    return () => clearTimeout(handler);
  }, [selectedType, selectedStatus, searchTerm]);

  const filteredEvents = eventsData.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || event.eventType === selectedType;
    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;
    
    // For "Upcoming" status, also filter by date (only future events)
    let matchesDate = true;
    if (selectedStatus === 'Upcoming') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventDate = new Date(event.startDate);
      eventDate.setHours(0, 0, 0, 0);
      matchesDate = eventDate > today;
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Upcoming':
        return <Clock size={16} className="text-blue-500" />;
      case 'Ongoing':
        return <AlertCircle size={16} className="text-orange-500" />;
      case 'Completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'Cancelled':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const handleSelectEvent = (eventItem) => {
    setSelectedEvent(eventItem);
  };

  const createInitialFormState = () => ({
    title: '',
    description: '',
    eventType: 'Birthday',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    venueName: '',
    venueStreet: '',
    venueCity: '',
    venueState: '',
    venuePincode: '',
    venueCountry: 'India',
    images: [],
    priority: 'Medium',
    isPublic: true
  });

  const createEmptyRequirement = () => ({
    item: '',
    isRequired: false
  });

  const [formData, setFormData] = useState(createInitialFormState());
  const [requirements, setRequirements] = useState([createEmptyRequirement()]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData(createInitialFormState());
    setRequirements([createEmptyRequirement()]);
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

  const handleRequirementChange = (index, field, value) => {
    setRequirements((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addRequirementField = () => {
    setRequirements((prev) => [...prev, { item: '', isRequired: false }]);
  };

  const removeRequirementField = (index) => {
    setRequirements((prev) => prev.filter((_, idx) => idx !== index));
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

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      eventType: formData.eventType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      venue: {
        name: formData.venueName.trim(),
        address: {
          street: formData.venueStreet.trim(),
          city: formData.venueCity.trim(),
          state: formData.venueState.trim(),
          pincode: formData.venuePincode.trim(),
          country: formData.venueCountry.trim() || 'India'
        }
      },
      images: Array.isArray(formData.images) ? formData.images : [],
      priority: formData.priority,
      isPublic: formData.isPublic,
      requirements: requirements
        .filter((req) => req.item.trim())
        .map((req) => ({ item: req.item.trim(), isRequired: req.isRequired }))
    };

    try {
      const response = await api.post('/api/events', payload);
      // Add new event to the beginning of the list
      setEventsData((prev) => [response.data, ...prev]);
      addToast('Event created successfully', 'success');
      closeCreateModal();
      setSelectedEvent(response.data);
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create event';
      addToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
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

    if (eventsRef.current) {
      observer.observe(eventsRef.current);
    }

    return () => {
      if (eventsRef.current) {
        observer.unobserve(eventsRef.current);
      }
    };
  }, []);

  const EventCard = ({ event }) => (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 xs:p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
      {/* Enhanced Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-orange-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Event Image Thumbnail */}
      {event.images && Array.isArray(event.images) && event.images.length > 0 && (
        <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
          <img
            src={event.images[0].thumbnail || event.images[0].url}
            alt={event.title}
            className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
          />
        </div>
      )}
      
      <div className="relative z-10">
        <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between mb-3 xs:mb-4 space-y-2 xs:space-y-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 group-hover:scale-105 ${
              event.eventType === 'Festival' ? 'bg-purple-100 text-purple-800 group-hover:bg-purple-200' :
              event.eventType === 'Birthday' ? 'bg-pink-100 text-pink-800 group-hover:bg-pink-200' :
              event.eventType === 'Reunion' ? 'bg-blue-100 text-blue-800 group-hover:bg-blue-200' :
              event.eventType === 'Meeting' ? 'bg-gray-100 text-gray-800 group-hover:bg-gray-200' :
              'bg-green-100 text-green-800 group-hover:bg-green-200'
            }`}>
              {event.eventType}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 group-hover:scale-105 ${
              event.priority === 'High' ? 'bg-red-100 text-red-800 group-hover:bg-red-200' :
              event.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200' :
              'bg-blue-100 text-blue-800 group-hover:bg-blue-200'
            }`}>
              {event.priority} Priority
            </span>
          </div>
          {event.status && event.status !== 'Upcoming' && (
            <div className="flex items-center space-x-1 group-hover:scale-105 transition-transform duration-300">
              {getStatusIcon(event.status)}
              <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{event.status}</span>
            </div>
          )}
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-orange-600 cursor-pointer group-hover:scale-105 transition-all duration-300">
          {event.title}
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
          {event.description}
        </p>

        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2 group-hover:text-gray-700 transition-colors duration-300">
            <Calendar size={16} className="group-hover:text-orange-500 transition-colors duration-300" />
            <span>
              {formatDate(event.startDate)}
              {event.startDate !== event.endDate && ` - ${formatDate(event.endDate)}`}
            </span>
          </div>
          <div className="flex items-center space-x-2 group-hover:text-gray-700 transition-colors duration-300">
            <Clock size={16} className="group-hover:text-orange-500 transition-colors duration-300" />
            <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
          </div>
          <div className="flex items-center space-x-2 group-hover:text-gray-700 transition-colors duration-300">
            <MapPin size={16} className="group-hover:text-orange-500 transition-colors duration-300" />
            <span>{event.venue?.name || 'TBA'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
            Organized by {event.organizer?.firstName ? `${event.organizer.firstName} ${event.organizer.lastName || ''}`.trim() : 'Unknown'}
          </div>
          <button 
            onClick={() => handleSelectEvent(event)}
            className="text-orange-600 hover:text-orange-700 font-medium text-sm group-hover:scale-105 transition-all duration-300 hover:bg-orange-50 px-2 py-1 rounded-md"
            type="button"
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );

  const EventModal = ({ event, onClose }) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 xs:p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 xs:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl xs:text-2xl font-bold text-gray-900 pr-4">{event.title}</h1>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl xs:text-2xl flex-shrink-0"
              aria-label="Close event details"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex items-center space-x-4 mt-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              event.eventType === 'Festival' ? 'bg-purple-100 text-purple-800' :
              event.eventType === 'Birthday' ? 'bg-pink-100 text-pink-800' :
              event.eventType === 'Reunion' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {event.eventType}
            </span>
            <div className="flex items-center space-x-1">
              {getStatusIcon(event.status)}
              <span className="text-sm text-gray-600">{event.status}</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 xs:p-6">
          {/* Event Images */}
          {event.images && Array.isArray(event.images) && event.images.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {event.images.map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={image.thumbnail || image.url}
                      alt={image.caption || `Event image ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6 xs:space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <Calendar size={16} className="text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium">Date</div>
                    <div className="text-gray-600">
                      {formatDate(event.startDate)}
                      {event.startDate !== event.endDate && ` - ${formatDate(event.endDate)}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock size={16} className="text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium">Time</div>
                    <div className="text-gray-600">
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin size={16} className="text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium">Venue</div>
                    <div className="text-gray-600">
                      {event.venue?.name || 'TBA'}<br />
                      {event.venue?.address?.street || ''}{event.venue?.address?.street ? ', ' : ''}{event.venue?.address?.city || ''}<br />
                      {event.venue?.address?.state || ''} {event.venue?.address?.pincode || ''}
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users size={16} className="text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium">Organizer</div>
                    <div className="text-gray-600">
                      {event.organizer?.firstName ? `${event.organizer.firstName} ${event.organizer.lastName || ''}`.trim() : 'Unknown'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>

          {Array.isArray(event.requirements) && event.requirements.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
              <div className="space-y-2">
                {event.requirements.map((req) => (
                  <div key={req._id || req.item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{req.item}</span>
                    <span className={`text-sm ${
                      req.assignedTo ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {req.assignedTo?.firstName ? `Assigned to ${req.assignedTo.firstName} ${req.assignedTo.lastName || ''}`.trim() : 'Needs assignment'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className="heritage-bg min-h-screen relative overflow-hidden">
      <div className="heritage-gradient-overlay"></div>
      <div className="heritage-decoration"></div>
      <div className="heritage-decoration"></div>
      <div className="heritage-decoration"></div>
      <div className="heritage-decoration"></div>
      <div className="heritage-content">
        {/* Custom CSS for enhanced animations */}
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
          
          .float-animation {
            animation: float 6s ease-in-out infinite;
          }
        `}</style>
        
        {/* Show combined scroller for news and events - Sticky at top */}
        {(latestNews.length > 0 || eventsData.length > 0) && (
          <div className="sticky top-0 z-40 w-full">
            <Scroller 
              newsItems={latestNews.slice(0, 5)}
              eventItems={eventsData.slice(0, 5)}
            />
          </div>
        )}
        
        <div className="space-y-4 xs:space-y-6 pt-28" ref={eventsRef}>
      {/* Enhanced Header */}
      <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-4 xs:p-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 xs:mb-6 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl xs:text-3xl font-bold text-gray-900 flex items-center hover:scale-105 transition-transform duration-300">
              <Calendar className="mr-2 xs:mr-3 text-orange-600" size={24} />
              <span className="xs:inline bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Family Events</span>
            </h1>
            <p className="text-sm xs:text-base text-gray-600 mt-2 hover:text-gray-700 transition-colors duration-300">
              Discover and participate in upcoming family gatherings and celebrations
            </p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center px-3 xs:px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 text-sm xs:text-base hover:scale-105 hover:shadow-lg"
          >
            <Plus size={16} className="xs:w-[20px] xs:h-[20px] mr-1 xs:mr-2" />
            <span className="hidden xs:inline">Create Event</span>
            <span className="xs:hidden">Create</span>
          </button>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 xs:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors duration-300" size={16} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 xs:pl-10 pr-3 xs:pr-4 py-2 text-sm xs:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-300 transition-all duration-300"
            />
          </div>
          
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center space-y-2 xs:space-y-0 xs:space-x-3 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={16} className="xs:w-[20px] xs:h-[20px] text-gray-400 hover:text-orange-500 transition-colors duration-300" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="flex-1 xs:flex-none border border-gray-300 rounded-lg px-2 xs:px-3 py-2 text-sm xs:text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-300 transition-all duration-300"
              >
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 xs:px-3 py-2 text-sm xs:text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-300 transition-all duration-300"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Enhanced Events Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xs:gap-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {filteredEvents.map((event, index) => (
          <div 
            key={event._id || event.id} 
            className="transition-all duration-500"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animation: isVisible ? 'fadeInUp 0.6s ease-out forwards' : 'none'
            }}
          >
            <EventCard event={event} />
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 xs:p-12 text-center">
          <Calendar size={40} className="xs:w-[48px] xs:h-[48px] mx-auto text-gray-400 mb-3 xs:mb-4" />
          <h3 className="text-base xs:text-lg font-semibold text-gray-900 mb-2">No events found</h3>
          <p className="text-sm xs:text-base text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}

      {isCreateModalOpen && (
        <CreateEventModal
          formData={formData}
          requirements={requirements}
          isSubmitting={isSubmitting}
          onClose={closeCreateModal}
          onSubmit={handleCreateEvent}
          onChange={handleChange}
          onRequirementChange={handleRequirementChange}
          onAddRequirement={addRequirementField}
          onRemoveRequirement={removeRequirementField}
          onImageUpload={handleImageUpload}
          onRemoveImage={handleRemoveImage}
          priorityOptions={priorityOptions}
          visibilityOptions={visibilityOptions}
          eventTypes={eventTypes}
        />
      )}
        </div>
      </div>
    </div>
  );
};

export default Events;