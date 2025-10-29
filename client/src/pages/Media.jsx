import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Calendar, Newspaper, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';
import '../styles/heritage-background.css';

const Media = () => {
  const { t } = useLanguage();
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    fetchMediaContent();
  }, []);

  const fetchMediaContent = async () => {
    try {
      setLoading(true);
      const [newsRes, eventsRes] = await Promise.all([
        api.get('/api/news'),
        api.get('/api/events')
      ]);

      const albumsMap = {};

      if (newsRes.data.news) {
        newsRes.data.news.forEach(newsItem => {
          if (newsItem.images && newsItem.images.length > 0) {
            const albumKey = `news-${newsItem._id}`;
            albumsMap[albumKey] = {
              id: albumKey,
              title: newsItem.title,
              type: 'news',
              sourceId: newsItem._id,
              date: newsItem.publishDate,
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

      if (eventsRes.data.events) {
        eventsRes.data.events.forEach(event => {
          if (event.images && event.images.length > 0) {
            const albumKey = `event-${event._id}`;
            albumsMap[albumKey] = {
              id: albumKey,
              title: event.title,
              type: 'event',
              sourceId: event._id,
              date: event.startDate,
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

      const albumsArray = Object.values(albumsMap);
      albumsArray.sort((a, b) => new Date(b.date) - new Date(a.date));

      setAlbums(albumsArray);
      setFilteredAlbums(albumsArray);
    } catch (error) {
      console.error('Failed to fetch media content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = albums;

    if (filterType !== 'all') {
      filtered = filtered.filter(album => album.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(album =>
        album.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAlbums(filtered);
  }, [searchTerm, filterType, albums]);

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

  const currentDate = new Date(selectedAlbum?.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="heritage-bg relative min-h-screen pt-24 xs:pt-28 sm:pt-32">
      {/* Decorative Elements */}
      <div className="heritage-gradient-overlay" />
      <div className="heritage-decoration" />
      <div className="heritage-decoration" />
      <div className="heritage-decoration" />
      <div className="heritage-decoration" />

      <div className="heritage-content">
        <div className="max-w-7xl mx-auto px-4 py-12">
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
              Family Memories
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Celebrate moments through our collection of family photos from events and milestones
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-10 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-amber-200 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-300" />
              <div className="relative flex items-center">
                <Search className="absolute left-4 text-orange-400 z-10" size={20} />
                <input
                  type="text"
                  placeholder="Search albums by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-orange-100 bg-white/90 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-300 shadow-sm hover:shadow-md text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              {['all', 'events', 'news'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    filterType === type
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xl shadow-orange-300/50 scale-105'
                      : 'bg-white text-gray-700 border-2 border-orange-100 hover:border-orange-300 hover:bg-orange-50/50 shadow-md hover:shadow-lg'
                  }`}
                >
                  {type === 'all' ? (
                    'All Albums'
                  ) : type === 'events' ? (
                    <div className="flex items-center gap-2">
                      <Calendar size={18} />
                      Events
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Newspaper size={18} />
                      News
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
                <p className="text-gray-600 font-semibold text-lg">Gathering your memories...</p>
                <p className="text-gray-400 text-sm mt-2">This may take a moment</p>
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
                              : 'bg-orange-500 text-white'
                          }`}
                        >
                          {album.type === 'event' ? 'Event' : 'News'}
                        </span>
                        <span className="text-white text-xs font-semibold">
                          {album.photoCount} {album.photoCount === 1 ? 'photo' : 'photos'}
                        </span>
                      </div>
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
                No memories yet
              </h2>
              <p className="text-gray-600 text-lg">
                {searchTerm
                  ? 'No albums match your search. Try a different query.'
                  : 'No photo albums available from events or news yet.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedAlbum && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-gradient-to-br from-black/70 via-orange-900/30 to-black/70 backdrop-blur-xl animate-fade-in"
          onClick={closeAlbum}
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-white hover:bg-white/20 p-3 rounded-full transition-all duration-300 hover:scale-110 z-10"
            onClick={closeAlbum}
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
              className="flex-1 flex items-center justify-center min-h-[500px] bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden group cursor-pointer"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <img
                src={selectedAlbum.images[selectedImageIndex].url}
                alt={selectedAlbum.title}
                className="w-full h-full object-contain animate-fade-in"
              />

              {/* Image Counter */}
              <div className="absolute top-4 left-4 bg-black/60 text-white rounded-full px-4 py-2 text-sm font-semibold backdrop-blur">
                {selectedImageIndex + 1} / {selectedAlbum.images.length}
              </div>

              {/* Auto-Slide Progress Bar - Only show for multi-image albums */}
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

              {/* Auto-Play Badge */}
              {selectedAlbum.images.length > 1 && (
                <div className="absolute top-4 right-4 bg-black/60 text-white rounded-full px-3 py-1 text-xs font-semibold backdrop-blur flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Auto-play
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="p-6 bg-gradient-to-b from-white/5 to-transparent border-t border-white/10">
              {/* Type Badge and Date */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    selectedAlbum.type === 'event'
                      ? 'bg-blue-500/20'
                      : 'bg-orange-500/20'
                  }`}>
                    {selectedAlbum.type === 'event' ? (
                      <Calendar size={20} className="text-blue-400" />
                    ) : (
                      <Newspaper size={20} className="text-orange-400" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-bold px-3 py-1 rounded-full ${
                      selectedAlbum.type === 'event'
                        ? 'bg-blue-500/30 text-blue-200'
                        : 'bg-orange-500/30 text-orange-200'
                    }`}
                  >
                    {selectedAlbum.type === 'event' ? 'Event' : 'News'}
                  </span>
                </div>
                <span className="text-gray-300 text-sm font-semibold">
                  {currentDate}
                </span>
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
                <div className="flex gap-3 overflow-x-auto pb-2 mt-4 pt-4 border-t border-white/10">
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