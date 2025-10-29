import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import './GalleryView.css';

const GalleryView = () => {
  const [photos, setPhotos] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [filters, setFilters] = useState({
    type: 'all',
    year: 'all',
    tags: []
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTag, setSelectedTag] = useState('');

  const PHOTOS_PER_PAGE = 20;

  useEffect(() => {
    fetchGalleryStats();
    fetchPhotos();
  }, []);

  useEffect(() => {
    setPage(1);
    fetchPhotos();
  }, [filters]);

  const fetchGalleryStats = async () => {
    try {
      const response = await api.get('/api/gallery/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching gallery stats:', err);
    }
  };

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const params = {
        type: filters.type,
        year: filters.year,
        tags: filters.tags.join(','),
        page: page,
        limit: PHOTOS_PER_PAGE
      };

      const response = await api.get('/api/gallery', { params });
      setPhotos(response.data.photos);
      setTotalPages(response.data.totalPages);
      setError('');
    } catch (err) {
      setError('Error loading gallery');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeFilter = (type) => {
    setFilters({ ...filters, type });
  };

  const handleYearFilter = (year) => {
    setFilters({ ...filters, year });
  };

  const handleTagClick = (tag) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    setFilters({ ...filters, tags: newTags });
  };

  const clearFilters = () => {
    setFilters({ type: 'all', year: 'all', tags: [] });
  };

  if (!stats) {
    return <div className="gallery-loading">Loading gallery...</div>;
  }

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h1>Family Gallery</h1>
        <p>Browse and manage all event and news photos</p>
      </div>

      {/* Stats Bar */}
      <div className="gallery-stats">
        <div className="stat-item">
          <span className="stat-label">Total Photos</span>
          <span className="stat-value">{stats.counts.totalPhotos}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">From Events</span>
          <span className="stat-value">{stats.counts.events}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">From News</span>
          <span className="stat-value">{stats.counts.news}</span>
        </div>
      </div>

      <div className="gallery-content">
        {/* Sidebar Filters */}
        <aside className="gallery-sidebar">
          <div className="filter-section">
            <div className="filter-header">
              <h3>Filters</h3>
              {(filters.type !== 'all' || filters.year !== 'all' || filters.tags.length > 0) && (
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear All
                </button>
              )}
            </div>

            {/* Type Filter */}
            <div className="filter-group">
              <h4>Source Type</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="type"
                    value="all"
                    checked={filters.type === 'all'}
                    onChange={() => handleTypeFilter('all')}
                  />
                  <span>All</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="type"
                    value="Event"
                    checked={filters.type === 'Event'}
                    onChange={() => handleTypeFilter('Event')}
                  />
                  <span>Events ({stats.counts.events})</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="type"
                    value="News"
                    checked={filters.type === 'News'}
                    onChange={() => handleTypeFilter('News')}
                  />
                  <span>News ({stats.counts.news})</span>
                </label>
              </div>
            </div>

            {/* Year Filter */}
            <div className="filter-group">
              <h4>Year</h4>
              <select 
                value={filters.year} 
                onChange={(e) => handleYearFilter(e.target.value)}
                className="year-select"
              >
                <option value="all">All Years</option>
                {stats.years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            {stats.tags.length > 0 && (
              <div className="filter-group">
                <h4>Tags</h4>
                <div className="tags-container">
                  {stats.tags.map(tag => (
                    <button
                      key={tag}
                      className={`tag-filter ${filters.tags.includes(tag) ? 'active' : ''}`}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Gallery */}
        <main className="gallery-main">
          {loading ? (
            <div className="gallery-loading">Loading photos...</div>
          ) : error ? (
            <div className="gallery-error">{error}</div>
          ) : photos.length === 0 ? (
            <div className="gallery-empty">
              <p>No photos found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="photos-grid">
                {photos.map((photo) => (
                  <div key={photo._id} className="photo-card" onClick={() => setSelectedPhoto(photo)}>
                    <div className="photo-image">
                      <img src={photo.thumbnail || photo.url} alt={photo.caption} />
                      <div className="photo-overlay">
                        <span className="photo-source">{photo.itemType}</span>
                      </div>
                    </div>
                    <div className="photo-info">
                      <h4>{photo.albumTitle}</h4>
                      <p className="photo-item">{photo.itemTitle}</p>
                      <p className="photo-year">{photo.year}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="pagination-btn"
                  >
                    ← Previous
                  </button>
                  <span className="pagination-info">
                    Page {page} of {totalPages}
                  </span>
                  <button 
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="pagination-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Modal for Full Photo View */}
      {selectedPhoto && (
        <div className="photo-modal" onClick={() => setSelectedPhoto(null)}>
          <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPhoto(null)}>×</button>
            <img src={selectedPhoto.url} alt={selectedPhoto.caption} className="modal-image" />
            <div className="modal-info">
              <h3>{selectedPhoto.albumTitle}</h3>
              <p className="modal-source">
                <strong>From:</strong> {selectedPhoto.itemType} - {selectedPhoto.itemTitle}
              </p>
              {selectedPhoto.caption && (
                <p className="modal-caption">
                  <strong>Caption:</strong> {selectedPhoto.caption}
                </p>
              )}
              {selectedPhoto.tags.length > 0 && (
                <div className="modal-tags">
                  <strong>Tags:</strong>
                  <div className="tag-list">
                    {selectedPhoto.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              <p className="modal-uploader">
                <strong>Uploaded by:</strong> {selectedPhoto.createdBy?.firstName} {selectedPhoto.createdBy?.lastName}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryView;