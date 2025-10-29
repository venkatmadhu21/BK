import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import './AlbumView.css';

const AlbumView = ({ itemType, itemId, item, user }) => {
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    url: '',
    caption: '',
    tags: ''
  });
  const [uploading, setUploading] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);

  useEffect(() => {
    fetchOrCreateAlbum();
  }, [itemType, itemId]);

  const fetchOrCreateAlbum = async () => {
    try {
      setLoading(true);
      
      // First check if album exists
      const response = await api.get(`/api/gallery/albums/item/${itemType}/${itemId}`);
      
      if (!response.data) {
        // Create album if it doesn't exist
        const createResponse = await api.post('/api/gallery/albums', {
          type: itemType,
          itemId
        });
        setAlbum(createResponse.data);
      } else {
        setAlbum(response.data);
      }
      setError('');
    } catch (err) {
      setError('Error loading album');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.url.trim()) {
      setError('Photo URL is required');
      return;
    }

    try {
      setUploading(true);
      const photoData = {
        url: uploadData.url,
        caption: uploadData.caption,
        tags: uploadData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag)
      };

      const response = await api.post(
        `/api/gallery/albums/${album._id}/photos`,
        photoData
      );

      setAlbum(response.data);
      setUploadData({ url: '', caption: '', tags: '' });
      setShowUploadForm(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading photo');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Delete this photo?')) return;

    try {
      const response = await api.delete(
        `/api/gallery/albums/${album._id}/photos/${photoId}`
      );
      setAlbum(response.data);
      setSelectedPhoto(null);
    } catch (err) {
      setError('Error deleting photo');
      console.error(err);
    }
  };

  const canManageAlbum = user && (
    user._id === album?.createdBy._id || 
    user._id === item?.organizer?._id || 
    user._id === item?.author?._id ||
    user.isAdmin
  );

  if (loading) {
    return <div className="album-loading">Loading album...</div>;
  }

  if (!album) {
    return <div className="album-error">Album not found</div>;
  }

  return (
    <div className="album-container">
      <div className="album-header">
        <div className="album-cover">
          {album.coverImage ? (
            <img src={album.coverImage.thumbnail || album.coverImage.url} alt="Album cover" />
          ) : (
            <div className="album-cover-empty">No photos yet</div>
          )}
        </div>
        <div className="album-info">
          <h2>{album.title}</h2>
          <p className="album-meta">
            <span className="album-type">{album.type}</span>
            <span className="album-year">{album.year}</span>
            <span className="album-count">{album.photoCount} photos</span>
          </p>
          {album.description && (
            <p className="album-description">{album.description}</p>
          )}
          {album.tags.length > 0 && (
            <div className="album-tags">
              {album.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && <div className="album-error-msg">{error}</div>}

      {canManageAlbum && (
        <div className="album-actions">
          <button 
            className="upload-btn"
            onClick={() => setShowUploadForm(!showUploadForm)}
          >
            {showUploadForm ? 'Cancel' : '+ Add Photos'}
          </button>
        </div>
      )}

      {/* Upload Form */}
      {showUploadForm && canManageAlbum && (
        <form className="upload-form" onSubmit={handlePhotoUpload}>
          <div className="form-group">
            <label>Photo URL *</label>
            <input
              type="url"
              value={uploadData.url}
              onChange={(e) => setUploadData({ ...uploadData, url: e.target.value })}
              placeholder="https://example.com/photo.jpg"
              required
            />
          </div>
          <div className="form-group">
            <label>Caption</label>
            <textarea
              value={uploadData.caption}
              onChange={(e) => setUploadData({ ...uploadData, caption: e.target.value })}
              placeholder="Add a caption for the photo..."
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              value={uploadData.tags}
              onChange={(e) => setUploadData({ ...uploadData, tags: e.target.value })}
              placeholder="wedding, celebration, family"
            />
          </div>
          <button type="submit" disabled={uploading} className="submit-btn">
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </form>
      )}

      {/* Photos Grid */}
      {album.photoCount === 0 ? (
        <div className="album-empty">
          <p>No photos yet. {canManageAlbum && 'Click "Add Photos" to upload some!'}</p>
        </div>
      ) : (
        <div className="photos-grid">
          {album.photos.map((photo) => (
            <div 
              key={photo._id} 
              className="photo-item"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="photo-thumbnail">
                <img src={photo.thumbnail || photo.url} alt={photo.caption} />
                {canManageAlbum && (
                  <div className="photo-actions">
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhoto(photo._id);
                      }}
                      title="Delete photo"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
              {photo.caption && (
                <p className="photo-caption">{photo.caption}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="photo-modal" onClick={() => setSelectedPhoto(null)}>
          <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPhoto(null)}>×</button>
            <img src={selectedPhoto.url} alt={selectedPhoto.caption} className="modal-image" />
            <div className="modal-info">
              {selectedPhoto.caption && (
                <p><strong>Caption:</strong> {selectedPhoto.caption}</p>
              )}
              {selectedPhoto.tags.length > 0 && (
                <div className="modal-tags">
                  <strong>Tags:</strong>
                  <div className="tags-list">
                    {selectedPhoto.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              <p className="photo-meta">
                <strong>Uploaded by:</strong> {selectedPhoto.uploadedBy?.firstName} {selectedPhoto.uploadedBy?.lastName}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumView;