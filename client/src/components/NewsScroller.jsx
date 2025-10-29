import React from 'react';
import Marquee from 'react-fast-marquee';
import { Megaphone } from 'lucide-react';

const NewsScroller = ({ 
  items = [], 
  title = 'Latest Updates',
  icon: IconComponent = Megaphone,
  speed = 50,
  pauseOnHover = true,
  backgroundColor = 'from-gradient-to-r from-orange-50 to-amber-50',
  borderColor = 'border-orange-300'
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`w-full bg-gradient-to-r ${backgroundColor} border-b-2 ${borderColor} shadow-lg py-4`}>
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

        {/* Marquee Scroller */}
        <Marquee
          speed={speed}
          pauseOnHover={pauseOnHover}
          gradient={false}
          className="overflow-hidden"
        >
          <div className="flex gap-3 px-4">
            {items.map((item, index) => (
              <div
                key={`item-${index}-${item}`}
                className="flex-shrink-0 group"
              >
                {/* News Item Pill */}
                <div className="bg-white text-gray-800 px-4 py-2 rounded-full shadow-sm border border-orange-200 hover:border-orange-400 hover:shadow-md transition-all duration-300 cursor-pointer hover:bg-orange-50 whitespace-nowrap">
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
        </Marquee>

        {/* Optional: Subtle Info Text */}
        <div className="flex justify-center mt-2">
          <span className="text-xs text-orange-600 opacity-60">
            🔄 Scroll continuously • Hover to pause
          </span>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default NewsScroller;