# Gallery & Album Feature - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. **Backend is Ready** ✅
- Album model created: `server/models/Album.js`
- Gallery routes created: `server/routes/gallery.js`
- Routes registered in `server/server.js`

### 2. **Frontend is Ready** ✅
- Gallery component: `client/src/components/gallery/GalleryView.jsx`
- Album component: `client/src/components/gallery/AlbumView.jsx`
- Gallery page: `client/src/pages/Gallery.jsx`
- Navigation link added in navbar

### 3. **Start Using**

#### Access the Gallery
```
Navigate to: http://localhost:3000/gallery
(Or click "Gallery" in the navigation menu)
```

#### View Gallery
- Browse all event and news photos
- Use filters on the left sidebar
- Click photos to view full size
- Use pagination to see more

---

## 🎥 How to Use - For Family Members

### Upload Photos to an Event

1. **Find the Event**
   - Go to `/events`
   - Click on an event to view details

2. **Find the Album Section**
   - Scroll down to the "Album" section
   - You'll see a cover image and upload button

3. **Upload a Photo**
   - Click "+ Add Photos" button
   - Fill in the form:
     - **Photo URL**: Paste a link to your photo
     - **Caption**: Describe the photo (optional)
     - **Tags**: Add tags like "celebration, wedding" (optional)
   - Click "Upload Photo"

4. **View Your Photos**
   - Photos appear immediately in the album
   - They also show up in the main gallery with filters

### Browse the Gallery

1. **Access Gallery**
   - Click "Gallery" in navigation menu
   - Or go to `/gallery`

2. **Filter Photos**
   - **By Type**: Select "Events" or "News" or "All"
   - **By Year**: Select a year from dropdown
   - **By Tags**: Click tags to filter by them
   - Click "Clear All" to reset filters

3. **View Photos**
   - Click any photo to see full size
   - View caption, tags, and who uploaded it
   - Use "Next/Previous" buttons at bottom or scroll

### Upload Photos to News

Same process as events:
1. Go to a news article
2. Find the Album section
3. Click "+ Add Photos"
4. Upload your photo with caption and tags

---

## 🔧 How to Integrate - For Developers

### Add Album to Event Detail Page

```jsx
import AlbumView from '../components/gallery/AlbumView';

function EventDetail() {
  const [event, setEvent] = useState(null);
  const { user } = useAuth();

  return (
    <div>
      <h1>{event.title}</h1>
      
      {/* Add Album Section */}
      <section className="mt-8 border-t pt-8">
        <h2>Event Media</h2>
        <AlbumView 
          itemType="Event"
          itemId={event._id}
          item={event}
          user={user}
        />
      </section>
    </div>
  );
}
```

### Add Album to News Detail Page

```jsx
import AlbumView from '../components/gallery/AlbumView';

function NewsDetail() {
  const [news, setNews] = useState(null);
  const { user } = useAuth();

  return (
    <div>
      <h1>{news.title}</h1>
      
      {/* Add Album Section */}
      <section className="mt-8 border-t pt-8">
        <h2>News Media</h2>
        <AlbumView 
          itemType="News"
          itemId={news._id}
          item={news}
          user={user}
        />
      </section>
    </div>
  );
}
```

### Add Gallery Link in Custom Components

```jsx
import { Link } from 'react-router-dom';
import { Images } from 'lucide-react';

function MyComponent() {
  return (
    <Link to="/gallery" className="flex items-center gap-2">
      <Images size={20} />
      View Gallery
    </Link>
  );
}
```

---

## 📊 API Quick Reference

### Get All Photos with Filters
```javascript
// Frontend
const response = await axios.get('/api/gallery', {
  params: {
    type: 'Event',  // 'Event' | 'News' | 'all'
    year: 2024,
    tags: 'wedding,celebration',
    page: 1,
    limit: 20
  }
});
```

### Get Gallery Statistics
```javascript
const response = await axios.get('/api/gallery/stats');
// Returns: years, tags, counts
```

### Create/Get Album
```javascript
const response = await axios.post('/api/gallery/albums', {
  type: 'Event',
  itemId: 'event-id-here'
});
```

### Upload Photo to Album
```javascript
const response = await axios.post(
  '/api/gallery/albums/:albumId/photos',
  {
    url: 'https://example.com/photo.jpg',
    caption: 'Group photo',
    tags: ['celebration', 'family']
  }
);
```

