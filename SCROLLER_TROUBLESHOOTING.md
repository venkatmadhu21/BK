# 🔧 Scroller Troubleshooting Guide

## ✅ Quick Verification Checklist

Before troubleshooting, verify these basics:

- [ ] You are **logged in** (not on public homepage)
- [ ] You can see the **navigation bar** at the top
- [ ] You have **waited 3-5 seconds** for data to load
- [ ] You **refreshed the page** (Ctrl+F5)
- [ ] Your browser **console has no errors** (F12)

---

## 🔍 Step-by-Step Troubleshooting

### Issue 1: Scroller Not Visible at All

#### Step 1: Check Browser Console
```bash
Press: F12
Go to: Console tab
Look for: 📰 Fetched News: or 📅 Fetched Events:
```

**If you see messages** ✅
- Continue to "Issue 2: Shows Wrong Content"

**If you see RED ERRORS** ❌
- Screenshot the error
- Check the error details (see "Common Errors" section)

#### Step 2: Verify You're Logged In
```javascript
// In browser console, paste:
window.localStorage.getItem('token')
```

**If returns a long string** ✅
- You are logged in, continue

**If returns null** ❌
- Log out and log in again
- Verify your login credentials

#### Step 3: Check Network Requests
```bash
Press: F12
Go to: Network tab
Type in filter: "api"
Reload page: Ctrl+R
Look for: 
  - GET /api/news (green 200 status)
  - GET /api/events (green 200 status)
```

**If both show 200 status** ✅
- API is working

**If showing 401 or 403 errors** ❌
- Authentication issue
- Try logging out and in again

**If showing 404 errors** ❌
- API endpoint doesn't exist
- Backend might not be running

#### Step 4: Look at Page Source
```bash
Press: Ctrl+Shift+I (Windows) or Cmd+Option+I (Mac)
Go to: Elements tab
Search: Ctrl+F
Type: "Latest News"
```

**If found** ✅
- Component exists but might be hidden

**If not found** ❌
- Component not rendering
- Check console for React errors

---

### Issue 2: Shows "Loading news and events..." Message

This is **normal behavior** if:
- API calls are slow
- Database is loading data
- First time loading the page

#### Solution:
1. **Wait 5 seconds** for data to load
2. **Check the counter**:
   ```
   News items: 5 | Event items: 3
   ```
3. **Refresh if still loading** (Ctrl+R)

#### If Still Shows After 10 Seconds:
1. Open console (F12)
2. Look for error messages
3. Check network tab for failed requests
4. See "Common Errors" section

---

### Issue 3: Scroller Shows But No Cards Scroll

#### Possible Causes:

**Cause A: No Data in Database**
```bash
# In browser console:
console.log('News:', latestNews)
console.log('Events:', upcomingEvents)
```

If both show `[]` (empty arrays):
- Add test data to database
- See section: "Adding Test Data"

**Cause B: Scrolling is paused**
1. Look for ⏸️ button (should show ▶️ if paused)
2. Click it to resume
3. Try hovering over cards

**Cause C: Cards exist but scroll position is 0**
```bash
# In browser console, paste:
document.querySelector('[ref=scrollerRef]')?.scrollLeft
```

If shows `0` and doesn't change:
- Animation might not be running
- Check console for errors
- Try refreshing (Ctrl+F5)

---

### Issue 4: Scroller Scrolls Too Fast/Slow

#### To Adjust Speed:

1. Open file: `client/src/components/Scroller.jsx`
2. Find line 25:
   ```javascript
   scrollPosition += 0.5; // Change this number
   ```

3. Adjust the value:
   - **0.2** = Very slow (slow read)
   - **0.5** = Normal (default)
   - **1.0** = Fast
   - **2.0** = Very fast (ticker-like)

4. Save file
5. Browser auto-refreshes (if using dev server)
6. See the change immediately

---

### Issue 5: Scroller Position Wrong (Behind Content)

#### Solution 1: Clear CSS Cache
```bash
Press: Ctrl+Shift+Delete (Windows)
Choose: "Cookies and other site data"
Click: Delete Now
Refresh: Ctrl+F5
```

#### Solution 2: Check z-index
In browser console, paste:
```javascript
const scroller = document.querySelector('[class*="sticky"]');
console.log(window.getComputedStyle(scroller).zIndex);
```

Should show: **50** (z-50 in Tailwind = z-index: 50)

If different:
- Edit `Home.jsx` line 203
- Change `z-50` to `z-[9999]` for absolute top

---

### Issue 6: Cards Don't Show Details Properly

#### Check Card Content:

```bash
# In browser console, paste:
document.querySelectorAll('[class*="border-blue"]').forEach(el => {
  console.log(el.textContent);
});
```

**If showing "Untitled"** ❌
- News items missing title field
- Add test data with proper fields

**If showing correct titles** ✅
- Issue is CSS display
- Check Tailwind CSS is loaded

---

## 📋 Common Errors & Solutions

### Error: "GET /api/news 404"

```
Problem: API endpoint not found
Solution:
  1. Backend server not running
  2. Route not defined in server
  3. URL path incorrect

Fix:
  - Start backend: npm run server
  - Check route exists in server/routes/news.js
  - Verify API URL in client/utils/api.js
```

### Error: "GET /api/news 401"

