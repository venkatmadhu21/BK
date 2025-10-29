# Gallery & Album Feature - Setup Verification Checklist

## ✅ Pre-Deployment Verification

Use this checklist to verify the Gallery & Album feature is properly set up and ready for use.

---

## 1. Backend Setup

### Files Created/Modified
- [ ] `server/models/Album.js` exists
- [ ] `server/routes/gallery.js` exists
- [ ] `server/server.js` contains gallery route registration

### Verify Files
```bash
# Check if Album model exists
ls server/models/Album.js

# Check if gallery routes exist
ls server/routes/gallery.js

# Check server.js has gallery route
grep "gallery" server/server.js
```

### Database Ready
- [ ] MongoDB connection is working
- [ ] Can create new collections
- [ ] No schema conflicts with existing models

### Test Backend Endpoints

```bash
# 1. Start the server
npm run server

# 2. Open MongoDB console or use curl
# Test GET /api/gallery/stats
curl http://localhost:5000/api/gallery/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Expected: { years: [], tags: [], counts: { events: 0, news: 0, totalPhotos: 0 } }

# 3. Test creating an album (assuming you have an event ID)
curl -X POST http://localhost:5000/api/gallery/albums \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"Event","itemId":"your-event-id"}'

# Expected: Album object
```

---

## 2. Frontend Setup

### Files Created/Modified
- [ ] `client/src/pages/Gallery.jsx` exists
- [ ] `client/src/components/gallery/GalleryView.jsx` exists
- [ ] `client/src/components/gallery/GalleryView.css` exists
- [ ] `client/src/components/gallery/AlbumView.jsx` exists
- [ ] `client/src/components/gallery/AlbumView.css` exists
- [ ] `client/src/App.jsx` imports Gallery page
- [ ] `client/src/App.jsx` has `/gallery` route
- [ ] `client/src/components/layout/NavbarWithDropdown.jsx` includes Images icon
- [ ] `client/src/components/layout/NavbarWithDropdown.jsx` has gallery link

### Verify Files
```bash
# Check component files exist
ls client/src/pages/Gallery.jsx
ls client/src/components/gallery/GalleryView.jsx
ls client/src/components/gallery/GalleryView.css
ls client/src/components/gallery/AlbumView.jsx
ls client/src/components/gallery/AlbumView.css

# Check App.jsx includes Gallery import
grep "import Gallery" client/src/App.jsx

# Check route exists
grep "/gallery" client/src/App.jsx

# Check navbar has Images icon
grep "Images" client/src/components/layout/NavbarWithDropdown.jsx

# Check gallery link in navbar
grep "/gallery" client/src/components/layout/NavbarWithDropdown.jsx
```

---

## 3. Navigation Check

### In Navbar
- [ ] "Gallery" link appears in navigation menu
- [ ] Gallery link has Images icon
- [ ] Gallery link is positioned after Events link
- [ ] Gallery link only shows when authenticated

### Test Navigation
1. Start frontend: `npm run client`
2. Navigate to `http://localhost:3000`
3. Log in with test account
4. Check navbar for "Gallery" link
5. Click Gallery link - should navigate to `/gallery`

---

## 4. Gallery Page Functionality

### Access Gallery
```
Navigate to: http://localhost:3000/gallery
```

### Verify Features
- [ ] Page loads without errors
- [ ] Gallery header displays
- [ ] Statistics box shows (Total Photos, From Events, From News)
- [ ] Sidebar filters appear
- [ ] Filter buttons are clickable
- [ ] Photo grid appears (empty initially)
- [ ] Pagination controls appear (disabled if no photos)

### Console Check
- [ ] No JavaScript errors in console
- [ ] No 404 errors for API calls
- [ ] API call to `/api/gallery/stats` succeeds

### Browser DevTools
```javascript
// In console, verify API works:
fetch('/api/gallery/stats')
  .then(r => r.json())
  .then(d => console.log(d))
```

---

## 5. Test Album Creation

### Create Test Event
1. Navigate to Events page (`/events`)
2. Create a new event with:
   - Title: "Test Event for Gallery"
   - Description: "Testing gallery feature"
   - Date, Time, Venue (any values)
3. Submit form
4. Open the event detail page

