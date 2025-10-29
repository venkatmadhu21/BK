# Gallery & Album Feature Implementation Guide

## Overview

The Gallery and Album system allows family members to:
- **Browse** all photos from events and news in one unified gallery
- **Filter** photos by event type (Event/News), year, and tags
- **Create Albums** automatically when events/news are created
- **Upload Photos** to event or news albums
- **Manage** photos with captions and tags

---

## Features

### 1. Gallery View (`/gallery`)
- **Unified Photo Browser**: View all event and news photos in one place
- **Advanced Filtering**:
  - Filter by Source Type (Events/News/All)
  - Filter by Year
  - Filter by Tags
  - Clear all filters with one click
- **Photo Statistics**: Display total photos, photos from events, photos from news
- **Responsive Grid**: Photos displayed in an auto-responsive grid
- **Photo Details Modal**: Click any photo to see full resolution and details
- **Pagination**: Navigate through large photo collections

### 2. Album System
- **Automatic Album Creation**: Albums are auto-created when events/news are created
- **Photo Management**: Upload, view, edit, and delete photos in albums
- **Album Metadata**:
  - Title (auto-populated from event/news title)
  - Description
  - Cover image (first photo uploaded)
  - Tags (auto-collected from uploaded photos)
  - Year (auto-extracted from event/news date)
  - Access control (public/private)

### 3. Photo Upload
- **URL-based Upload**: Upload photos via URL (supports Cloudinary, external sources)
- **Photo Metadata**:
  - Caption (optional)
  - Tags (comma-separated)
  - Uploader information (automatically recorded)
- **Access Control**: Only album creators, event organizers, or admins can upload

---

## Backend Architecture

### Models

#### Album Model (`server/models/Album.js`)
```javascript
{
  type: 'Event' | 'News',           // Enum: type of source
  itemId: ObjectId,                  // Reference to Event or News
  title: String,                     // Auto-populated
  description: String,               // From event/news description
  photos: [{
    url: String,                     // Photo URL
    thumbnail: String,               // Thumbnail URL
    caption: String,                 // User-provided caption
    tags: [String],                  // Photo-specific tags
    uploadedBy: ObjectId,            // User who uploaded
    uploadedAt: Date
  }],
  tags: [String],                    // Album-level tags (aggregated)
  year: Number,                      // Auto-extracted year
  createdBy: ObjectId,               // Album creator
  isPublic: Boolean,                 // Visibility
  coverImage: {                      // Album cover/thumbnail
    url: String,
    thumbnail: String
  },
  photoCount: Number,                // Total photos in album
  timestamps: true
}
```

### API Endpoints

#### Gallery Endpoints

**GET `/api/gallery`** - Get all photos with filters
```javascript
Query Parameters:
  - type: 'all' | 'Event' | 'News' (default: 'all')
  - year: number or 'all' (default: 'all')
  - tags: comma-separated string (default: '')
  - page: number (default: 1)
  - limit: number (default: 20)

Response:
{
  photos: [photo objects with album info],
  totalPages: number,
  currentPage: number,
  total: number
}
```

**GET `/api/gallery/stats`** - Get gallery statistics
```javascript
Response:
{
  years: [2024, 2023, 2022, ...],
  tags: ['wedding', 'celebration', ...],
  counts: {
    events: number,
    news: number,
    totalPhotos: number
  }
}
```

#### Album Endpoints

**GET `/api/gallery/albums/item/:type/:itemId`** - Get album for specific event/news
```javascript
Response: Album object or null
```

**POST `/api/gallery/albums`** - Create album for event/news
```javascript
Body:
{
  type: 'Event' | 'News',
  itemId: ObjectId
}

Response: Album object
```

**POST `/api/gallery/albums/:albumId/photos`** - Add photo to album
```javascript
Body:
{
  url: String,
  thumbnail: String (optional),
  caption: String (optional),
  tags: [String] (optional)
}

Response: Updated album object
```

**PUT `/api/gallery/albums/:albumId/photos/:photoId`** - Update photo info
```javascript
Body:
{
  caption: String (optional),
  tags: [String] (optional)
}

Response: Updated album object
```

**DELETE `/api/gallery/albums/:albumId/photos/:photoId`** - Delete photo
```javascript
Response: Updated album object
```

**DELETE `/api/gallery/albums/:albumId`** - Delete entire album
```javascript
Response: { message: 'Album deleted' }
```

---

## Frontend Components

### GalleryView Component (`client/src/components/gallery/GalleryView.jsx`)
Main gallery page with filtering and browsing capabilities.

**Props**: None (uses API directly)

**State**:
- photos: Array of photo objects
- stats: Gallery statistics
- selectedPhoto: Currently selected photo for modal
- loading: Loading state
- filters: Active filters (type, year, tags)
- page: Current page number

**Features**:
- Real-time filter updates
- Pagination support
- Photo modal with details
- Tag-based filtering
- Year filter dropdown
- Type (Event/News) radio buttons

### AlbumView Component (`client/src/components/gallery/AlbumView.jsx`)
Display and manage photos for a specific event or news item.

**Props**:
```javascript
{
  itemType: 'Event' | 'News',        // Type of item
  itemId: string,                    // MongoDB ObjectId
  item: Object,                      // Event or News object
  user: Object                       // Current user
}
```

**State**:
- album: Album object
- loading: Loading state
- showUploadForm: Show/hide upload form
- uploadData: Form data for new photo
- selectedPhoto: Currently selected photo

