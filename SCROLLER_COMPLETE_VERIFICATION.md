# 🔍 Scroller - Complete Verification Guide (News + Events)

## ✅ Current Configuration Status

### What's Already Set Up:

| Feature | Status | Details |
|---------|--------|---------|
| **News Display** | ✅ Working | Blue badge 📰, shows `content` field |
| **Events Display** | ✅ Working | Purple badge 📅, shows `description` field |
| **Data Passing** | ✅ Configured | Home.jsx passes both `latestNews` & `upcomingEvents` |
| **Field Mapping** | ✅ Fixed | Scroller correctly maps all fields |
| **API Routes** | ✅ Ready | Both `/api/news` and `/api/events` configured |

---

## 🚀 Step-by-Step Verification

### Step 1: Ensure MongoDB is Running

```powershell
# Windows - Check MongoDB service
Get-Service MongoDB

# If "Stopped", start it:
Start-Service MongoDB

# Or start mongod manually:
mongod --dbpath "C:\data\db"
```

### Step 2: Add Sample Events to Database

```powershell
# Navigate to project root
Set-Location "c:\Users\USER\Desktop\Bal-krishna Nivas"

# Run the sample events script
node add-test-events.js
```

**Expected Output:**
```
✅ Sample Events Added:
1. 🎉 Birthday Celebration
   Type: Birthday
   Date: 2/20/2025
   Status: Upcoming
2. 💒 Family Wedding
...
✅ Done! Events are ready for the Scroller.
```

### Step 3: Verify Data in MongoDB

```powershell
mongosh
```

Then in mongosh shell:
```javascript
use bal-krishna-nivas

// Check news count
db.news.countDocuments({ isPublished: true })

// Check events count
db.events.countDocuments({ status: 'Upcoming' })

// View sample events
db.events.find({ status: 'Upcoming' }).pretty()

// View sample news
db.news.find({ isPublished: true }).pretty()

exit
```

### Step 4: Start the Application

```powershell
# Terminal 1: Start backend
npm run server

# Terminal 2: Start frontend
Set-Location "client"; npm start
```

### Step 5: Test in Browser

1. **Log In** to the application
2. **Open Home Page** - you should see the Scroller at the top
3. **Open Browser Console** (F12 → Console tab)
4. **Look for these logs:**
   ```
   📰 Fetched News: [...]        ← News items
   📅 Fetched Events: [...]      ← Events items
   🔍 Scroller Debug - News Items: X, Event Items: Y  ← Combined count
   ```

### Step 6: Visual Verification

The Scroller should display:

✅ **Top Row Header:**
```
📰 News & Events 📅  [Pause/Play Button]
```

✅ **Two Types of Cards (Continuous Loop):**
- **Blue Cards (📰 NEWS)** - showing news from `content` field
- **Purple Cards (📅 EVENT)** - showing events from `description` field

✅ **Each Card Shows:**
- Badge icon & type label
- Published/Event date
- Title (max 2 lines)
- Description (max 60 chars, truncated with `...`)

---

## 🐛 Troubleshooting

### Issue: Scroller Shows "Loading news and events..."

**Cause:** No data in database or MongoDB not connected

**Fix:**
```powershell
# 1. Verify MongoDB is running
Get-Service MongoDB

# 2. Add sample data
node add-test-events.js

# 3. Restart the app
```

### Issue: Only News Shows, No Events

**Diagnosis:**
```javascript
// In mongosh:
db.events.countDocuments({ status: 'Upcoming' })
```

**Solution:**
- Events must have `status: 'Upcoming'` to appear
- Run `add-test-events.js` to create sample upcoming events

### Issue: Console Shows "Failed to fetch events"

**Check:**
1. Is MongoDB running? → Start it with `Start-Service MongoDB`
2. Is the events API responding? → Check server logs for errors
3. Is JWT token valid? → Log out and log back in

**Debug API Response:**
```powershell
# In PowerShell (after login, use your token):
$headers = @{ "Authorization" = "Bearer YOUR_JWT_TOKEN" }

# Test events endpoint
Invoke-WebRequest -Uri "http://localhost:5000/api/events?status=Upcoming&limit=5" `
  -Headers $headers | ConvertFrom-Json