### Verify Album Created
- [ ] Album section appears on event page
- [ ] Album title matches event title
- [ ] Album shows 0 photos initially
- [ ] "+ Add Photos" button appears (if you're the organizer)
- [ ] Album cover shows placeholder

---

## 6. Test Photo Upload

### Upload Test Photo

1. Click "+ Add Photos" on event album
2. Fill form:
   - Photo URL: `https://via.placeholder.com/400` (or any public image URL)
   - Caption: "Test photo"
   - Tags: "test, sample"
3. Click "Upload Photo"

### Verify Upload
- [ ] Photo appears in album grid immediately
- [ ] Photo thumbnail shows correctly
- [ ] Photo count updates to 1
- [ ] No errors in console
- [ ] Album cover image updates

### Verify Gallery Update
1. Navigate to Gallery (`/gallery`)
2. Verify:
   - [ ] Statistics update (Total Photos shows 1)
   - [ ] Photo appears in grid
   - [ ] "Event" filter shows count > 0
   - [ ] Tags filter includes uploaded tags

---

## 7. Test Filtering

### In Gallery Page

#### Type Filter
1. Check "Events" radio button
   - [ ] Only event photos show
2. Check "News" radio button
   - [ ] Only news photos show (if any)
3. Check "All" radio button
   - [ ] All photos show

#### Year Filter
1. Click year dropdown
   - [ ] Current year appears
   - [ ] Can select year
   - [ ] Photos filter by year

#### Tag Filter
1. Click a tag button
   - [ ] Tag highlights
   - [ ] Photos filter to show only that tag
2. Click another tag
   - [ ] Multiple tags can be selected
   - [ ] Photos show items with either tag
3. Click "Clear All"
   - [ ] All filters reset
   - [ ] All tags deselect

---

## 8. Test Photo Modal

### View Photo Details
1. Click any photo in gallery
2. Modal appears with:
   - [ ] Full-size image displays
   - [ ] Album title shows
   - [ ] Event/News source shows
   - [ ] Caption displays (if provided)
   - [ ] Tags display (if provided)
   - [ ] Uploader name shows
   - [ ] Close button (X) visible

### Close Modal
- [ ] Click X button - modal closes
- [ ] Click outside modal - modal closes
- [ ] Esc key - modal closes (bonus)

---

## 9. Test Pagination

### Prerequisites
- [ ] Upload at least 25 photos to have multiple pages

### Verify Pagination
1. In Gallery, scroll to bottom
   - [ ] Pagination controls appear
   - [ ] Current page shows
   - [ ] Next button available

2. Click "Next"
   - [ ] Page increments
   - [ ] New photos load
   - [ ] Previous button enabled

3. Click "Previous"
   - [ ] Page decrements
   - [ ] Previous photos show

---

## 10. Test Access Control

### With Album Owner
1. Create an album (event as organizer)
2. On album view:
   - [ ] "+ Add Photos" button appears
   - [ ] Delete buttons appear on photos (hover)

### With Different User
1. Log out
2. Log in as different user
3. View the album:
   - [ ] "+ Add Photos" button NOT visible
   - [ ] Delete buttons NOT visible
   - [ ] Can still view photos

### With Admin
1. Log in as admin user
2. View any album:
   - [ ] "+ Add Photos" button appears
   - [ ] Delete buttons appear (to delete any photo)

---

## 11. Test Responsive Design

### Desktop (1024px+)
- [ ] Sidebar appears on left
- [ ] Photos grid fills right side
- [ ] Filter panel sticky on scroll
- [ ] All controls accessible

### Tablet (768px-1023px)
- [ ] Sidebar appears above grid
- [ ] Grid adjusts column count
- [ ] Touch-friendly buttons

### Mobile (<768px)
- [ ] Sidebar appears above content
- [ ] Single column grid
- [ ] Large touch targets
- [ ] Buttons stacked properly

### Test
```javascript
// Resize browser window to test each breakpoint
// Or use DevTools > Toggle device toolbar
```

---

## 12. Test Error Handling

### Invalid Inputs
1. Try uploading with empty URL
   - [ ] Error message displays
   - [ ] Form doesn't submit

2. Try invalid photo URL
   - [ ] Error message displays

3. Network error
   - [ ] Loading state shows
   - [ ] Error message displays
   - [ ] Retry possible

### API Errors
- [ ] Missing token shows 401
- [ ] Invalid ID shows 404
- [ ] Server errors show proper message

---

## 13. Performance Checks

### Load Testing
1. Create multiple events with photos
2. Test Gallery with 100+ photos:
   - [ ] Page loads in < 3 seconds
   - [ ] No lag when filtering
   - [ ] Smooth scrolling

### Network
- [ ] Check DevTools Network tab
- [ ] No unnecessary API calls
- [ ] Images load efficiently
- [ ] CSS/JS files optimized

---

## 14. Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

### Known Issues to Check
- [ ] CSS gradients render correctly
- [ ] Flexbox/Grid layout works
- [ ] SVG icons display
- [ ] Modals layer correctly
- [ ] Animations smooth

---

## 15. Documentation Check

### Files Present
- [ ] `GALLERY_QUICK_START.md` exists
- [ ] `GALLERY_IMPLEMENTATION_GUIDE.md` exists
- [ ] `GALLERY_IMPLEMENTATION_SUMMARY.md` exists

### Documentation Quality
- [ ] All API endpoints documented
- [ ] Component props explained
- [ ] Usage examples provided
- [ ] Troubleshooting section exists

---

## 16. Final Integration Tests

### Event Page Integration
1. Go to event detail page
2. Look for Album section:
   - [ ] Album component appears
   - [ ] Album functions work
   - [ ] Photos display correctly

### News Page Integration
1. Go to news detail page
2. Look for Album section:
   - [ ] Album component appears
   - [ ] Album functions work

### Dashboard
1. Check dashboard doesn't break:
   - [ ] Dashboard loads
   - [ ] No console errors
   - [ ] All links work

---

## 17. Security Verification

### Authentication
- [ ] Cannot access gallery without login
- [ ] Cannot upload without authentication
- [ ] JWT token validation works

### Authorization
- [ ] Cannot delete others' photos
- [ ] Cannot edit others' captions
- [ ] Cannot delete private albums

### Input Validation
- [ ] Long URLs handled
- [ ] Special characters in captions work
- [ ] Tag XSS prevention works

---

## 18. Database Verification

### Collections
```javascript
// In MongoDB shell:
db.albums.count()           // Should be > 0
db.albums.find().limit(1)   // Check structure
db.albums.getIndexes()      // Check indexes exist
```

### Indexes Created
- [ ] { type: 1, itemId: 1 }
- [ ] { year: 1 }
- [ ] { tags: 1 }
- [ ] { createdAt: -1 }

---

## ✅ Pre-Launch Checklist

### Critical (Must Fix)
- [ ] No JavaScript errors in console
- [ ] Gallery page loads
- [ ] API endpoints respond
- [ ] Photos can be uploaded
- [ ] Gallery displays photos
- [ ] Navigation link works

### Important (Should Fix)
- [ ] Responsive design works on mobile
- [ ] Filtering works correctly
- [ ] Access control enforced
- [ ] Error messages display

### Nice to Have (Can Defer)
- [ ] Performance optimizations
- [ ] Additional customizations
- [ ] Extended browser testing

---

## 🚀 Deployment Steps

1. **Code Review**
   - [ ] All files reviewed and approved
   - [ ] No console warnings/errors
   - [ ] All dependencies installed

2. **Testing**
   - [ ] All verification checks passed
   - [ ] User acceptance testing done
   - [ ] No critical bugs found

3. **Backup**
   - [ ] Database backed up
   - [ ] Previous version saved
   - [ ] Rollback plan ready

4. **Deploy**
   ```bash
   # Production deployment
   npm run build
   # Deploy to production environment
   ```

5. **Post-Deploy**
   - [ ] Verify all features work in production
   - [ ] Monitor error logs
   - [ ] Collect user feedback

---

## 📋 Quick Reference

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Gallery page blank | Check API response in console |
| Photos not uploading | Verify photo URL is valid |
| Filters not working | Clear cache and refresh |
| Navbar link missing | Check NavbarWithDropdown.jsx |
| 401 errors | Ensure user is authenticated |
| Album not appearing | Verify event/news is public |

---

## 📞 Support Contacts

- API Issues → Check `server/routes/gallery.js`
- Frontend Issues → Check `client/src/components/gallery/`
- Styling Issues → Check CSS files in gallery folder
- Database Issues → Check Album model
- Documentation → See guide files

---

## ✨ Congratulations!

If all checkboxes are marked ✅, the Gallery & Album feature is ready for production use!

---

**Last Updated**: 2024
**Version**: 1.0
**Status**: Production Ready