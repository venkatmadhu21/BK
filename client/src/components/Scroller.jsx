import React, { useState, useEffect, useRef } from 'react';
import { Newspaper, Pause, Play, Zap, Clock } from 'lucide-react';

// Warm Orange & Maroon SaaS Color Scheme
const BG_GRADIENT = "bg-gradient-to-r from-orange-100 via-amber-100 to-orange-50";
const ACCENT_GRADIENT = "bg-gradient-to-r from-orange-400 via-amber-400 to-orange-300";
const BORDER = "border-b border-orange-300/40";
const CARD_COLOR = "bg-white/60 backdrop-blur-lg border border-orange-300/50 hover:border-orange-400/80 hover:bg-white/70";
const BADGE_NEWS = "bg-gradient-to-r from-orange-400 to-amber-400 text-orange-900";
const BADGE_EVENT = "bg-gradient-to-r from-orange-500 to-amber-500 text-white";
const DATE = "text-orange-700";

const Scroller = ({ newsItems = [], eventItems = [] }) => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollerRef = useRef(null);
  const contentRef = useRef(null);
  const animationIdRef = useRef(null);

  // Reference time for filtering events
  const now = Date.now();
  const latestNews = [...newsItems]
    .map(item => ({
      item,
      time: (() => {
        const publishDate = item.publishDate || item.createdAt;
        if (!publishDate) return null;
        const publishTime = new Date(publishDate).getTime();
        return Number.isFinite(publishTime) ? publishTime : null;
      })()
    }))
    .filter(entry => entry.time !== null)
    .sort((a, b) => b.time - a.time)
    .map(entry => entry.item);

  const upcomingEvents = eventItems.filter(item => {
    // Primary check: startDate must be in the future
    const startDate = item.startDate || item.date;
    if (startDate) {
      const startTime = new Date(startDate).getTime();
      if (Number.isFinite(startTime)) {
        // Only include if date is in the future
        return startTime >= now;
      }
    }
    // Fallback: if no valid startDate, check the endDate or createdAt
    const fallbackDate = item.endDate || item.createdAt;
    if (fallbackDate) {
      const fallbackTime = new Date(fallbackDate).getTime();
      if (Number.isFinite(fallbackTime) && fallbackTime >= now) {
        return true;
      }
    }
    // Final fallback: check status only if no valid dates found
    if (typeof item.status === 'string') {
      const status = item.status.toLowerCase();
      return status === 'upcoming' || status === 'ongoing';
    }
    return false;
  });

  const getItemTimestamp = item => {
    const sourceDate = item.itemType === 'news'
      ? item.publishDate || item.createdAt
      : item.startDate || item.date || item.endDate || item.createdAt;
    const timestamp = sourceDate ? new Date(sourceDate).getTime() : NaN;
    return Number.isFinite(timestamp) ? timestamp : Number.MIN_SAFE_INTEGER;
  };

  const combinedItemsBase = [
    ...latestNews.slice(0, 8).map(item => ({ ...item, itemType: 'news' })),
    ...upcomingEvents.slice(0, 8).map(item => ({ ...item, itemType: 'event' }))
  ];

  const combinedItems = [...combinedItemsBase].sort((a, b) => getItemTimestamp(b) - getItemTimestamp(a));

  useEffect(() => {
    const scroller = scrollerRef.current;
    const content = contentRef.current;
    if (!scroller || !content || combinedItems.length === 0) return;

    let scrollPosition = 0;
    const scrollSpeed = 2;
    let itemWidth = 0;
    let lastUpdateTime = Date.now();

    const getItemWidth = () => {
      if (content.children.length > 0) {
        const firstChild = content.children[0];
        return firstChild.offsetWidth + 8;
      }
      return 380;
    };

    const animate = () => {
      if (!isPaused && scroller && content) {
        const now = Date.now();
        const deltaTime = now - lastUpdateTime;
        lastUpdateTime = now;

        scrollPosition += scrollSpeed;
        scroller.scrollLeft = scrollPosition;

        itemWidth = getItemWidth();
        const totalOriginalWidth = itemWidth * combinedItems.length;

        if (scrollPosition >= totalOriginalWidth) {
          scrollPosition = 0;
          scroller.scrollLeft = 0;
        }
      }
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isPaused, combinedItems.length]);

  if (!combinedItems || combinedItems.length === 0) {
    return (
      <div className={`w-full ${BG_GRADIENT} ${BORDER} shadow-2xl sticky top-0 z-50 backdrop-blur-xl`}>
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-300 rounded-lg">
                <Newspaper size={16} className="text-orange-900 animate-pulse" />
              </div>
              <h3 className="text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">News & Events</h3>
            </div>
          </div>
          <div className="bg-white/30 backdrop-blur-lg border border-orange-300/40 rounded-xl p-3 text-center">
            <p className="text-sm text-orange-600 font-medium">Loading exciting updates...</p>
          </div>
        </div>
      </div>
    );
  }

  const getDisplayDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getDescription = (text, maxLength = 60) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className={`w-full ${BG_GRADIENT} ${BORDER} shadow-2xl sticky top-0 z-50 backdrop-blur-xl`}>
      <div className="max-w-full mx-auto px-4 py-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-400 rounded-lg">
              <Zap size={18} className="text-orange-900 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Live Updates
              </h3>
              <p className="text-xs text-orange-600/80">News & Events</p>
            </div>
          </div>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-2.5 rounded-lg transition-all duration-300 flex items-center justify-center backdrop-blur-lg border ${
              isPaused
                ? 'bg-gradient-to-r from-emerald-400/30 to-green-400/30 border-emerald-300/50 hover:border-emerald-400/70'
                : 'bg-gradient-to-r from-orange-300/30 to-amber-300/30 border-orange-300/50 hover:border-orange-400/70'
            }`}
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? (
              <Play size={16} className="text-green-600" />
            ) : (
              <Pause size={16} className="text-orange-600" />
            )}
          </button>
        </div>

        {/* Scroller Container */}
        <div
          ref={scrollerRef}
          className="overflow-x-auto scroll-smooth w-full min-h-[100px] scrollbar-hide"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ scrollBehavior: 'auto' }}
        >
          <div
            ref={contentRef}
            className="flex gap-3 pb-1 h-full"
            style={{ width: 'fit-content', minHeight: '100px' }}
          >
            {[...combinedItems, ...combinedItems].map((item, index) => {
              const isNews = item.itemType === 'news';
              const badgeClass = isNews ? BADGE_NEWS : BADGE_EVENT;
              return (
                <div
                  key={index}
                  className={`flex-shrink-0 min-w-[360px] max-w-[420px] h-[100px] rounded-2xl shadow-xl transition-all duration-300 cursor-pointer ${CARD_COLOR} flex flex-col justify-between p-3 group hover:scale-105 hover:shadow-2xl`}
                >
                  {/* Top Section: Badge and Date */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${badgeClass} flex items-center gap-1.5 shadow-lg`}>
                      {isNews ? (
                        <>
                          <Newspaper size={13} />
                          <span>News</span>
                        </>
                      ) : (
                        <>
                          <Clock size={13} />
                          <span>Event</span>
                        </>
                      )}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${DATE} bg-white/30 backdrop-blur-lg border border-orange-300/40`}>
                      {isNews
                        ? getDisplayDate(item.publishDate || item.createdAt)
                        : getDisplayDate(item.startDate || item.date)}
                    </span>
                  </div>

                  {/* Content Section */}
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-orange-900 line-clamp-1 mb-1 group-hover:text-orange-700 transition-colors">
                      {item.title || item.name || 'Untitled'}
                    </p>
                    <p className="text-xs text-orange-700/90 leading-snug line-clamp-1 mb-1">
                      {getDescription(
                        isNews
                          ? item.content || item.summary || ''
                          : item.description || item.content || '',
                        65
                      )}
                    </p>
                    {item.location && (
                      <p className="text-xs text-orange-700/80 truncate mb-1">
                        <span className="font-semibold">📍</span> {item.location}
                      </p>
                    )}
                    {(item.url || item.link) && (
                      <a
                        href={item.url || item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-xs font-semibold text-transparent bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text hover:from-orange-700 hover:to-amber-700 transition-all"
                      >
                        Learn more →
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Scroller;
