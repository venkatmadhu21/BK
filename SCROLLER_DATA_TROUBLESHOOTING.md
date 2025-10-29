# 🔧 Scroller Data Troubleshooting Guide

## ✅ Server Status
- ✅ Backend server IS running on `http://localhost:5000`
- ✅ API endpoints are accessible

## ❌ Current Issues & Solutions

### Issue 1: MongoDB Not Connected or Empty Database

**Symptoms:**
- Scroller shows "Loading news and events..."
- No news or events appear even after login
- Console shows empty arrays

**Solution - Check & Fix MongoDB:**

1. **Verify MongoDB is running** (Windows):
   ```powershell
   # Check if MongoDB service is running
   Get-Service MongoDB
   
   # Or check if mongod process is running
   Get-Process mongod -ErrorAction SilentlyContinue
   ```

2. **Start MongoDB if not running**:
   ```powershell
   # If using MongoDB Community Edition
   net start MongoDB
   
   # Or manually start mongod
   mongod --dbpath "C:\data\db"
   ```

3. **Connect to MongoDB and check data**:
   ```powershell
   # Open MongoDB shell
   mongosh
   
   # Use the database
   use bal-krishna-nivas
   
   # Check collections
   db.news.count()        # Should show > 0
   db.events.count()      # Should show > 0
   
   # View sample data
   db.news.find().limit(1)
   db.events.find().limit(1)
   ```

---

### Issue 2: News Items Not Published

**The Problem:**
- The API filters by `isPublished: true` (news.js line 14)
- If news items exist but `isPublished: false`, they won't appear

**Solution - Publish News Items:**
```powershell
# In MongoDB shell
mongosh
use bal-krishna-nivas

# Update all news to published
db.news.updateMany(
  { isPublished: false },
  { 
    $set: { 
      isPublished: true,
      publishDate: new Date()
    }
  }
)
```

---

### Issue 3: Create Sample Data

If database is empty, create sample news and events:

```javascript
// Run in MongoDB shell:

// Create sample news
db.news.insertMany([
  {
    title: "Family Reunion 2025",
    content: "Exciting announcement about our upcoming family reunion scheduled for December 2025. Join us for celebrations!",
    summary: "Family reunion announcement",
    category: "Announcement",
    isPublished: true,
    publishDate: new Date(),
    priority: "High"
  },
  {
    title: "New Family Member",
    content: "We are delighted to announce the arrival of our newest family member. A beautiful addition to the Bal Krishna Nivas family!",
    summary: "New arrival in the family",
    category: "Celebration",
    isPublished: true,
    publishDate: new Date(),
    priority: "Medium"
  }
])

// Create sample events
db.events.insertMany([
  {
    title: "Family Birthday Celebration",
    description: "Join us for a grand celebration of our beloved family member's birthday with traditional rituals and feast.",
    eventType: "Birthday",
    startDate: new Date("2025-12-15"),
    endDate: new Date("2025-12-15"),
    startTime: "10:00 AM",
    endTime: "06:00 PM",
    venue: {
      name: "Bal Krishna Nivas",
      address: {
        city: "Pune",
        state: "Maharashtra",
        country: "India"
      }
    },
    organizer: ObjectId("000000000000000000000001"),
    status: "Upcoming",
    priority: "High"
  },
  {
    title: "Family Cultural Program",
    description: "Traditional cultural program showcasing our family heritage and traditions with music, dance and performances.",
    eventType: "Cultural",
    startDate: new Date("2025-12-20"),
    endDate: new Date("2025-12-20"),
    startTime: "05:00 PM",
    endTime: "10:00 PM",
    venue: {
      name: "Community Hall",
      address: {
        city: "Pune",
        state: "Maharashtra",
        country: "India"
      }
    },
    organizer: ObjectId("000000000000000000000001"),
    status: "Upcoming",
    priority: "Medium"
  }
])
```

---

### Issue 4: Fixed Query Parameters in Home.jsx

**The Problem:**
- Home.jsx sends `sortBy` and `sortOrder` parameters
- But the API doesn't support these parameters (they're ignored)

**Solution - Update Home.jsx** (Optional but cleaner):

Remove unsupported query parameters:

```javascript
// News fetch - Remove sortBy and sortOrder
const response = await api.get('/api/news', {
  params: {
    limit: 10
    // Remove: sortBy, sortOrder
  }
});

// Events fetch - Remove sortBy and sortOrder
const response = await api.get('/api/events', {
  params: {
    status: 'Upcoming',
    limit: 5
    // Remove: sortBy, sortOrder (API sorts by startDate DESC)
  }
});
```

---

## 🧪 Test the Complete Flow

### Step 1: Verify Data in Database
```powershell
mongosh
use bal-krishna-nivas
db.news.countDocuments({ isPublished: true })
db.events.countDocuments()
```

### Step 2: Test API Endpoints (with valid JWT token)
```
GET http://localhost:5000/api/news
GET http://localhost:5000/api/events
```

### Step 3: Check Browser Console
Login and check console for:
```
📰 Fetched News: [...]  // Should show array with items
📅 Fetched Events: [...] // Should show array with items
🔍 Scroller Debug - News Items: X, Event Items: Y
```

---

## 📋 Checklist

- [ ] MongoDB is running (`net start MongoDB` or `mongod`)
- [ ] Database has news/events data (`db.news.count()` > 0)
- [ ] News items are published (`isPublished: true`)
- [ ] You're logged in before viewing Home page
- [ ] Browser console shows fetched data
- [ ] Scroller component displays news and events

---

## 🆘 If Still Not Working

Check browser console for errors:
1. **F12** → Console tab
2. Look for red errors
3. Check network tab to see API response

Common issues:
- ❌ `401 Unauthorized` → Login first
- ❌ `Empty array returned` → No published news/events
- ❌ `Connection refused` → MongoDB not running
- ❌ `CORS error` → Server not running on port 5000

**Send the console errors if you need more help!**