**Features**:
- Auto-create album if doesn't exist
- Photo upload form
- Photo grid with editing
- Photo deletion with confirmation
- Full photo modal view
- Access control (only authorized users can edit)

---

## Integration Points

### In Events Page
```jsx
import AlbumView from '../components/gallery/AlbumView';

// Inside Event Detail View
<AlbumView 
  itemType="Event"
  itemId={event._id}
  item={event}
  user={user}
/>
```

### In News Page
```jsx
import AlbumView from '../components/gallery/AlbumView';

// Inside News Detail View
<AlbumView 
  itemType="News"
  itemId={news._id}
  item={news}
  user={user}
/>
```

---

## Usage Examples

### Example 1: Browse Gallery with Filters
1. Navigate to `/gallery`
2. Use filters on the left sidebar:
   - Select "Events" to see only event photos
   - Select year "2024" to see photos from 2024
   - Click tag "wedding" to filter by wedding photos
3. Browse results in the grid
4. Click any photo to see full resolution and details
5. Use pagination to see more photos

### Example 2: Upload Photos to Event Album
1. Go to an event detail page
2. Find the Album section showing the event's photos
3. Click "+ Add Photos" button
4. Fill in the form:
   - **Photo URL**: Paste URL to the photo (e.g., Cloudinary URL)
   - **Caption**: Add a caption like "Group photo from celebration"
   - **Tags**: Add tags like "celebration, group, 2024"
5. Click "Upload Photo"
6. Photo appears in the album and gallery

### Example 3: Manage Album Photos
1. In an event/news album, hover over any photo
2. Click the delete button (trash icon) to remove it
3. Click any photo to see details:
   - Caption
   - Tags
   - Who uploaded it
   - When it was uploaded
4. Filter gallery by the event/news to see all its photos

---

## Database Migrations

Run these to set up the Album model:

```javascript
// In mongosh or MongoDB Compass, run:
db.albums.createIndex({ type: 1, itemId: 1 });
db.albums.createIndex({ year: 1 });
db.albums.createIndex({ tags: 1 });
db.albums.createIndex({ createdAt: -1 });
```

---

## Configuration

### Environment Variables
No additional environment variables needed for the gallery system.

### Cloudinary Integration
Photos are uploaded to your existing Cloudinary account via URLs. The frontend expects:
- User provides image URL (from Cloudinary or external source)
- System stores the URL directly
- No server-side image processing required

---

## Styling & Responsive Design

### Breakpoints
- **Desktop** (1024px+): Full sidebar + grid layout
- **Tablet** (768px-1023px): Collapsible sidebar, responsive grid
- **Mobile** (< 768px): Stacked layout, single column grid

### Color Scheme
- Primary: #3498db (Blue)
- Success: #27ae60 (Green)
- Danger: #e74c3c (Red)
- Background: Linear gradients with light colors
- Text: #2c3e50 (Dark gray)

---

## Security Considerations

### Access Control
- ✅ Album can only be managed by:
  - Album creator
  - Event organizer
  - News author
  - Admin users
- ✅ Photos viewable only if album isPublic = true
- ✅ All routes require authentication (except public galleries)

### Data Validation
- URL format validation for photos
- Tag length limits
- Caption length limits (max 1000 chars)
- Album description limits

---

## Performance Optimization

### Indexes
All necessary indexes are created for:
- type + itemId queries (album lookups)
- year queries (gallery filtering)
- tags queries (tag filtering)
- createdAt queries (sorting)

### Pagination
- Default 20 photos per page
- Configurable via limit parameter
- Prevents loading all photos at once

### Image Optimization
- Thumbnail URLs stored for faster loading
- Full image URLs available in modal
- Lazy loading friendly structure

---

## Troubleshooting

### Album not appearing
- Check if event/news isPublic/isPublished = true
- Verify Album creation endpoint was called
- Check MongoDB connection

### Photos not uploading
- Verify URL is valid and accessible
- Check user has permission (is event organizer/album creator/admin)
- Verify photoCount updates correctly

### Filter not working
- Clear browser cache
- Check year is numeric
- Verify tags are correctly formatted (comma-separated)

### Pagination issues
- Verify totalPages calculation
- Check if page is within valid range
- Ensure limit parameter is positive

---

## Future Enhancements

1. **Image Compression**: Auto-compress uploaded images
2. **Album Sharing**: Create shareable album links
3. **Photo Comments**: Add comment system to photos
4. **Photo Ratings**: Allow family to rate photos
5. **Batch Upload**: Upload multiple photos at once
6. **Photo Organization**: Drag-to-reorder photos in album
7. **Image Filters**: Apply filters in browser before upload
8. **Face Recognition**: Auto-tag people in photos
9. **Album Creation**: Manual album creation for grouping
10. **Download Album**: Download all photos as ZIP

---

## Support & Documentation

For issues or questions:
1. Check console for error messages
2. Verify API endpoints are responding
3. Check MongoDB logs for database errors
4. Verify authentication tokens are valid
5. Check user permissions (role, isAdmin flag)

---

## Related Files

- Backend Model: `server/models/Album.js`
- Backend Routes: `server/routes/gallery.js`
- Frontend Gallery: `client/src/components/gallery/GalleryView.jsx`
- Frontend Album: `client/src/components/gallery/AlbumView.jsx`
- Gallery Page: `client/src/pages/Gallery.jsx`
- App Routes: `client/src/App.jsx`
- Navbar: `client/src/components/layout/NavbarWithDropdown.jsx`
- Server Config: `server/server.js`