# NewsScroller - Quick Integration Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Install Package
```bash
cd client
npm install react-fast-marquee
```

### Step 2: Use in Your Component

Copy and paste into any React page:

```jsx
import NewsScroller from '../components/NewsScroller';
import { Newspaper } from 'lucide-react';

export default function YourPage() {
  const latestNews = [
    "Annual Day 2025 Announced!",
    "AI Hackathon registrations open now!",
    "New campus canteen inaugurated 🎉",
    "Placement Drive starts from Dec 1st",
    "Scholarship applications now open",
    "Cultural fest dates confirmed"
  ];

  return (
    <div>
      {/* Your existing content */}
      
      {/* Add this NewsScroller */}
      <NewsScroller 
        items={latestNews}
        title="📰 Latest News"
        icon={Newspaper}
        speed={50}
      />
      
      {/* More content */}
    </div>
  );
}
```

## 📥 Integration with Existing Pages

### Example 1: Add to Home.jsx

**Location**: `client/src/pages/Home.jsx`

```jsx
import NewsScroller from '../components/NewsScroller';
import { Newspaper } from 'lucide-react';

const Home = () => {
  const [newsItems, setNewsItems] = useState([]);

  // Fetch news...
  useEffect(() => {
    // Your existing news fetching code
  }, []);

  return (
    <div>
      {/* Your existing hero section, etc. */}
      
      {/* Add NewsScroller here */}
      {newsItems.length > 0 && (
        <NewsScroller 
          items={newsItems.map(n => n.title)}
          title="📰 Latest News Updates"
          icon={Newspaper}
          speed={50}
        />
      )}
      
      {/* Rest of your page */}
    </div>
  );
};
```

### Example 2: Add to Dashboard

```jsx
import NewsScroller from '../components/NewsScroller';
import { Megaphone, Trophy, Users } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* News Scroller */}
      <NewsScroller 
        items={newsHeadlines}
        title="📰 Latest News"
        icon={Megaphone}
      />
      
      {/* Event Scroller */}
      <NewsScroller 
        items={eventTitles}
        title="📅 Upcoming Events"
        icon={Trophy}
        backgroundColor="from-purple-50 to-pink-50"
        borderColor="border-purple-300"
      />
      
      {/* Community Scroller */}
      <NewsScroller 
        items={communityUpdates}
        title="👥 Community Updates"
        icon={Users}
        backgroundColor="from-green-50 to-emerald-50"
        borderColor="border-green-300"
      />
      
      {/* Your other dashboard content */}
    </div>
  );
};
```

### Example 3: Add to Events Page

```jsx
import NewsScroller from '../components/NewsScroller';
import { Calendar } from 'lucide-react';

const EventsPage = () => {
  const upcomingEventNames = eventList.map(e => e.title);

  return (
    <div>
      <h1>Events</h1>
      
      {/* Show upcoming events in ticker */}
      <NewsScroller 
        items={upcomingEventNames}
        title="🗓️ Upcoming Events"
        icon={Calendar}
        speed={40}
      />
      
      {/* Regular events list */}
      {/* ... */}
    </div>
  );
};
```

### Example 4: Add to News Page

```jsx
import NewsScroller from '../components/NewsScroller';
import { Newspaper } from 'lucide-react';

const NewsPage = () => {
  return (
    <div>
      {/* News ticker at the top */}
      <NewsScroller 
        items={topHeadlines}
        title="📰 Breaking News"
        icon={Newspaper}
        speed={60}
      />
      
      {/* Full news articles below */}
      <div className="mt-8">
        {/* News grid/list */}
      </div>
    </div>
  );
};
```

## 🎨 Styling Variations

### Use Default Orange Theme
```jsx
<NewsScroller items={items} />
```

### Blue Theme
```jsx
<NewsScroller 
  items={items}
  backgroundColor="from-blue-50 to-cyan-50"
  borderColor="border-blue-300"
/>
```

### Purple/Pink Theme
```jsx
<NewsScroller 
  items={items}
  backgroundColor="from-purple-50 to-pink-50"
  borderColor="border-purple-300"
/>
```

### Green Theme
```jsx
<NewsScroller 
  items={items}
  backgroundColor="from-green-50 to-emerald-50"
  borderColor="border-green-300"
/>
```

### Red/Urgent Theme
```jsx
<NewsScroller 
  items={items}
  title="⚡ Urgent"
  backgroundColor="from-red-50 to-orange-50"
  borderColor="border-red-400"
  speed={80}
/>
```

## 🔗 Available Icons (from lucide-react)

Just import and use:

