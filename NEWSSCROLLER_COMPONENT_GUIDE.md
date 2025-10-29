# NewsScroller Component Guide

A modern, responsive horizontal news ticker component for React applications. Display beautiful scrolling news updates with smooth animations.

## 📦 What's Included

### 1. **NewsScroller.jsx** (With react-fast-marquee)
- Professional horizontal scrolling using `react-fast-marquee` library
- Smooth, optimized performance
- Pause on hover functionality
- Customizable speed and styling

### 2. **NewsScrollerStandalone.jsx** (Pure CSS)
- No external library dependency
- Uses CSS animations for horizontal scroll
- Lightweight alternative
- Perfect for minimalist setups

### 3. **NewsScrollerDemo.jsx**
- Complete examples with multiple variants
- Usage documentation
- Props reference table
- Real-world use cases

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
cd client
npm install react-fast-marquee
```

### Step 2: Import Component

```jsx
import NewsScroller from './components/NewsScroller';
```

### Step 3: Use in Your Page

```jsx
export default function Home() {
  const newsItems = [
    "Annual Day 2025 Announced!",
    "AI Hackathon registrations open now!",
    "New campus canteen inaugurated 🎉",
    "Placement Drive starts from Dec 1st"
  ];

  return (
    <>
      <NewsScroller items={newsItems} />
    </>
  );
}
```

## 📖 Component Props

### NewsScroller (with react-fast-marquee)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `array` | `[]` | Array of news strings to display |
| `title` | `string` | `'Latest Updates'` | Header title |
| `icon` | `component` | `Megaphone` | Lucide-react icon component |
| `speed` | `number` | `50` | Scrolling speed (1-100) |
| `pauseOnHover` | `boolean` | `true` | Pause scroll when hovering |
| `backgroundColor` | `string` | `'from-orange-50 to-amber-50'` | Tailwind gradient classes |
| `borderColor` | `string` | `'border-orange-300'` | Tailwind border color class |

### NewsScrollerStandalone (Pure CSS)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `array` | `[]` | Array of news strings |
| `title` | `string` | `'Latest Updates'` | Header title |
| `icon` | `component` | `Megaphone` | Lucide-react icon |
| `speed` | `string` | `'normal'` | Speed: 'slow' \| 'normal' \| 'fast' |
| `pauseOnHover` | `boolean` | `true` | Pause on hover |
| `backgroundColor` | `string` | `'from-orange-50 to-amber-50'` | Tailwind gradient |
| `borderColor` | `string` | `'border-orange-300'` | Tailwind border color |

## 💡 Usage Examples

### Example 1: Basic News Ticker

```jsx
import NewsScroller from './components/NewsScroller';

export default function Home() {
  const headlines = [
    "Breaking: New feature released!",
    "Event: Annual conference next month",
    "Update: System maintenance completed",
    "Achievement: 1 million users!"
  ];

  return <NewsScroller items={headlines} />;
}
```

### Example 2: Custom Icon and Colors

```jsx
import NewsScroller from './components/NewsScroller';
import { Newspaper } from 'lucide-react';

export default function News() {
  return (
    <NewsScroller
      items={newsItems}
      title="📰 Latest Headlines"
      icon={Newspaper}
      backgroundColor="from-blue-50 to-cyan-50"
      borderColor="border-blue-300"
      speed={40}
    />
  );
}
```

### Example 3: Fast Speed for Urgent Announcements

```jsx
import NewsScroller from './components/NewsScroller';
import { AlertCircle } from 'lucide-react';

export default function Alerts() {
  const urgentAlerts = [
    "🔴 URGENT: Server maintenance tonight at 9 PM",
    "⚠️ Critical security update available",
    "✅ All systems operational"
  ];

  return (
    <NewsScroller
      items={urgentAlerts}
      title="⚡ Urgent Announcements"
      icon={AlertCircle}
      speed={80}
      backgroundColor="from-red-50 to-orange-50"
      borderColor="border-red-400"
    />
  );
}
```

### Example 4: Without External Dependency

```jsx
import NewsScrollerStandalone from './components/NewsScrollerStandalone';

export default function Home() {
  return (
    <NewsScrollerStandalone
      items={newsItems}
      title="Community Updates"
      speed="normal"
    />
  );
}
```

### Example 5: Multiple Scrollers on Same Page

```jsx
import NewsScroller from './components/NewsScroller';
import { Newspaper, Trophy, Users } from 'lucide-react';

export default function Dashboard() {
  const news = ["Breaking news 1", "Breaking news 2"];
  const events = ["Event 1", "Event 2"];
  const community = ["Update 1", "Update 2"];

  return (
    <div className="space-y-4">
      <NewsScroller items={news} title="📰 News" icon={Newspaper} speed={50} />
      <NewsScroller items={events} title="🏆 Events" icon={Trophy} speed={50} />
      <NewsScroller items={community} title="👥 Community" icon={Users} speed={50} />
    </div>
  );
}
```

## 🎨 Available Lucide Icons

You can use any lucide-react icon. Popular choices for news scrollers:

- `Newspaper` - Classic newspaper icon
- `Megaphone` - Announcements
- `Zap` - Fast/Urgent news
- `AlertCircle` - Warnings/Alerts
- `Trophy` - Achievements
- `Award` - Recognition
- `Rocket` - New features
- `Heart` - Stories
- `Star` - Featured
- `TrendingUp` - Analytics
- `Bell` - Notifications

```jsx
import { Newspaper, Trophy, Zap, AlertCircle } from 'lucide-react';
```

## 🎯 Customization Guide

### Changing Colors

```jsx
// Orange theme (default)
<NewsScroller
  backgroundColor="from-orange-50 to-amber-50"
  borderColor="border-orange-300"