### Delete Photo
```javascript
const response = await axios.delete(
  '/api/gallery/albums/:albumId/photos/:photoId'
);
```

---

## 🎨 Customization

### Change Colors
Edit `client/src/components/gallery/GalleryView.css`:

```css
/* Change primary color */
--primary-color: #3498db;  /* Change this */

/* Change success color */
--success-color: #27ae60;  /* Change this */
```

### Change Photos Per Page
Edit `GalleryView.jsx`:

```javascript
const PHOTOS_PER_PAGE = 20;  // Change this to 30, 50, etc.
```

### Change Grid Size
Edit `GalleryView.css`:

```css
.photos-grid {
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  /* Change 180px to make photos smaller/larger */
}
```

---

## ✅ What's Included

### Backend
- ✅ Album MongoDB model with all fields
- ✅ 7 API endpoints for gallery operations
- ✅ Full CRUD operations for albums and photos
- ✅ Access control and authorization
- ✅ Auto-indexing for performance

### Frontend
- ✅ Gallery view with advanced filtering
- ✅ Album management component
- ✅ Photo upload form with validation
- ✅ Full-size photo modal viewer
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Pagination support
- ✅ Loading and error states
- ✅ Styled components with CSS

### Navigation
- ✅ Gallery link in main navbar
- ✅ Route registered in App.jsx
- ✅ Private route with authentication

---

## 🚀 Next Steps

1. **Test the Feature**
   - Navigate to `/gallery`
   - Create an event or news article
   - Upload photos to its album
   - View photos in the gallery with filters

2. **Integrate into Pages**
   - Add `<AlbumView />` to event detail pages
   - Add `<AlbumView />` to news detail pages
   - Test photo uploads and viewing

3. **Customize Styling**
   - Adjust colors to match your theme
   - Modify grid sizes for different screen sizes
   - Update typography to match your design system

4. **Deploy**
   - Test thoroughly on all browsers
   - Test on mobile devices
   - Deploy to production

---

## ❓ FAQ

**Q: Where are photos stored?**
A: Photos are hosted externally (Cloudinary, your server, or any public URL). The system stores the URL references.

**Q: Can I upload photos by file upload?**
A: Currently supports URL-based uploads. To add file upload, see "Future Enhancements" section.

**Q: Who can upload photos?**
A: Event organizer, news author, album creator, or admins.

**Q: Can anyone see the photos?**
A: Yes, if the event/news is public. Private events/news won't show photos in the gallery.

**Q: How many photos can I upload?**
A: Unlimited! System handles large photo counts with pagination.

**Q: Are photos permanent?**
A: Photos can be deleted by the uploader or admins. Album can be deleted by creator or admins.

**Q: Can I edit photo captions?**
A: Yes, click the photo and editing is available for the uploader.

**Q: What formats are supported?**
A: Any format supported by your image hosting (JPG, PNG, WebP, etc.).

---

## 🐛 Troubleshooting

### Gallery page shows no photos
- Verify events/news are created and public
- Check browser console for errors
- Verify API is responding at `/api/gallery/stats`

### Can't upload photos
- Check if you're the event organizer or admin
- Verify photo URL is valid and publicly accessible
- Check browser console for specific error

### Photos not appearing in gallery
- Verify album was created for the event/news
- Check if event/news is public (isPublic: true)
- Try refreshing the page

### Pagination not working
- Check if you have more than 20 photos
- Verify page parameter is being sent to API
- Check browser console for errors

---

## 📚 Complete File List

```
Backend:
├── server/models/Album.js
├── server/routes/gallery.js
└── server/server.js (updated)

Frontend:
├── client/src/pages/Gallery.jsx
├── client/src/components/gallery/
│   ├── GalleryView.jsx
│   ├── GalleryView.css
│   ├── AlbumView.jsx
│   └── AlbumView.css
├── client/src/App.jsx (updated)
└── client/src/components/layout/NavbarWithDropdown.jsx (updated)

Documentation:
├── GALLERY_IMPLEMENTATION_GUIDE.md
└── GALLERY_QUICK_START.md (this file)
```

---

## 📞 Support

Check the **GALLERY_IMPLEMENTATION_GUIDE.md** for:
- Detailed API documentation
- Component prop definitions
- Integration examples
- Performance optimization tips
- Security considerations
- Future enhancement ideas

For issues, check console errors and verify API endpoints are responding correctly.

Happy uploading! 📸