```jsx
import { 
  Newspaper,      // News
  Megaphone,      // Announcements
  Calendar,       // Events
  Trophy,         // Achievements
  Award,          // Recognition
  Zap,           // Urgent/Fast
  AlertCircle,   // Warnings
  Rocket,        // New features
  Heart,         // Stories
  Star,          // Featured
  TrendingUp,    // Analytics
  Bell           // Notifications
} from 'lucide-react';
```

## ⚙️ Performance Optimization

### Method 1: Memoize Items (if from API)
```jsx
import { useMemo } from 'react';
import NewsScroller from '../components/NewsScroller';

const MyPage = () => {
  const [news, setNews] = useState([]);

  // Fetch news...

  const memoizedItems = useMemo(() => 
    news.map(item => item.title),
    [news]
  );

  return <NewsScroller items={memoizedItems} />;
};
```

### Method 2: Limit Number of Items
```jsx
// Only show top 6 news items
const topNews = news.slice(0, 6).map(n => n.title);

<NewsScroller items={topNews} />
```

### Method 3: Use Standalone Version (Lighter)
```jsx
import NewsScrollerStandalone from '../components/NewsScrollerStandalone';

// No external library needed!
<NewsScrollerStandalone items={items} />
```

## 🔄 Dynamic Data Updates

### Auto-refresh Every 5 Minutes
```jsx
import { useEffect, useState } from 'react';
import NewsScroller from '../components/NewsScroller';
import api from '../utils/api';

export default function LiveNews() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get('/api/news?limit=10');
        setItems(response.data.news.map(n => n.title));
      } catch (error) {
        console.error('Failed to fetch news:', error);
      }
    };

    // Initial fetch
    fetchNews();

    // Refresh every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return <NewsScroller items={items} />;
}
```

### Stream Real-time Updates
```jsx
import { useEffect, useState } from 'react';
import NewsScroller from '../components/NewsScroller';

export default function RealtimeNews() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Listen to WebSocket or real-time API
    const unsubscribe = subscribeToNewsUpdates((newItem) => {
      setItems(prev => [newItem, ...prev].slice(0, 20));
    });

    return unsubscribe;
  }, []);

  return <NewsScroller items={items} />;
}
```

## 📊 Real-world Example: News, Events, and Announcements

```jsx
import { useState, useEffect } from 'react';
import NewsScroller from '../components/NewsScroller';
import { Newspaper, Calendar, AlertCircle } from 'lucide-react';
import api from '../utils/api';

export default function Dashboard() {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, eventsRes, announcementsRes] = await Promise.all([
          api.get('/api/news?limit=5'),
          api.get('/api/events?limit=5'),
          api.get('/api/announcements?limit=5')
        ]);

        setNews(newsRes.data.news.map(n => n.title));
        setEvents(eventsRes.data.events.map(e => e.title));
        setAnnouncements(announcementsRes.data.announcements.map(a => a.message));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-4">
      {/* News Ticker */}
      {news.length > 0 && (
        <NewsScroller 
          items={news}
          title="📰 Latest News"
          icon={Newspaper}
          speed={50}
        />
      )}

      {/* Events Ticker */}
      {events.length > 0 && (
        <NewsScroller 
          items={events}
          title="📅 Upcoming Events"
          icon={Calendar}
          backgroundColor="from-purple-50 to-pink-50"
          borderColor="border-purple-300"
          speed={50}
        />
      )}

      {/* Announcements Ticker */}
      {announcements.length > 0 && (
        <NewsScroller 
          items={announcements}
          title="🔔 Announcements"
          icon={AlertCircle}
          backgroundColor="from-red-50 to-orange-50"
          borderColor="border-red-400"
          speed={60}
        />
      )}

      {/* Rest of dashboard */}
    </div>
  );
}
```

## ✅ Checklist

- [ ] Run `npm install react-fast-marquee` in client directory
- [ ] Copy `NewsScroller.jsx` to `client/src/components/`
- [ ] Import component in your page
- [ ] Prepare data (array of strings)
- [ ] Add `<NewsScroller items={data} />` to JSX
- [ ] Customize title, icon, colors as needed
- [ ] Test on mobile and desktop
- [ ] (Optional) Connect to real API data
- [ ] (Optional) Add auto-refresh functionality

## 🎓 Next Steps

1. **View Examples**: Add `<NewsScrollerDemo />` to see all variations
2. **Customize**: Experiment with different icons and colors
3. **Integrate**: Connect to your actual news/event data
4. **Deploy**: Test in production environment

---

**Ready to go!** 🚀 Start using NewsScroller in your app now.