/>

// Blue theme
<NewsScroller
  backgroundColor="from-blue-50 to-cyan-50"
  borderColor="border-blue-300"
/>

// Purple theme
<NewsScroller
  backgroundColor="from-purple-50 to-pink-50"
  borderColor="border-purple-300"
/>

// Green theme
<NewsScroller
  backgroundColor="from-green-50 to-emerald-50"
  borderColor="border-green-300"
/>
```

### Adjusting Speed

```jsx
// Slow - 30 seconds per loop
<NewsScroller items={items} speed={30} />

// Normal - 50 pixels per second
<NewsScroller items={items} speed={50} />

// Fast - 80 pixels per second
<NewsScroller items={items} speed={80} />
```

### Standalone Version Speed Options

```jsx
// Slow animation (40 seconds)
<NewsScrollerStandalone items={items} speed="slow" />

// Normal animation (30 seconds)
<NewsScrollerStandalone items={items} speed="normal" />

// Fast animation (20 seconds)
<NewsScrollerStandalone items={items} speed="fast" />
```

## 🔧 Styling Details

### Component Structure

```
NewsScroller
├── Header
│   ├── Icon (with pulse animation)
│   └── Title
├── Marquee Container
│   └── News Items (Pills)
│       ├── Pulsing dot indicator
│       └── News text
└── Info Text
```

### CSS Classes Used

- **Container**: `bg-gradient-to-r`, `border-b-2`, `shadow-lg`
- **Items**: `rounded-full`, `border`, `shadow-sm`
- **Hover Effects**: `hover:shadow-md`, `hover:border`, `hover:bg-opacity-10`
- **Animations**: `animate-pulse`

## 📱 Responsive Features

✅ **Mobile**: Single line, tap-friendly sizes
✅ **Tablet**: Optimal spacing and text size
✅ **Desktop**: Full-width display with comfortable padding
✅ **All sizes**: Maintains readability and visual appeal

## ⚡ Performance Tips

1. **Keep item count reasonable** (4-10 items recommended)
2. **Use short, punchy headlines** for better scannability
3. **Update items sparingly** to avoid re-renders
4. **Memoize items prop** if data comes from API

```jsx
const memoizedItems = useMemo(() => newsItems, [newsItems]);

<NewsScroller items={memoizedItems} />
```

## 🐛 Troubleshooting

### Issue: Component shows nothing
**Solution**: Make sure `items` array is not empty and contains strings

```jsx
// ❌ Wrong
<NewsScroller items={[]} />

// ✅ Correct
<NewsScroller items={["News 1", "News 2"]} />
```

### Issue: Library not found (react-fast-marquee)
**Solution**: Install the package

```bash
npm install react-fast-marquee
```

Or use the standalone version instead.

### Issue: Styling not applied
**Solution**: Make sure Tailwind CSS is properly configured and imported

### Issue: Scroll too fast/slow
**Solution**: Adjust the `speed` prop

```jsx
// Slower
<NewsScroller items={items} speed={30} />

// Faster
<NewsScroller items={items} speed={80} />
```

## 🔄 Integration with Real Data

### Example: Fetching from API

```jsx
import { useState, useEffect } from 'react';
import NewsScroller from './components/NewsScroller';
import api from './utils/api';

export default function Home() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get('/api/news');
        const headlines = response.data.news.map(item => item.title);
        setNews(headlines);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      }
    };

    fetchNews();
  }, []);

  return <NewsScroller items={news} title="Latest Updates" />;
}
```

### Example: Real-time Updates

```jsx
import { useEffect, useState } from 'react';

export default function LiveNews() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fetch new items every 5 minutes
      fetchAndUpdateNews();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return <NewsScroller items={items} />;
}
```

## 📚 File Locations

- **Main Component**: `client/src/components/NewsScroller.jsx`
- **Standalone Version**: `client/src/components/NewsScrollerStandalone.jsx`
- **Demo/Examples**: `client/src/components/NewsScrollerDemo.jsx`
- **Documentation**: Root directory (this file)

## 🤝 Contributing

To customize or extend the component:

1. Copy the component file
2. Modify styling or functionality
3. Import your custom version

## 📋 Checklist for Integration

- [ ] Install `react-fast-marquee`: `npm install react-fast-marquee`
- [ ] Copy `NewsScroller.jsx` to `client/src/components/`
- [ ] (Optional) Copy `NewsScrollerStandalone.jsx`
- [ ] (Optional) Copy `NewsScrollerDemo.jsx` to view examples
- [ ] Import component in your page
- [ ] Pass `items` array with news headlines
- [ ] Customize colors and icons as needed
- [ ] Test on mobile and desktop

## 🎓 Next Steps

1. View the demo: Add `<NewsScrollerDemo />` to a page
2. Try different icon combinations
3. Experiment with color themes
4. Connect to real data from your API
5. Customize styling further if needed

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the example usage
3. Check console for error messages
4. Verify all props are correct types

---

**Created**: 2024
**Component Status**: Production Ready ✅
**Dependencies**: react, react-fast-marquee, lucide-react, tailwindcss