# Test news endpoint
Invoke-WebRequest -Uri "http://localhost:5000/api/news?limit=10" `
  -Headers $headers | ConvertFrom-Json
```

### Issue: Events Show But No Data Visible

**Check Field Names:**

In browser console, expand the network response to verify:
- Events have: `startDate`, `description`, `eventType`
- News has: `publishDate`, `content`, `title`

---

## 📊 Database Schema Reference

### News Collection Fields
```javascript
{
  _id: ObjectId,
  title: String,           // Required
  content: String,         // Required (Displayed in Scroller)
  category: String,        // enum: ['Announcement', 'Celebration', 'Achievement', 'Milestone', 'Other']
  author: ObjectId,        // Reference to User
  isPublished: Boolean,    // Must be TRUE to appear
  publishDate: Date,       // Used for sorting
  priority: String,        // enum: ['Low', 'Medium', 'High']
  createdAt: Date,
  updatedAt: Date
}
```

### Events Collection Fields
```javascript
{
  _id: ObjectId,
  title: String,           // Required
  description: String,     // Required (Displayed in Scroller)
  eventType: String,       // enum: ['Birthday', 'Anniversary', 'Wedding', 'Festival', ...]
  startDate: Date,         // Used for sorting
  endDate: Date,
  startTime: String,       // e.g., "10:00 AM"
  endTime: String,
  venue: {
    name: String,
    address: { city, state, country }
  },
  organizer: ObjectId,     // Reference to User
  status: String,          // enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled']
  priority: String,        // enum: ['Low', 'Medium', 'High']
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📝 Quick Commands Cheat Sheet

```powershell
# Start MongoDB (Windows)
Start-Service MongoDB

# Add test data
node add-test-events.js

# Connect to MongoDB shell
mongosh

# Check events in shell
use bal-krishna-nivas
db.events.countDocuments({ status: 'Upcoming' })

# Start backend
npm run server

# Start frontend
cd client; npm start
```

---

## ✨ Expected Behavior After Fix

1. ✅ **Home page loads** → Scroller appears at top (if authenticated)
2. ✅ **Scroller displays** → Mix of News (blue) and Events (purple) cards
3. ✅ **Cards auto-scroll** → Continuous horizontal scrolling
4. ✅ **Hover to pause** → Mouse hover stops scrolling
5. ✅ **Click play/pause button** → Toggle scroll animation
6. ✅ **Each card shows** → Icon, date, title, description excerpt

---

## 🎯 Success Criteria

- [ ] MongoDB is running and connected
- [ ] Database has sample news (with `isPublished: true`)
- [ ] Database has sample events (with `status: 'Upcoming'`)
- [ ] Browser console shows "📰 Fetched News" and "📅 Fetched Events" logs
- [ ] Scroller displays both news cards (blue) and event cards (purple)
- [ ] Cards scroll horizontally continuously
- [ ] No console errors about field mappings

---

## 💡 Pro Tips

1. **Adding Your Own Data:**
   ```javascript
   // In mongosh, add news:
   db.news.insertOne({
     title: "Your News",
     content: "Your news content here",
     isPublished: true,
     publishDate: new Date(),
     author: ObjectId("admin-user-id")
   })
   ```

2. **Testing Different Statuses:**
   - Events with `status: 'Upcoming'` → Show in Scroller
   - Events with `status: 'Completed'` → Don't show (filtered out)
   - News with `isPublished: false` → Don't show (filtered out)

3. **Performance Optimization:**
   - Scroller displays top 2 news + top 2 events = 4 items
   - Items are duplicated for continuous loop = 8 rendered cards
   - Smooth scrolling at 1.5px per frame

---

## 🆘 Still Need Help?

If Scroller still isn't showing events after these steps:

1. **Check Browser Console (F12):**
   - Look for error messages
   - Verify "Fetched Events" log shows array with items

2. **Check Server Logs:**
   - Look for any database connection errors
   - Check if events endpoint is being called

3. **Verify Event Status:**
   - Events MUST have `status: 'Upcoming'` to be returned by API
   - New events default to `status: 'Upcoming'` automatically
