# 📺 Scroller Visual Guide

## 🎯 What You'll See After Login

```
┌─────────────────────────────────────────────────────────────────┐
│  Navigation Bar (Sticky at top)                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 📰 LATEST NEWS & EVENTS 📅                        ⏸️ PAUSE BUTTON │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────┐             │
│  │ 📰 NEWS              │  │ 📅 EVENT             │             │
│  │ ─────────────────────│  │ ─────────────────────│             │
│  │ Breaking News Title  │  │ Upcoming Event Name  │             │
│  │ Jan 15, 2024        │  │ Jan 20, 2024        │             │
│  │ Description preview  │  │ Description preview  │             │
│  │ text goes here...    │  │ text goes here...    │             │
│  │                      │  │                      │             │
│  │ [Blue Border]        │  │ [Purple Border]      │             │
│  └──────────────────────┘  └──────────────────────┘  →→→        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
         (Scrolls continuously or pause on hover)

┌─────────────────────────────────────────────────────────────────┐
│  Hero Section with "BalKrishna Nivas" Title                     │
├─────────────────────────────────────────────────────────────────┤
│  (Family tree, images, etc.)                                    │
└─────────────────────────────────────────────────────────────────┘
```

## 🎨 Color Scheme

### News Items (Blue Theme)
```
┌────────────────────────────┐
│ 📰 NEWS  │  Jan 15, 2024    │  ← Blue Header
├────────────────────────────┤
│ Title: Breaking News        │
│ Desc: News description...   │
│                             │
│ [Blue Border - 4px thick]   │
└────────────────────────────┘
```

### Event Items (Purple Theme)
```
┌────────────────────────────┐
│ 📅 EVENT │  Jan 20, 2024    │  ← Purple Header
├────────────────────────────┤
│ Title: Upcoming Event       │
│ Desc: Event description...  │
│                             │
│ [Purple Border - 4px thick] │
└────────────────────────────┘
```

## ⚙️ Interactive Features

### 1. Automatic Scrolling
```
Card 1  →  Card 2  →  Card 3  →  Card 4  →  Card 1 (loops)
```
- Continuous horizontal scroll
- Smooth animation
- Speed: ~0.5px per frame

### 2. Pause/Resume Button
```
Click ⏸️ (Pause) → Stops scrolling
Click ▶️ (Play)  → Resumes scrolling
```

### 3. Hover Interaction
```
Mouse Enter → Scroller pauses
             Card zooms in (scale-105)
             
Mouse Leave → Scroller resumes normal speed
```

### 4. Card Details
```
Each card shows:
- Type badge (NEWS or EVENT with emoji)
- Date in top right
- Title (max 2 lines)
- Description (max 2 lines)
- Formatted date: "Jan 15, 2024"
```

## 📱 Responsive Design

### Desktop (1024px+)
```
[Full-width scroller with 4+ visible cards]
Scroller shows at top below navigation
Cards are large and easy to read
```

### Tablet (768px - 1023px)
```
[Slightly smaller cards, 2-3 visible]
Scroller shows at top
Touch-friendly pause button
```

### Mobile (< 768px)
```
[One full card visible at a time]
Scroller shows at top
Large touch targets for pause button
Easy horizontal scroll
```

## 🔄 Data Flow

```
User Logs In
    ↓
Home.jsx loads
    ↓
API: GET /api/news (limit: 10) ────→ Return top 10 news items
    ↓
API: GET /api/events (limit: 5) ───→ Return upcoming events
    ↓
Scroller.jsx receives:
    - newsItems (top 2 displayed)
    - eventItems (top 2 displayed)
    ↓
Display combined items in scroll
    ↓
Show on screen: Top 2 NEWS + Top 2 EVENTS in loop
```

## 📊 Example Content

### Sample News Item
```json
{
  "title": "New Family Gallery Launched",
  "description": "Explore our comprehensive photo gallery of family memories",
  "content": "We are excited to announce...",
  "publishedDate": "2024-01-15T10:30:00Z",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Sample Event Item
```json
{
  "name": "Annual Family Gathering 2024",
  "description": "Join us for our annual family reunion",
  "content": "This year's gathering will feature...",
  "startDate": "2024-01-20T09:00:00Z",
  "date": "2024-01-20T09:00:00Z"
}
```

## 🎯 Location in Page Hierarchy

```
HTML Structure:
<html>
  <body>
    <Navigation />           ← Below this
    <Scroller /> ✨ HERE!   ← Sticky, z-50 (on top)
    <Hero Section />
    <Family Tree />
    <News Section />
    <Events Section />
    <Footer />
  </body>
</html>
```

## 🎬 Animation Details

### Scroll Animation
- **Type**: requestAnimationFrame (smooth 60fps)
- **Speed**: 0.5px per frame (configurable)
- **Direction**: Left to right, continuous loop
- **Pause**: On hover or button click

### Hover Effect
- **Scale**: 1 to 1.05 (5% zoom)
- **Shadow**: sm to xl (shadow grows)
- **Duration**: 300ms smooth transition
- **Cursor**: Changes to pointer

### Header Animation
- **Icon**: Bouncing animation (bounce class)
- **Text**: Static, bold
- **Button**: Hover changes background

## 🖱️ User Interaction Examples

### Example 1: Passive Viewing
```
1. User logs in
2. Scroller automatically scrolls
3. User reads news/events as they scroll past
4. Loop repeats continuously
```

### Example 2: Active Reading
```
1. User logs in
2. User hovers over interesting card
3. Scroller pauses automatically
4. User reads full content
5. User moves mouse away
6. Scroller resumes automatically
```

### Example 3: Manual Control
```
1. User logs in
2. Scroller auto-scrolling
3. User clicks ⏸️ Pause button
4. Scroller stops completely
5. User clicks ▶️ Play button
6. Scroller resumes from same position
```

## 📐 Dimensions

### Scroller Container
- **Width**: Full viewport width (100%)
- **Height**: ~200px (for card height)
- **Padding**: 16px (4) on sides, 16px (4) top/bottom
- **Border**: 4px bottom, orange (#f97316)

### Individual Cards
- **Width**: 384px (w-96 in Tailwind)
- **Height**: Auto, minimum ~140px
- **Gap**: 16px between cards
- **Border**: 4px (blue or purple)
- **Padding**: 16px inside card

## ✨ Visual Hierarchy

```
1st: Scroller Header "📰 Latest News & Events 📅"  (Large, Bold)
2nd: Type Badge "📰 NEWS" or "📅 EVENT"             (Prominent)
3rd: Card Title                                      (Bold, Size: sm)
4th: Date (Jan 15, 2024)                           (Size: xs)
5th: Description preview                            (Size: sm, Gray)
```

## 🎨 Styling Summary

| Element | Color | Size | Weight |
|---------|-------|------|--------|
| Background | Orange gradient | Full width | - |
| Header Text | Orange-800 | base | bold |
| Icon | Orange-600 | 24px | - |
| News Border | Blue-400 | 4px | - |
| Event Border | Purple-400 | 4px | - |
| Card Title | Gray-900 | sm | bold |
| Date | Blue/Purple-600 | xs | semibold |
| Description | Gray-700 | sm | normal |

---

## 🚀 Expected Behavior

✅ **Scroller is visible** right after login  
✅ **Auto-scrolls** continuously  
✅ **Pauses on hover** automatically  
✅ **Shows 4 items** (2 news + 2 events)  
✅ **Responsive** on all screen sizes  
✅ **Color-coded** for easy identification  
✅ **Interactive** with pause/play button  

**That's what your scroller should look and act like! 🎉**