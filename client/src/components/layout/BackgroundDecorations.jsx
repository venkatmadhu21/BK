import React from 'react';

const BackgroundDecorations = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Ancient Mandala Patterns */}
      <div className="absolute top-20 left-10 w-32 h-32 opacity-20 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-300 animate-spin-slow">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5"/>
          <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1"/>
          <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3"/>
          <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1"/>
          <circle cx="50" cy="50" r="5" fill="currentColor"/>
          {/* Petals */}
          {[...Array(8)].map((_, i) => (
            <g key={i} transform={`rotate(${i * 45} 50 50)`}>
              <ellipse cx="50" cy="20" rx="3" ry="8" fill="currentColor" opacity="0.6"/>
            </g>
          ))}
        </svg>
      </div>

      <div className="absolute top-40 right-20 w-24 h-24 opacity-25">
        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-400 animate-pulse">
          <polygon points="50,10 61,35 90,35 69,57 80,82 50,70 20,82 31,57 10,35 39,35" fill="currentColor" opacity="0.3"/>
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.5"/>
        </svg>
      </div>

      {/* Traditional Paisley Patterns */}
      <div className="absolute bottom-32 left-20 w-40 h-40 opacity-15">
        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-200">
          <path d="M20,80 Q20,20 50,20 Q80,20 80,50 Q80,80 50,80 Q35,80 35,65 Q35,50 50,50 Q65,50 65,65" 
                fill="none" stroke="currentColor" strokeWidth="2"/>
          <path d="M25,75 Q25,25 45,25 Q65,25 65,45 Q65,65 45,65 Q35,65 35,55 Q35,45 45,45 Q55,45 55,55" 
                fill="currentColor" opacity="0.3"/>
          <circle cx="45" cy="45" r="8" fill="currentColor" opacity="0.5"/>
          <circle cx="45" cy="45" r="3" fill="white"/>
        </svg>
      </div>

      <div className="absolute bottom-20 right-32 w-28 h-28 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-300 animate-pulse delay-1000">
          <path d="M30,70 Q30,30 50,30 Q70,30 70,50 Q70,70 50,70 Q40,70 40,60 Q40,50 50,50 Q60,50 60,60" 
                fill="currentColor" opacity="0.4"/>
          <path d="M35,65 Q35,35 50,35 Q65,35 65,50 Q65,65 50,65 Q42,65 42,57 Q42,50 50,50 Q57,50 57,57" 
                fill="none" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </div>

      {/* Lotus Petals */}
      <div className="absolute top-60 left-1/4 w-16 h-16 opacity-25">
        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-400">
          {[...Array(8)].map((_, i) => (
            <g key={i} transform={`rotate(${i * 45} 50 50)`}>
              <ellipse cx="50" cy="25" rx="8" ry="20" fill="currentColor" opacity="0.6"/>
            </g>
          ))}
          <circle cx="50" cy="50" r="12" fill="currentColor" opacity="0.8"/>
          <circle cx="50" cy="50" r="6" fill="white" opacity="0.9"/>
        </svg>
      </div>

      <div className="absolute top-80 right-1/3 w-20 h-20 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-300 animate-spin-slow">
          {[...Array(6)].map((_, i) => (
            <g key={i} transform={`rotate(${i * 60} 50 50)`}>
              <ellipse cx="50" cy="20" rx="6" ry="15" fill="currentColor" opacity="0.5"/>
            </g>
          ))}
          <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.7"/>
        </svg>
      </div>

      {/* Ancient Geometric Patterns */}
      <div className="absolute bottom-60 left-1/3 w-18 h-18 opacity-30">
        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-500">
          <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="3" transform="rotate(45 50 50)"/>
          <circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.6"/>
          <circle cx="50" cy="50" r="8" fill="white" opacity="0.8"/>
        </svg>
      </div>

      <div className="absolute bottom-40 right-1/4 w-14 h-14 opacity-25">
        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-400 animate-pulse delay-2000">
          <polygon points="50,15 65,35 85,35 70,50 85,65 65,65 50,85 35,65 15,65 30,50 15,35 35,35" 
                   fill="currentColor" opacity="0.4"/>
          <circle cx="50" cy="50" r="12" fill="currentColor" opacity="0.6"/>
        </svg>
      </div>

      {/* Traditional Border Elements */}
      <div className="absolute top-32 left-1/2 w-8 h-8 opacity-35">
        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-600">
          <circle cx="50" cy="50" r="40" fill="currentColor" opacity="0.7"/>
          <circle cx="50" cy="50" r="25" fill="white" opacity="0.8"/>
          <circle cx="50" cy="50" r="15" fill="currentColor"/>
        </svg>
      </div>

      {/* Swirl Patterns */}
      <div className="absolute top-96 right-1/2 w-6 h-6 opacity-30">
        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-400 animate-pulse delay-500">
          <path d="M50,10 Q90,10 90,50 Q90,90 50,90 Q10,90 10,50 Q10,30 30,30 Q50,30 50,50" 
                fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
        </svg>
      </div>

      <div className="absolute bottom-80 left-2/3 w-10 h-10 opacity-25">
        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-300">
          <path d="M20,50 Q50,20 80,50 Q50,80 20,50" fill="currentColor" opacity="0.5"/>
          <circle cx="50" cy="50" r="8" fill="white" opacity="0.8"/>
        </svg>
      </div>

      {/* Om Symbol Inspired */}
      <div className="absolute bottom-96 right-2/3 w-12 h-12 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-500">
          <path d="M30,70 Q20,50 30,30 Q50,20 70,40 Q80,60 60,80 Q40,85 30,70" 
                fill="currentColor" opacity="0.4"/>
          <circle cx="45" cy="55" r="8" fill="currentColor" opacity="0.6"/>
          <circle cx="60" cy="45" r="5" fill="currentColor" opacity="0.8"/>
        </svg>
      </div>

      {/* Decorative Dots Pattern */}
      <div className="absolute top-48 left-3/4 w-4 h-4 opacity-40">
        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-600 animate-pulse delay-1500">
          <circle cx="50" cy="50" r="35" fill="currentColor"/>
          <circle cx="50" cy="50" r="20" fill="white" opacity="0.9"/>
          <circle cx="50" cy="50" r="10" fill="currentColor"/>
        </svg>
      </div>

      {/* Additional Traditional Elements */}
      <div className="absolute top-1/3 left-1/5 w-22 h-22 opacity-15">
        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-200 animate-spin-slow">
          <g>
            {[...Array(12)].map((_, i) => (
              <g key={i} transform={`rotate(${i * 30} 50 50)`}>
                <rect x="48" y="10" width="4" height="15" fill="currentColor" opacity="0.6"/>
              </g>
            ))}
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2"/>
            <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.7"/>
          </g>
        </svg>
      </div>

      <div className="absolute top-2/3 right-1/5 w-26 h-26 opacity-18">
        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-250 animate-pulse delay-2500">
          <polygon points="50,5 59,38 92,38 66,59 75,92 50,75 25,92 34,59 8,38 41,38" 
                   fill="currentColor" opacity="0.3"/>
          <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.5"/>
          <circle cx="50" cy="50" r="8" fill="white" opacity="0.8"/>
        </svg>
      </div>
    </div>
  );
};

export default BackgroundDecorations;