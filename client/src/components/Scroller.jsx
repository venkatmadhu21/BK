import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Newspaper, Pause, Play } from 'lucide-react';

const BG_GRADIENT = "bg-gradient-to-r from-orange-50 via-yellow-50 to-orange-100";
const BORDER = "border-b-2 border-orange-200";
const CARD_COLOR = "border-orange-200 hover:border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100";
const BADGE = "bg-orange-100 text-orange-800";
const DATE = "text-orange-600";

const Scroller = ({ newsItems = [], eventItems = [] }) => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollerRef = useRef(null);
  const contentRef = useRef(null);
  const animationIdRef = useRef(null);
  const isPausedRef = useRef(false);

  const combinedItems = useMemo(() => [
    ...newsItems.slice(0, 8).map(item => ({ ...item, itemType: 'news' })),
    ...eventItems.slice(0, 8).map(item => ({ ...item, itemType: 'event' }))
  ], [newsItems, eventItems]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const content = contentRef.current;
    if (!scroller || !content || combinedItems.length === 0) return;

    let scrollPosition = scroller.scrollLeft;
    let lastTimestamp = null;
    const pixelsPerMs = 0.12;

    const getCycleWidth = () => {
      const totalWidth = content.scrollWidth;
      return totalWidth > 0 ? totalWidth / 2 : 0;
    };

    const step = (timestamp) => {
      if (!scrollerRef.current || !contentRef.current) {
        return;
      }

      const cycleWidth = getCycleWidth();
      if (cycleWidth <= 0) {
        animationIdRef.current = requestAnimationFrame(step);
        return;
      }

      if (isPausedRef.current) {
        lastTimestamp = timestamp;
      } else {
        if (lastTimestamp === null) {
          lastTimestamp = timestamp;
        }
        const delta = timestamp - lastTimestamp;
        lastTimestamp = timestamp;
        scrollPosition = (scrollPosition + delta * pixelsPerMs) % cycleWidth;
        scroller.scrollLeft = scrollPosition;
      }

      animationIdRef.current = requestAnimationFrame(step);
    };

    scrollPosition = 0;
    scroller.scrollLeft = 0;
    lastTimestamp = null;
    animationIdRef.current = requestAnimationFrame(step);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [combinedItems]);

  if (!combinedItems || combinedItems.length === 0) {
    return (
      <div className={`w-full ${BG_GRADIENT} ${BORDER} shadow-md sticky top-0 z-50`}>
        <div className="max-w-full mx-auto px-2 py-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1">
              <Newspaper size={16} className="text-orange-400 animate-bounce" />
              <h3 className="text-xs font-bold text-orange-700">News & Events</h3>
            </div>
          </div>
          <div className="bg-orange-50 border-2 border-orange-100 rounded-lg p-2 text-center">
            <p className="text-xs text-orange-700 font-semibold">Loading...</p>
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
    <div className={`w-full ${BG_GRADIENT} ${BORDER} shadow-md sticky top-0 z-50`}>
      <div className="max-w-full mx-auto px-2 py-1">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1">
            <Newspaper size={16} className="text-orange-400 animate-bounce" />
            <h3 className="text-xs font-bold text-orange-700">News & Events</h3>
          </div>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-0.5 hover:bg-orange-200 rounded-lg transition-colors bg-orange-100"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? (
              <Play size={14} className="text-orange-700" />
            ) : (
              <Pause size={14} className="text-orange-700" />
            )}
          </button>
        </div>

        {/* Scroller Container */}
        <div
          ref={scrollerRef}
          className="overflow-x-auto scroll-smooth w-full min-h-[80px] scrollbar-hide"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ scrollBehavior: 'auto' }}
        >
          <div
            ref={contentRef}
            className="flex gap-2 pb-1 h-full"
            style={{ width: 'fit-content', minHeight: '80px' }}
          >
            {[...combinedItems, ...combinedItems].map((item, index) => (
              <div
                key={index}
                className={`flex-shrink-0 min-w-[340px] max-w-[400px] h-[80px] rounded-xl shadow border-2 p-2 hover:shadow-md transition-all duration-300 cursor-pointer ${CARD_COLOR} flex flex-col justify-between`}
                style={{ minHeight: '80px', maxHeight: '90px' }}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${BADGE}`}>
                    {item.itemType === 'news' ? '📰' : '📅'}
                  </span>
                  <span className={`text-xs font-semibold ${DATE}`}>
                    {item.itemType === 'news'
                      ? getDisplayDate(item.publishDate || item.createdAt)
                      : getDisplayDate(item.startDate || item.date)}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-orange-900 line-clamp-1 mb-0">
                    {item.title || item.name || 'Untitled'}
                  </p>
                  <p className="text-xs text-orange-800 leading-snug line-clamp-1 mb-0">
                    {getDescription(
                      item.itemType === 'news'
                        ? item.content || item.summary || ''
                        : item.description || item.content || '',
                      60
                    )}
                  </p>
                  {item.location && (
                    <p className="text-xs text-orange-600 truncate mb-0">
                      <span className="font-semibold">Location: </span>{item.location}
                    </p>
                  )}
                  {(item.url || item.link) && (
                    <a
                      href={item.url || item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs font-medium text-orange-700 underline hover:text-orange-900 transition"
                    >
                      Read more →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scroller;
