import React, { useState, useEffect, useMemo } from 'react';
import { Image as ImageIcon, Calendar, Newspaper, Search, ChevronLeft, ChevronRight, X, Download, Upload } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Scroller from '../components/Scroller';
import api from '../utils/api';
import '../styles/heritage-background.css';

const DEFAULT_FILTERS = {
  type: 'all',
  year: 'all',
  category: 'all',
  eventType: 'all',
  sortBy: 'recent',
  search: ''
};

const MAX_UPLOAD_IMAGES = 50;
const MAX_UPLOAD_IMAGE_SIZE = 10 * 1024 * 1024;

const Media = () => {
  const { t, currentLanguage } = useLanguage();
  const { user } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filterOptions, setFilterOptions] = useState({ years: [], categories: [], eventTypes: [] });
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [newsItems, setNewsItems] = useState([]);
  const [eventItems, setEventItems] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadImages, setUploadImages] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const maxImageSizeMB = useMemo(() => Math.round(MAX_UPLOAD_IMAGE_SIZE / (1024 * 1024)), []);
  const locale = currentLanguage === 'mr' ? 'mr-IN' : 'en-US';

  const sortOptions = useMemo(() => ([
    { value: 'recent', label: t('mediaPage.sort.recent') },
    { value: 'oldest', label: t('mediaPage.sort.oldest') },
    { value: 'title', label: t('mediaPage.sort.title') },
    { value: 'photos', label: t('mediaPage.sort.photos') }
  ]), [t]);

  const mediaTypeLabels = useMemo(() => ({
    all: t('mediaPage.filters.allTypes'),
    event: t('mediaPage.filters.events'),
    news: t('mediaPage.filters.news'),
    community: t('mediaPage.filters.community')
  }), [t]);

  const mediaTypeBadges = useMemo(() => ({
    event: t('mediaPage.albums.eventType'),
    news: t('mediaPage.albums.newsType'),
    community: t('mediaPage.albums.communityType')
  }), [t]);

  const buildMediaAlbum = (mediaItem) => {
    if (!mediaItem) {
      return null;
    }

    const albumKey = `media-${mediaItem._id}`;
    const albumDate = mediaItem.createdAt || mediaItem.updatedAt || new Date().toISOString();
    const albumYear = albumDate ? new Date(albumDate).getFullYear().toString() : null;
    const uploaderName = mediaItem.uploadedBy
      ? `${mediaItem.uploadedBy.firstName || ''} ${mediaItem.uploadedBy.lastName || ''}`.trim() || t('mediaPage.albums.unknownUploader')
      : t('mediaPage.albums.unknownUploader');

    return {
      id: albumKey,
      title: mediaItem.title,
      type: 'community',
      sourceId: mediaItem._id,
      date: albumDate,
      year: albumYear,
      category: 'Community Uploads',
      eventType: null,
      images: Array.isArray(mediaItem.images)
        ? mediaItem.images.map((image, index) => ({
            id: `${albumKey}-${index}`,
            url: image.data,
            thumbnail: image.data,
            caption: image.name || ''
          }))
        : [],
      photoCount: Array.isArray(mediaItem.images) ? mediaItem.images.length : 0,
      uploader: mediaItem.uploadedBy || null,
      uploaderName,
      description: mediaItem.description || ''
    };
  };

  const resetUploadForm = () => {
    setUploadTitle('');
    setUploadDescription('');
    setUploadImages([]);
    setUploadError('');
    setUploadSuccess('');
  };

  const handleUploadFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) {
      return;
    }

    setUploadError('');
    setUploadSuccess('');

    const files = Array.from(fileList);

    if (uploadImages.length + files.length > MAX_UPLOAD_IMAGES) {
      setUploadError(t('mediaPage.upload.uploadLimit', { count: MAX_UPLOAD_IMAGES, size: maxImageSizeMB }));
      return;
    }

    const oversizedFile = files.find((file) => file.size > MAX_UPLOAD_IMAGE_SIZE);
    if (oversizedFile) {
      setUploadError(t('mediaPage.upload.uploadLimit', { count: MAX_UPLOAD_IMAGES, size: maxImageSizeMB }));
      return;
    }

    const convertFileToBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

    try {
      const convertedFiles = await Promise.all(
        files.map(async (file) => {
          const base64 = await convertFileToBase64(file);
          return {
            data: base64,
            preview: base64,
            name: file.name,
            mimeType: file.type,
            size: file.size
          };
        })
      );

      setUploadImages((prev) => [...prev, ...convertedFiles]);
    } catch (error) {
      setUploadError(t('mediaPage.upload.error'));
    }
  };

  const removeUploadImage = (index) => {
    setUploadImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const submitMediaUpload = async () => {
    if (!user) {
      setUploadError(t('mediaPage.upload.loginRequired'));
      return;
    }

    if (!uploadTitle.trim() || uploadImages.length === 0 || uploadingMedia) {
      return;
    }

    setUploadingMedia(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const payload = {
        title: uploadTitle.trim(),
        description: uploadDescription.trim(),
        images: uploadImages.map((image) => ({
          data: image.data,
          name: image.name,
          mimeType: image.mimeType,
          size: image.size
        }))
      };

      const response = await api.post('/api/media', payload);

      const newMediaItem = response.data;
      const newMediaAlbum = buildMediaAlbum(newMediaItem);

      if (newMediaAlbum) {
        setAlbums((prev) => {
          const updated = [newMediaAlbum, ...prev.filter((album) => album.id !== newMediaAlbum.id)];
          updated.sort((a, b) => new Date(b.date) - new Date(a.date));
          return updated;
        });
      }

      setMediaItems((prev) => [newMediaItem, ...prev.filter((item) => item._id !== newMediaItem._id)]);

      resetUploadForm();
      setUploadSuccess(t('mediaPage.upload.success'));
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || t('mediaPage.upload.error');
      setUploadError(message);
    } finally {
      setUploadingMedia(false);
    }
  };

  useEffect(() => {
    fetchMediaContent();
  }, []);

  const fetchMediaContent = async () => {
    try {
      setLoading(true);
      const [newsRes, eventsRes, mediaRes] = await Promise.all([
        api.get('/api/news'),
        api.get('/api/events'),
        api.get('/api/media')
      ]);

      const now = Date.now();
      const albumsMap = {};
      const yearsSet = new Set();
      const categoriesSet = new Set();
      const eventTypesSet = new Set();

      const newsItemsData = Array.isArray(newsRes?.data?.news) ? newsRes.data.news : [];

      if (newsItemsData.length > 0) {
        newsItemsData.forEach(newsItem => {
          if (newsItem.images && newsItem.images.length > 0) {
            const albumKey = `news-${newsItem._id}`;
            const albumDate = newsItem.publishDate || newsItem.createdAt;
            const albumYear = albumDate ? new Date(albumDate).getFullYear().toString() : null;
            const albumCategory = newsItem.category || 'General';

            if (albumYear) {
              yearsSet.add(albumYear);
            }

            if (albumCategory) {
              categoriesSet.add(albumCategory);
            }

            albumsMap[albumKey] = {
              id: albumKey,
              title: newsItem.title,
              type: 'news',
              sourceId: newsItem._id,
              date: albumDate,
              year: albumYear,
              category: albumCategory,
              eventType: null,
              images: newsItem.images.map((image, index) => ({
                id: `${albumKey}-${index}`,
                url: image.url || image.thumbnail,
                thumbnail: image.thumbnail || image.url,
                caption: image.caption || ''
              })),
              photoCount: newsItem.images.length
            };
          }
        });
      }

      const eventItemsData = Array.isArray(eventsRes?.data?.events) ? eventsRes.data.events : [];

      if (eventItemsData.length > 0) {
        eventItemsData.forEach(event => {
          if (event.images && event.images.length > 0) {
            const albumKey = `event-${event._id}`;
            const albumDate = event.startDate || event.createdAt;
            const albumYear = albumDate ? new Date(albumDate).getFullYear().toString() : null;
            const albumEventType = event.eventType || 'Other';

            if (albumYear) {
              yearsSet.add(albumYear);
            }

            if (albumEventType) {
              eventTypesSet.add(albumEventType);
            }

            albumsMap[albumKey] = {
              id: albumKey,
              title: event.title,
              type: 'event',
              sourceId: event._id,
              date: albumDate,
              year: albumYear,
              category: null,
              eventType: albumEventType,
              images: event.images.map((image, index) => ({
                id: `${albumKey}-${index}`,
                url: image.url || image.thumbnail,
                thumbnail: image.thumbnail || image.url,
                caption: image.caption || ''
              })),
              photoCount: event.images.length
            };
          }
        });
      }

      const mediaItemsData = Array.isArray(mediaRes?.data?.media)
        ? mediaRes.data.media
        : Array.isArray(mediaRes?.data)
          ? mediaRes.data
          : [];

      setMediaItems(mediaItemsData);

      if (mediaItemsData.length > 0) {
        mediaItemsData.forEach(mediaItem => {
          const album = buildMediaAlbum(mediaItem);
          if (!album) {
            return;
          }
          albumsMap[album.id] = album;
          if (album.year) {
            yearsSet.add(album.year);
          }
          if (album.category) {
            categoriesSet.add(album.category);
          }
        });
      }

      const upcomingNewsItems = newsItemsData
        .filter(newsItem => {
          const publishDate = newsItem.publishDate || newsItem.createdAt;
          if (!publishDate) {
            return false;
          }
          const publishTime = new Date(publishDate).getTime();
          return Number.isFinite(publishTime) && publishTime >= now;
        })
        .sort((a, b) => {
          const aTime = new Date(a.publishDate || a.createdAt).getTime();
          const bTime = new Date(b.publishDate || b.createdAt).getTime();
          return aTime - bTime;
        });

      const upcomingEventItems = eventItemsData
        .filter(eventItem => {
          // Primary check: startDate must be in the future
          const startDate = eventItem.startDate || eventItem.date;
          if (startDate) {
            const startTime = new Date(startDate).getTime();
            if (Number.isFinite(startTime)) {
              // Only include if date is in the future
              return startTime >= now;
            }
          }
          // Fallback: if no valid startDate, check the endDate or createdAt
          const fallbackDate = eventItem.endDate || eventItem.createdAt;
          if (fallbackDate) {
            const fallbackTime = new Date(fallbackDate).getTime();
            if (Number.isFinite(fallbackTime) && fallbackTime >= now) {
              return true;
            }
          }
          // Final fallback: check status only if no valid dates found
          if (typeof eventItem.status === 'string') {
            const status = eventItem.status.toLowerCase();
            return status === 'upcoming' || status === 'ongoing';
          }
          return false;
        })
        .sort((a, b) => {
          const aTime = new Date(a.startDate || a.date || a.createdAt).getTime();
          const bTime = new Date(b.startDate || b.date || b.createdAt).getTime();
          if (!Number.isFinite(aTime) && !Number.isFinite(bTime)) {
            return 0;
          }
          if (!Number.isFinite(aTime)) {
            return 1;
          }
          if (!Number.isFinite(bTime)) {
            return -1;
          }
          return aTime - bTime;
        });

      const albumsArray = Object.values(albumsMap);
      albumsArray.sort((a, b) => new Date(b.date) - new Date(a.date));

      setAlbums(albumsArray);
      setFilteredAlbums(albumsArray);
      setNewsItems(upcomingNewsItems);
      setEventItems(upcomingEventItems);
      setFilterOptions({
        years: Array.from(yearsSet).filter(Boolean).sort((a, b) => parseInt(b, 10) - parseInt(a, 10)),
        categories: Array.from(categoriesSet).filter(Boolean).sort((a, b) => a.localeCompare(b)),
        eventTypes: Array.from(eventTypesSet).filter(Boolean).sort((a, b) => a.localeCompare(b))
      });
    } catch (error) {
      console.error('Failed to fetch media content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...albums];

    if (filters.type !== 'all') {
      filtered = filtered.filter(album => album.type === filters.type);
    }

    if (filters.year !== 'all') {
      filtered = filtered.filter(album => album.year === filters.year);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(album => album.category === filters.category);
    }

    if (filters.eventType !== 'all') {
      filtered = filtered.filter(album => album.eventType === filters.eventType);
    }

    const normalizedSearch = filters.search.trim().toLowerCase();
    if (normalizedSearch) {
      filtered = filtered.filter(album => {
        const titleMatch = album.title.toLowerCase().includes(normalizedSearch);
        const captionMatch = album.images.some(image => (image.caption || '').toLowerCase().includes(normalizedSearch));
        return titleMatch || captionMatch;
      });
    }

    if (filters.sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (filters.sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (filters.sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (filters.sortBy === 'photos') {
      filtered.sort((a, b) => b.photoCount - a.photoCount);
    }

    setFilteredAlbums(filtered);
  }, [filters, albums]);

  const openAlbum = (album) => {
    setSelectedAlbum(album);
    setSelectedImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
    setSelectedImageIndex(0);
    document.body.style.overflow = 'unset';
  };

  const showNextImage = () => {
    if (selectedAlbum && selectedImageIndex < selectedAlbum.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const showPrevImage = () => {
    if (selectedAlbum && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleTypeChange = (type) => {
    setFilters(prev => ({
      ...prev,
      type,
      category: type === 'news' ? prev.category : 'all',
      eventType: type === 'event' ? prev.eventType : 'all'
    }));
  };

  const handleYearChange = (year) => {
    setFilters(prev => ({ ...prev, year }));
  };

  const handleCategoryChange = (category) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const handleEventTypeChange = (eventType) => {
    setFilters(prev => ({ ...prev, eventType }));
  };

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleSortChange = (sortBy) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const downloadCurrentImage = async () => {
    if (!selectedAlbum) return;
    const activeImage = selectedAlbum.images[selectedImageIndex];
    const imageUrl = activeImage?.url || activeImage?.thumbnail;
    if (!imageUrl) return;

    try {
      setDownloading(true);
      const response = await fetch(imageUrl, { mode: 'cors' });
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const safeTitle = selectedAlbum.title.replace(/[^a-z0-9\-]+/gi, '_').toLowerCase();
      const extension = blob.type.split('/')[1] || 'jpg';
      link.download = `${safeTitle || 'photo'}_${selectedImageIndex + 1}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Image download failed:', error);
      window.open(imageUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!selectedAlbum) return;
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'Escape') closeAlbum();
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, selectedAlbum]);

  // Auto-slide effect - advance image every 5.5 seconds (paused on hover)
  useEffect(() => {
    if (!selectedAlbum || selectedAlbum.images.length <= 1 || isHovering) return;

    const autoSlideInterval = setInterval(() => {
      setSelectedImageIndex(prevIndex => {
        // Loop back to first image when reaching the end
        if (prevIndex < selectedAlbum.images.length - 1) {
          return prevIndex + 1;
        }
        return 0;
      });
    }, 5500); // 5.5 seconds

    return () => clearInterval(autoSlideInterval);
  }, [selectedAlbum, isHovering]);

  const currentDate = useMemo(() => {
    if (!selectedAlbum?.date) {
      return '';
    }
    try {
      return new Date(selectedAlbum.date).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return new Date(selectedAlbum.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }, [selectedAlbum?.date, locale]);

  return (
    <div className="heritage-bg relative min-h-screen pt-28 xs:pt-32 sm:pt-36 lg:pt-44">
      {/* Decorative Elements */}
      <div className="heritage-gradient-overlay" />
      <div className="heritage-decoration" />
      <div className="heritage-decoration" />
      <div className="heritage-decoration" />
      <div className="heritage-decoration" />

      <div className="heritage-content">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {(newsItems.length > 0 || eventItems.length > 0) && (
            <div className="sticky top-0 z-40 mb-12">
              <Scroller
                newsItems={newsItems.slice(0, 5)}
                eventItems={eventItems.slice(0, 5)}
              />
            </div>
          )}
          {/* Header Section */}
          <div className="mb-12 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 rounded-3xl blur-lg opacity-40 animate-pulse" />
                <div className="relative h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-100 to-amber-100 shadow-xl flex">
                  <ImageIcon size={32} className="text-orange-600" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-orange-700 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-3">
              {t('mediaPage.header.title')}
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t('mediaPage.header.description')}
            </p>
          </div>

          {user && (
            <div className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 heritage-card p-6 rounded-3xl shadow-xl border border-orange-100 bg-white/80 backdrop-blur animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 shadow-lg">
                    <Upload size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{t('mediaPage.upload.title')}</h2>
                    <p className="text-sm text-gray-500">{t('mediaPage.upload.description')}</p>
                  </div>
                </div>

                {uploadError && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {uploadError}
                  </div>
                )}
                {uploadSuccess && (
                  <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                    {uploadSuccess}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('mediaPage.upload.albumTitle')}</label>
                    <input
                      type="text"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder={t('mediaPage.upload.albumTitlePlaceholder')}
                      className="w-full rounded-xl border border-orange-100 bg-white/80 px-4 py-3 focus:border-orange-300 focus:ring-2 focus:ring-orange-200 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('mediaPage.upload.descriptionLabel')}</label>
                    <textarea
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                      placeholder={t('mediaPage.upload.descriptionPlaceholder')}
                      rows={3}
                      className="w-full rounded-xl border border-orange-100 bg-white/80 px-4 py-3 focus:border-orange-300 focus:ring-2 focus:ring-orange-200 transition"
                    />
                  </div>

                  <div className="border-2 border-dashed border-orange-200 rounded-2xl p-6 bg-orange-50/30">
                    <input
                      id="media-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleUploadFiles(e.target.files)}
                    />
                    <label
                      htmlFor="media-upload"
                      className="flex flex-col items-center gap-3 cursor-pointer"
                    >
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-600">
                        <Upload size={24} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-800">{t('mediaPage.upload.uploadInstructions')}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {t('mediaPage.upload.uploadLimit', { count: MAX_UPLOAD_IMAGES, size: maxImageSizeMB })}
                        </p>
                      </div>
                    </label>
                  </div>

                  {uploadImages.length > 0 && (
                    <div className="bg-white rounded-2xl border border-orange-100 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-800">{t('mediaPage.upload.selectedImages')}</h3>
                        <button
                          type="button"
                          onClick={resetUploadForm}
                          className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
                        >
                          {t('mediaPage.upload.clearAll')}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {uploadImages.map((image, index) => (
                          <div key={index} className="relative">
                            <div className="aspect-square overflow-hidden rounded-xl border border-orange-100">
                              <img
                                src={image.preview}
                                alt={image.name || `upload-${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeUploadImage(index)}
                              className="absolute top-2 right-2 bg-white/80 text-red-500 rounded-full p-1 shadow hover:text-red-600"
                            >
                              <X size={14} />
                            </button>
                            <p className="mt-2 text-xs text-gray-600 truncate">{image.name || t('mediaPage.upload.imageName', { index: index + 1 })}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={submitMediaUpload}
                    disabled={uploadingMedia || !uploadTitle.trim() || uploadImages.length === 0}
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white transition ${
                      uploadingMedia || !uploadTitle.trim() || uploadImages.length === 0
                        ? 'bg-orange-200 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg'
                    }`}
                  >
                    {uploadingMedia ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                        {t('mediaPage.upload.uploading')}
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        {t('mediaPage.upload.uploadButton')}
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="heritage-card p-6 rounded-3xl border border-orange-100 bg-white/80 backdrop-blur shadow-lg animate-fade-in">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('mediaPage.communityUploads.title')}</h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {mediaItems.length === 0 && (
                    <p className="text-sm text-gray-500">{t('mediaPage.communityUploads.empty')}</p>
                  )}
                  {mediaItems.map((item) => (
                    <div key={item._id} className="border border-orange-100 rounded-2xl p-4 bg-white/70">
                      <div className="flex.items-center justify-between mb-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 text-right">
                          <p>{new Date(item.createdAt).toLocaleDateString(locale)}</p>
                          <p>{t('mediaPage.communityUploads.photos', { count: item.images?.length || 0 })}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {item.images.slice(0, 3).map((image, idx) => (
                          <div key={idx} className="aspect-square overflow-hidden rounded-xl">
                            <img
                              src={image.data}
                              alt={`${item.title}-${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {item.images.length > 3 && (
                          <div className="aspect-square flex items-center justify-center rounded-xl border border-dashed border-orange-200 text-xs text-orange-600">
                            {t('mediaPage.communityUploads.morePhotos', { count: item.images.length - 3 })}
                          </div>
                        )}
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        <p>
                          {t('mediaPage.communityUploads.uploadedBy', {
                            name: item.uploadedBy ? `${item.uploadedBy.firstName || ''} ${item.uploadedBy.lastName || ''}`.trim() || t('mediaPage.albums.unknownUploader') : t('mediaPage.albums.unknownUploader')
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search and Filter Bar */}
          <div className="mb-10 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-amber-200 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-300" />
              <div className="relative flex items-center">
                <Search className="absolute left-4 text-orange-400 z-10" size={20} />
                <input
                  type="text"
                  placeholder={t('mediaPage.search.placeholder')}
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-orange-100 bg-white/90 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-300 shadow-sm hover:shadow-md text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              {['all', 'event', 'news', 'community'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    filters.type === type
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xl shadow-orange-300/50 scale-105'
                      : 'bg-white text-gray-700 border-2 border-orange-100 hover:border-orange-300 hover:bg-orange-50/50 shadow-md hover:shadow-lg'
                  }`}
                >
                  {type === 'all' ? (
                    mediaTypeLabels.all
                  ) : type === 'event' ? (
                    <div className="flex items-center gap-2">
                      <Calendar size={18} />
                      {mediaTypeLabels.event}
                    </div>
                  ) : type === 'news' ? (
                    <div className="flex items-center gap-2">
                      <Newspaper size={18} />
                      {mediaTypeLabels.news}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Upload size={18} />
                      {mediaTypeLabels.community}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-flex items-center justify-center mb-6">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
                    <div className="absolute inset-2 bg-white rounded-full" />
                    <div className="absolute inset-2 flex items-center justify-center">
                      <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 font-semibold text-lg">{t('mediaPage.loading.title')}</p>
                <p className="text-gray-400 text-sm mt-2">{t('mediaPage.loading.subtitle')}</p>
              </div>
            </div>
          )}

          {/* Albums Grid */}
          {!loading && filteredAlbums.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAlbums.map((album, idx) => (
                <div
                  key={album.id}
                  onClick={() => openAlbum(album)}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 transform hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Card Background Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-all duration-300 -z-10" />

                  {/* Card Content */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300">
                    <img
                      src={album.images[0].thumbnail || album.images[0].url}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
                    />

                    {/* Photo Count Badge */}
                    {album.photoCount > 1 && (
                      <div className="absolute top-3 right-3 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-sm font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <div className="flex flex-col items-center">
                          <span className="text-xs opacity-70">+</span>
                          <span>{album.photoCount}</span>
                        </div>
                      </div>
                    )}

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4" />

                    {/* Content on Hover */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                      <h3 className="text-white font-bold text-base line-clamp-2 mb-2">
                        {album.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            album.type === 'event'
                              ? 'bg-blue-500 text-white'
                              : album.type === 'news'
                                ? 'bg-orange-500 text-white'
                                : 'bg-emerald-500 text-white'
                          }`}
                        >
                          {mediaTypeBadges[album.type]}
                        </span>
                        <span className="text-white text-xs font-semibold">
                          {t('mediaPage.albums.photoCount', { count: album.photoCount })}
                        </span>
                      </div>
                      {album.uploaderName && (
                        <p className="text-white/90 text-xs font-medium">
                          {t('mediaPage.communityUploads.uploadedBy', { name: album.uploaderName })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredAlbums.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 mb-6">
                <ImageIcon size={40} className="text-orange-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {t('mediaPage.emptyState.title')}
              </h2>
              <p className="text-gray-600 text-lg">
                {filters.search
                  ? t('mediaPage.emptyState.noResults')
                  : t('mediaPage.emptyState.noAlbums')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedAlbum && (
        <div
          className="fixed inset-0 z-[10000] flex items-start justify-center px-4 pt-28 xs:pt-32 sm:pt-40 lg:pt-48 pb-6 bg-gradient-to-br from-black/70 via-orange-900/30 to-black/70 backdrop-blur-xl animate-fade-in"
          onClick={closeAlbum}
        >
          <button
            className="absolute top-6 right-6 text-white hover:bg-white/20 p-3 rounded-full transition-all duration-300 hover:scale-110 z-10"
            onClick={closeAlbum}
            aria-label={t('common.close')}
          >
            <X size={28} />
          </button>

          {/* Previous Button */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 p-3 rounded-full transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.stopPropagation();
              showPrevImage();
            }}
            disabled={selectedImageIndex === 0}
          >
            <ChevronLeft size={40} />
          </button>

          {/* Main Content */}
          <div
            className="max-w-5xl w-full bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col max-h-[90vh] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Container */}
            <div
              className="media-lightbox-3d group relative flex w-full items-center justify-center"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {selectedAlbum.images.length > 1 && (
                <div
                  className="media-3d-slider"
                  style={{ '--quantity': selectedAlbum.images.length }}
                >
                  {selectedAlbum.images.map((image, idx) => (
                    <button
                      key={image.id || `${selectedAlbum.id}-${idx}`}
                      type="button"
                      className={`media-3d-item${idx === selectedImageIndex ? ' active' : ''}`}
                      style={{ '--position': idx + 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex(idx);
                      }}
                    >
                      <img
                        src={image.thumbnail || image.url}
                        alt={image.caption || selectedAlbum.title}
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="media-3d-active relative">
                <img
                  src={selectedAlbum.images[selectedImageIndex].url}
                  alt={selectedAlbum.title}
                  className="media-3d-active-image"
                />

                <div className="absolute top-4 left-4 bg-black/60 text-white rounded-full px-4 py-2 text-sm font-semibold backdrop-blur">
                  {t('mediaPage.lightbox.counter', { current: selectedImageIndex + 1, total: selectedAlbum.images.length })}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadCurrentImage();
                  }}
                  disabled={downloading}
                  className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md backdrop-blur ${
                    downloading
                      ? 'bg-white/20 text-gray-200 cursor-wait'
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:scale-105 hover:shadow-lg'
                  }`}
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">{downloading ? t('mediaPage.lightbox.preparing') : t('mediaPage.lightbox.download')}</span>
                </button>

                {selectedAlbum.images.length > 1 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500"
                      style={{
                        animation: isHovering ? 'none' : `slideProgress 5.5s linear infinite`,
                        width: '100%'
                      }}
                    />
                  </div>
                )}

                {selectedAlbum.images.length > 1 && (
                  <div className="absolute top-4 right-4 translate-y-12 sm:translate-y-16 bg-black/60 text-white rounded-full px-3 py-1 text-xs font-semibold backdrop-blur flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    {t('mediaPage.lightbox.autoPlay')}
                  </div>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="p-6 bg-gradient-to-b from-white/5 to-transparent border-t border-white/10">
              {/* Type Badge and Date */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    selectedAlbum.type === 'event'
                      ? 'bg-blue-500/20'
                      : selectedAlbum.type === 'news'
                        ? 'bg-orange-500/20'
                        : 'bg-emerald-500/20'
                  }`}>
                    {selectedAlbum.type === 'event' ? (
                      <Calendar size={20} className="text-blue-400" />
                    ) : selectedAlbum.type === 'news' ? (
                      <Newspaper size={20} className="text-orange-400" />
                    ) : (
                      <Upload size={20} className="text-emerald-400" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-bold px-3 py-1 rounded-full ${
                      selectedAlbum.type === 'event'
                        ? 'bg-blue-500/30 text-blue-200'
                        : selectedAlbum.type === 'news'
                          ? 'bg-orange-500/30 text-orange-200'
                          : 'bg-emerald-500/30 text-emerald-200'
                    }`}
                  >
                    {mediaTypeBadges[selectedAlbum.type]}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-300 text-sm font-semibold">
                    {currentDate}
                  </span>
                  <button
                    type="button"
                    onClick={downloadCurrentImage}
                    disabled={downloading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-md backdrop-blur ${
                      downloading
                        ? 'bg-white/20 text-gray-200 cursor-wait'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:scale-105 hover:shadow-lg'
                    }`}
                  >
                    <Download size={18} />
                    {downloading ? t('mediaPage.lightbox.preparing') : t('mediaPage.lightbox.download')}
                  </button>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-white mb-3 line-clamp-2">
                {selectedAlbum.title}
              </h2>

              {/* Image Caption */}
              {selectedAlbum.images[selectedImageIndex].caption && (
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                  {selectedAlbum.images[selectedImageIndex].caption}
                </p>
              )}

              {/* Thumbnail Strip */}
              {selectedAlbum.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 mt-4 pt-4 border-t border-white/10" aria-label={t('mediaPage.lightbox.thumbnailStrip')}>
                  {selectedAlbum.images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-110 ${
                        idx === selectedImageIndex
                          ? 'border-orange-400 ring-2 ring-orange-500/50'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <img
                        src={image.thumbnail || image.url}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Next Button */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 p-3 rounded-full transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.stopPropagation();
              showNextImage();
            }}
            disabled={selectedImageIndex === selectedAlbum.images.length - 1}
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideProgress {
          from {
            transform: scaleX(0);
            transform-origin: left;
          }
          to {
            transform: scaleX(1);
            transform-origin: left;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Media;