```
Problem: Not authenticated
Solution:
  1. Token expired
  2. Token invalid
  3. Not logged in

Fix:
  - Log out: Click logout button
  - Clear cookies: Ctrl+Shift+Delete
  - Log back in
  - Try again
```

### Error: "Cannot read properties of undefined"

```
Problem: Data structure mismatch
Solution:
  - News/Event objects missing fields
  - API returning wrong format

Fix:
  - Check database data structure
  - Verify API response format
  - Run: db.news.findOne() in MongoDB
```

### Error: "TypeError: newsItems.slice is not a function"

```
Problem: newsItems is not an array
Solution:
  - API returned object instead of array
  - Data format mismatch

Fix:
  - Check API response format
  - Should return: { news: [...], events: [...] }
  - Verify /api/news returns array
```

---

## 🔧 Debug Mode - Advanced

### Enable Full Debug Logging:

Edit `client/src/components/Scroller.jsx` and add after line 42:

```javascript
// Add this debug code
console.group('🎯 Scroller Debug');
console.log('News Items:', newsItems);
console.log('Event Items:', eventItems);
console.log('Combined Items:', combinedItems);
console.log('Rendering:', combinedItems.length > 0 ? 'YES' : 'NO');
console.groupEnd();
```

Now open console (F12) and every update will show detailed info.

### Check Individual Item Data:

```javascript
// In browser console:
const newsItem = latestNews[0];
console.log('First News Item:');
console.log('Title:', newsItem.title);
console.log('Description:', newsItem.description);
console.log('Published:', newsItem.publishedDate);
console.log('Created:', newsItem.createdAt);
```

---

## 📊 Adding Test Data

### Via MongoDB Compass:

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select `balkrishna_nivas` database
4. Go to `news` collection
5. Click "Insert Document"
6. Paste:

```json
{
  "title": "Test News Article",
  "description": "This is a test news article",
  "content": "Full content of the test article goes here",
  "publishedDate": new Date(),
  "createdAt": new Date()
}
```

7. Repeat for `events` collection:

```json
{
  "name": "Test Event",
  "description": "This is a test event",
  "content": "Full content of the test event",
  "startDate": new Date(Date.now() + 7*24*60*60*1000),
  "date": new Date(Date.now() + 7*24*60*60*1000)
}
```

### Via Node.js Script:

Create `test-data.js`:

```javascript
const mongoose = require('mongoose');
const News = require('./server/models/News');
const Event = require('./server/models/Event');

mongoose.connect('mongodb://localhost:27017/balkrishna_nivas');

async function seedData() {
  await News.create({
    title: 'Test News',
    description: 'Test news description',
    publishedDate: new Date()
  });

  await Event.create({
    name: 'Test Event',
    description: 'Test event description',
    startDate: new Date(Date.now() + 7*24*60*60*1000)
  });

  console.log('✅ Test data added');
  process.exit(0);
}

seedData();
```

Then run:
```bash
node test-data.js
```

---

## 🎯 Verification Checklist for Each Component

### Home.jsx Verification:
- [ ] Scroller component imported
- [ ] Condition checks `isAuthenticated`
- [ ] Props pass `newsItems` and `eventItems`
- [ ] No console errors

### Scroller.jsx Verification:
- [ ] Receives props correctly
- [ ] Renders when items exist
- [ ] Shows loading message when empty
- [ ] Animation running (check scrollLeft value)

### API Endpoints Verification:
- [ ] `/api/news` returns array of news
- [ ] `/api/events` returns array of events
- [ ] Both return 200 status when authenticated
- [ ] Data has required fields

---

## 🆘 Emergency Fixes

### If Still Nothing Works:

1. **Full Page Refresh**
   ```bash
   Ctrl+Shift+Delete (clear cache)
   Ctrl+F5 (hard refresh)
   Ctrl+W (close tab)
   Open app again
   ```

2. **Clear All Cache**
   ```bash
   DevTools → Application → Clear site data
   Or: Settings → Privacy → Clear browsing data
   ```

3. **Restart Backend**
   ```bash
   npm run server
   (Stop with Ctrl+C first)
   ```

4. **Restart Frontend**
   ```bash
   npm run client
   (Stop with Ctrl+C first)
   ```

5. **Reset Database** (caution!)
   ```bash
   mongosh
   use balkrishna_nivas
   db.news.deleteMany({})
   db.events.deleteMany({})
   ```
   Then add test data again.

---

## 📞 Support Information

When asking for help, provide:

1. **Console output** (F12 → Console tab)
   - Screenshot of any errors
   - Copy paste log messages

2. **Network errors** (F12 → Network tab)
   - Status code of failed requests
   - Response body if available

3. **Your steps**
   - What you did before it broke
   - Exactly what you see
   - What you expected to see

4. **Environment**
   - OS (Windows/Mac/Linux)
   - Browser (Chrome/Firefox/Safari)
   - Are you logged in?
   - Have you added any data?

---

## ✅ Success Indicators

You'll know it's working when you see:

✅ Orange banner at top after login
✅ "Latest News & Events" header visible
✅ News and event cards scrolling smoothly
✅ Pause button responsive
✅ Hover effects working
✅ No console errors
✅ Cards showing proper content

---

**Still stuck? Check the browser console (F12) first - that's usually where the answer is! 🔍**