import React, { useState, useEffect, useRef } from 'react';
import { Megaphone } from 'lucide-react';

/**
 * NewsScrollerStandalone - No external library needed
 * Uses pure CSS animations for horizontal scrolling
 * Useful if react-fast-marquee is not available
 */
const NewsScrollerStandalone = ({ 
  items = [], 
  title = 'Latest Updates',
  icon: IconComponent = Megaphone,
  speed = 'normal', // 'slow', 'normal', 'fast'
  pauseOnHover = true,
  backgroundColor = 'from-orange-50 to-amber-50',
  borderColor = 'border-orange-300'
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollerRef = useRef(null);

  if (!items || items.length === 0) {
    return null;
  }

  // Map speed to animation duration
  const speedMap = {
    slow: '40s',
    normal: '30s',
    fast: '20s'
  };

  const animationDuration = speedMap[speed] || speedMap.normal;

  return (
    <div className={`w-full bg-gradient-to-r ${backgroundColor} border-b-2 ${borderColor} shadow-lg py-4 overflow-hidden`}>
      <div className="max-w-full mx-auto px-4">
        {/* Header with Icon and Title */}
        <div className="flex items-center gap-2 mb-3 px-2">
          <IconComponent 
            size={24} 
            className="text-orange-600 flex-shrink-0 animate-pulse" 
          />
          <h2 className="text-lg font-bold text-orange-700 whitespace-nowrap">
            {title}
          </h2>
          <div className="h-1 flex-grow rounded-full bg-gradient-to-r from-orange-300 to-transparent ml-2"></div>
        </div>

        {/* Scrolling Container */}
        <div 
          ref={scrollerRef}
          className="relative overflow-hidden rounded-lg"
          onMouseEnter={() => pauseOnHover && setIsPaused(true)}
          onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        >
          {/* Gradient overlays for smooth fade at edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          {/* Animated Content */}
          <style>{`
            @keyframes scroll-animation {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            
            .news-scroll-container {
              animation: scroll-animation ${animationDuration} linear infinite;
              animation-play-state: ${isPaused ? 'paused' : 'running'};
              will-change: transform;
            }
            
            .news-scroll-container:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="news-scroll-container flex gap-3 px-4 py-2">
            {/* Render items twice for seamless loop */}
            {[...items, ...items].map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 group"
              >
                {/* News Item Pill */}
                <div className="bg-white text-gray-800 px-4 py-2 rounded-full shadow-sm border border-orange-200 hover:border-orange-400 hover:shadow-md hover:bg-orange-50 transition-all duration-300 cursor-pointer whitespace-nowrap">
                  {/* Pulsing Dot */}
                  <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                  
                  {/* News Text */}
                  <span className="text-sm font-medium group-hover:text-orange-700 transition-colors duration-300">
                    {item}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optional: Subtle Info Text */}
        <div className="flex justify-center mt-2">
          <span className="text-xs text-orange-600 opacity-60">
            🔄 Scroll continuously • Hover to pause
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewsScrollerStandalone;