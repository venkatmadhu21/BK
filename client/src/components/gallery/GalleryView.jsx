import React, { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';
import './GalleryView.css';

const SORT_OPTIONS = [
  { value: 'uploadedAt', label: 'Newest Upload' },
  { value: 'albumCreatedAt', label: 'Album Created' },
  { value: 'albumTitle', label: 'Album Title' },
  { value: 'itemTitle', label: 'Item Title' },
  { value: 'year', label: 'Year' }
];

const DEFAULT_FILTERS = {
  type: 'all',
  year: 'all',
  tags: [],
  uploaders: [],
  sortBy: 'uploadedAt',
  sortOrder: 'desc',
  search: ''
};

const GalleryView = () => {
  const [photos, setPhotos] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  const PHOTOS_PER_PAGE = 20;

  useEffect(() => {
    fetchGalleryStats();
  }, []);

  const fetchGalleryStats = async () => {
    try {
      const response = await api.get('/api/gallery/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching gallery stats:', err);
    }
  };

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        type: filters.type,
        year: filters.year,
        tags: filters.tags.join(','),
        uploader: filters.uploaders.join(','),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        search: filters.search,
        page,
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
  }, [filters, page]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleTypeFilter = (type) => {
    setFilters(prev => ({ ...prev, type }));
    setPage(1);
  };

  const handleYearFilter = (year) => {
    setFilters(prev => ({ ...prev, year }));
    setPage(1);
  };

  const handleTagClick = (tag) => {
    setFilters(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
    setPage(1);
  };

  const handleUploaderToggle = (id) => {
    setFilters(prev => {
      const newUploaders = prev.uploaders.includes(id)
        ? prev.uploaders.filter(u => u !== id)
        : [...prev.uploaders, id];
      return { ...prev, uploaders: newUploaders };
    });
    setPage(1);
  };

  const handleSortChange = (value) => {
    setFilters(prev => ({ ...prev, sortBy: value }));
    setPage(1);
  };

  const handleSortOrderChange = (order) => {
    setFilters(prev => ({ ...prev, sortOrder: order }));
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchInput }));
    setPage(1);
  };

  const handleSearchClear = () => {
    setSearchInput('');
    setFilters(prev => ({ ...prev, search: '' }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchInput('');
    setPage(1);
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
              {(filters.type !== 'all' ||
                filters.year !== 'all' ||
                filters.tags.length > 0 ||
                filters.uploaders.length > 0 ||
                filters.search ||
                filters.sortBy !== 'uploadedAt' ||
                filters.sortOrder !== 'desc') && (
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear All
                </button>
              )}
            </div>

            <form className="filter-search" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by album, title, caption, or person"
              />
              <div className="search-actions">
                <button type="submit" className="search-btn">Search</button>
                {filters.search && (
                  <button type="button" className="clear-search-btn" onClick={handleSearchClear}>
                    Reset
                  </button>
                )}
              </div>
            </form>

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

            {/* Uploader Filter */}
            {stats.uploaders && stats.uploaders.length > 0 && (
              <div className="filter-group">
                <h4>Uploaded By</h4>
                <div className="uploader-list">
                  {stats.uploaders.map(uploader => (
                    <label key={uploader.id} className="uploader-option">
                      <input
                        type="checkbox"
                        checked={filters.uploaders.includes(uploader.id)}
                        onChange={() => handleUploaderToggle(uploader.id)}
                      />
                      <span>{uploader.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Sort Controls */}
            <div className="filter-group">
              <h4>Sort By</h4>
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="sort-select"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="sort-order">
                <button
                  type="button"
                  className={filters.sortOrder === 'asc' ? 'active' : ''}
                  onClick={() => handleSortOrderChange('asc')}
                >
                  Asc
                </button>
                <button
                  type="button"
                  className={filters.sortOrder === 'desc' ? 'active' : ''}
                  onClick={() => handleSortOrderChange('desc')}
                >
                  Desc
                </button>
              </div>
            </div>
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
                      <div className="photo-meta">
                        <span>{photo.year}</span>
                        {photo.uploadedBy && (
                          <span>
                            {photo.uploadedBy.firstName} {photo.uploadedBy.lastName}
                          </span>
                        )}
                      </div>
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