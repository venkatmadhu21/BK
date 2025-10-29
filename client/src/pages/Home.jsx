import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin } from 'lucide-react';
import api from '../utils/api';
import '../styles/heritage-background.css';

// Import images
import paraImage from '../assets/images/para.jpg';
import heroImage from '../assets/images/hero.jpg';
import shivvImage from '../assets/images/shivv.webp';
import deviImage from '../assets/images/devi.png';


const Home = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [latestNews, setLatestNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const heroRef = useRef(null);

  
  useEffect(() => {
    const texts = ['BalKrishna Nivas', 'बाळकृष्ण निवास'];
    const typeSpeed = isDeleting ? 100 : 150;
    const currentText = texts[currentIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.substring(0, displayText.length + 1));
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), 1000);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(currentText.substring(0, displayText.length - 1));
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, typeSpeed);
    
    return () => clearTimeout(timeout);
  }, [displayText, currentIndex, isDeleting]);
  
  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, []);

  // Fetch upcoming events when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchUpcomingEvents = async () => {
        setLoadingEvents(true);
        try {
          const today = new Date().toISOString().split('T')[0];
          const response = await api.get('/api/events', {
            params: {
              status: 'Upcoming',
              limit: 5,
              sortBy: 'startDate',
              sortOrder: 'asc'
            }
          });
          
          // Filter to only show events with startDate > today
          const upcoming = (response.data.events || [])
            .filter(event => {
              const eventDate = new Date(event.startDate).toISOString().split('T')[0];
              return eventDate > today;
            })
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
            .slice(0, 5);
          
          console.log('📅 Fetched Events:', upcoming);
          setUpcomingEvents(upcoming);
        } catch (err) {
          console.error('❌ Failed to fetch upcoming events:', err);
          setUpcomingEvents([]);
        } finally {
          setLoadingEvents(false);
        }
      };

      fetchUpcomingEvents();
    }
  }, [isAuthenticated]);

  // Fetch latest news when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchLatestNews = async () => {
        setLoadingNews(true);
        try {
          const response = await api.get('/api/news', {
            params: {
              limit: 10,
              sortBy: 'publishedDate',
              sortOrder: 'desc'
            }
          });
          
          const news = (response.data.news || []).slice(0, 10);
          console.log('📰 Fetched News:', news);
          setLatestNews(news);
        } catch (err) {
          console.error('❌ Failed to fetch latest news:', err);
          setLatestNews([]);
        } finally {
          setLoadingNews(false);
        }
      };

      fetchLatestNews();
    }
  }, [isAuthenticated]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);



  return (
    <>
      {/* Custom CSS for enhanced animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.3); }
          50% { box-shadow: 0 0 40px rgba(249, 115, 22, 0.6), 0 0 60px rgba(249, 115, 22, 0.4); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .shimmer-effect {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
        
        .glow-effect {
          animation: glow 2s ease-in-out infinite alternate;
        }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
      
      <div className="heritage-bg min-h-screen pt-20 xs:pt-24 sm:pt-28 relative overflow-hidden">
        <div className="heritage-gradient-overlay"></div>
        <div className="heritage-decoration"></div>
        <div className="heritage-decoration"></div>
        <div className="heritage-decoration"></div>
        <div className="heritage-decoration"></div>
        
        
        <div className="heritage-content">
      {/* Hero Section with Three Images */}
      <div id="main-content" ref={heroRef} className="relative overflow-hidden">
        {/* Enhanced Background with Animated Patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
        
        {/* Animated Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 animate-pulse" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #f97316 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, #6b7280 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            animation: 'float 20s ease-in-out infinite'
          }}></div>
        </div>

        {/* Enhanced Floating Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-orange-200/30 to-orange-300/30 rounded-full float-animation" style={{animationDelay: '0s', animationDuration: '6s'}}></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-gray-200/30 to-gray-300/30 rounded-full float-animation" style={{animationDelay: '2s', animationDuration: '8s'}}></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-br from-orange-300/30 to-orange-400/30 rounded-full float-animation" style={{animationDelay: '4s', animationDuration: '7s'}}></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-gray-300/30 to-gray-400/30 rounded-full float-animation" style={{animationDelay: '1s', animationDuration: '9s'}}></div>
        </div>

        {/* Hero Title Section */}
        <div className={`relative z-10 text-center py-4 xs:py-6 sm:py-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="h-12 xs:h-16 sm:h-20 lg:h-24 flex items-center justify-center mb-2 xs:mb-4">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold text-orange-600 tracking-tight min-h-[1.2em] flex items-center justify-center relative glow-effect">
                <span className="font-inter tracking-tight relative bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
                  {displayText}
                  {/* Enhanced Glowing effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent blur-sm opacity-50 animate-pulse shimmer-effect"></div>
                </span>
                <span className={`inline-block w-1 bg-orange-600 ml-2 transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`} style={{height: '0.8em'}}>
                </span>
              </h1>
            </div>
          
            
            {/* Enhanced Decorative Line */}
            <div className={`flex items-center justify-center mt-2 xs:mt-3 sm:mt-4 mb-3 xs:mb-4 sm:mb-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
              <div className="h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent w-16 xs:w-32 sm:w-48 lg:w-64 animate-pulse"></div>
              <div className="mx-2 xs:mx-3 sm:mx-4 w-1.5 h-1.5 xs:w-2 xs:h-2 bg-orange-500 rounded-full animate-bounce shadow-lg"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent w-16 xs:w-32 sm:w-48 lg:w-64 animate-pulse"></div>
            </div>
            
            {/* Enhanced Family Tree - Compact Horizontal Layout */}
            <div className={`mb-4 xs:mb-6 sm:mb-8 w-full max-w-7xl mx-auto px-2 xs:px-4 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="heritage-card bg-gradient-to-r from-orange-50/50 via-white to-orange-50/50 rounded-xl p-3 xs:p-4 sm:p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                {/* Horizontal Tree Layout */}
                <div className="flex flex-wrap items-center justify-center gap-2 xs:gap-3 sm:gap-4 text-xs xs:text-sm sm:text-base">
                  
                  {/* First Generation - Ganesh Gogte (Red) */}
                  <div className="bg-gradient-to-r from-red-500 to-red-400 border border-red-600 rounded-md px-2 xs:px-3 sm:px-4 py-1 xs:py-2 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                    <span className="font-semibold text-white">{t('familyNames.ganeshGogte')}</span>
                  </div>
                  
                  {/* Enhanced Arrow */}
                  <div className="text-orange-500 font-bold animate-pulse">→</div>
                  
                  {/* Second Generation - Balal Gogte (Dark Blue) */}
                  <div className="bg-gradient-to-r from-blue-800 to-blue-700 border border-blue-900 rounded-md px-2 xs:px-3 sm:px-4 py-1 xs:py-2 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                    <span className="font-semibold text-white">{t('familyNames.balalGogte')}</span>
                  </div>
                  
                  {/* Enhanced Arrow */}
                  <div className="text-orange-500 font-bold animate-pulse">→</div>
                  
                  {/* Third Generation - Ramkrishna Gogte (Yellow) */}
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 border border-yellow-500 rounded-md px-2 xs:px-3 sm:px-4 py-1 xs:py-2 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                    <span className="font-semibold text-gray-800">{t('familyNames.ramakrishnaGogte')}</span>
                  </div>
                  
                  {/* Enhanced Arrow */}
                  <div className="text-orange-500 font-bold animate-pulse">→</div>
                  
                  {/* Fourth Generation - Three Brothers (Light Yellow) */}
                  <div className="flex flex-wrap items-center gap-1 xs:gap-2 sm:gap-3">
                    <div className="bg-gradient-to-r from-yellow-200 to-yellow-100 border border-yellow-300 rounded-md px-2 xs:px-3 sm:px-4 py-1 xs:py-2 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                      <span className="font-bold text-gray-800">{t('familyNames.balwantGogte')}</span>
                    </div>
                    
                    <div className="text-orange-400 text-xs animate-pulse">|</div>
                    
                    <div className="bg-gradient-to-r from-yellow-200 to-yellow-100 border border-yellow-300 rounded-md px-2 xs:px-3 sm:px-4 py-1 xs:py-2 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                      <span className="font-bold text-gray-800">{t('familyNames.ganeshGogte2')}</span>
                    </div>
                    
                    <div className="text-orange-400 text-xs animate-pulse">|</div>
                    
                    <div className="bg-gradient-to-r from-yellow-200 to-yellow-100 border border-yellow-300 rounded-md px-2 xs:px-3 sm:px-4 py-1 xs:py-2 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                      <span className="font-bold text-gray-800">{t('familyNames.hariGogte')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className={`relative z-10 container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pb-12 xs:pb-16 sm:pb-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xs:gap-8 sm:gap-10 lg:gap-12 items-center justify-center">
            
            {/* Enhanced Left Image - para.jpg */}
            <div className="flex flex-col items-center group relative">
              <div className="relative w-full max-w-xs xs:max-w-sm transform transition-all duration-700 hover:scale-110 hover:-translate-y-2">
                <div className="relative w-full h-64 xs:h-80 sm:h-96 lg:h-[500px] rounded-2xl xs:rounded-3xl overflow-hidden shadow-2xl bg-white p-1.5 xs:p-2 group-hover:shadow-3xl transition-all duration-500">
                  <div className="w-full h-full rounded-2xl overflow-hidden relative">
                    <img 
                      src={paraImage} 
                      alt="Para" 
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    
                    {/* Fallback content */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white hidden rounded-2xl">
                      <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-lg font-semibold">Sacred Image</p>
                      </div>
                    </div>
                    
                    {/* Enhanced Text Overlay on Image - Parashurama Information */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/50 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-2xl flex items-center justify-center p-2 xs:p-3 sm:p-4 backdrop-blur-sm">
                      <div className="text-center text-white max-h-full overflow-y-auto">
                        {/* Header */}
                        <div className="mb-2 xs:mb-3 sm:mb-4">
                          <h3 className="text-lg xs:text-xl lg:text-2xl font-bold text-orange-300 mb-1 xs:mb-2">परशुराम</h3>
                          <div className="w-12 xs:w-16 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto"></div>
                        </div>
                        
                        {/* Main Text */}
                        <div className="text-xs xs:text-xs sm:text-sm lg:text-sm leading-relaxed font-medium text-gray-100 max-w-full">
                          <p className="text-justify">
                            परशुराम हा जमदग्नी आणि रेणुकेचा मुलगा होता. जमदग्नी ब्राह्मण होता तर रेणुका क्षत्रिय अर्थात योद्धा कुळातील होती. परशुराम हा शिवाचा महान उपासक होता. शस्त्रविद्येत पारंगत असलेला परशुराम गुरु द्रोणाचार्य, कर्ण आणि अर्जुन या महापुरुषांचा तो शिक्षक होता असे मानले जाते. त्याने चित्पावन ब्राह्मण नावाच्या एका लहान समुदायाची चौदा गोत्र निर्माण केली. परशुरामाने चित्पावन ब्राह्मणांना वेद, युद्धनीती आणि युद्ध कला शिकवली. चित्पावन ब्राह्मण परशुरामांना "आदिपुरुष" किंवा मूळ पुरुष म्हणून संबोधतात
                          </p>
                        </div>
                        
                        {/* Footer */}
                        <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 xs:pt-3 border-t border-orange-400/30">
                          <p className="text-xs text-orange-300 font-semibold">विष्णूचा षष्ठ अवतार</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Decorative Elements */}
                <div className="absolute -inset-6 bg-gradient-to-r from-orange-400/20 via-orange-500/25 to-orange-600/20 rounded-3xl -z-10 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="absolute -inset-3 bg-gradient-to-r from-gray-200/50 to-gray-300/50 rounded-3xl -z-20 group-hover:from-gray-300/60 group-hover:to-gray-400/60 transition-all duration-500"></div>
              </div>
              
              {/* Enhanced Image Label */}
              <div className="mt-4 xs:mt-5 sm:mt-6 text-center group-hover:scale-105 transition-all duration-300">
                <h3 className="text-base xs:text-lg font-semibold text-gray-800 mb-1 xs:mb-2 group-hover:text-orange-600 transition-colors duration-300">परशुराम</h3>
                <p className="text-xs xs:text-sm text-gray-600 max-w-xs group-hover:text-gray-700 transition-colors duration-300">विष्णूचा षष्ठ अवतार - योद्धा ब्राह्मण</p>
              </div>
            </div>

            {/* Enhanced Center Image - hero.jpg (Building) */}
            <div className="flex flex-col items-center group">
              <div className="relative w-full max-w-2xl xs:max-w-3xl sm:max-w-4xl lg:max-w-6xl transform transition-all duration-700 hover:scale-110 hover:-translate-y-2">
                <div className="relative w-full h-48 xs:h-56 sm:h-64 md:h-80 lg:h-[400px] rounded-2xl xs:rounded-3xl overflow-hidden shadow-2xl bg-white p-2 xs:p-3 group-hover:shadow-3xl transition-all duration-500">
                  <div className="w-full h-full rounded-2xl overflow-hidden relative">
                    <img 
                      src={heroImage} 
                      alt="BalKrishna Nivas - Building" 
                      className="w-full h-full object-cover object-center transition-all duration-1000 group-hover:scale-105 group-hover:brightness-110"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    
                    {/* Match Parashurama Overlay Style */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/50 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-2xl flex items-center justify-center p-2 xs:p-3 sm:p-4 backdrop-blur-sm">
                      <div className="text-center text-white max-h-full overflow-y-auto">
                        {/* Header */}
                        <div className="mb-2 xs:mb-3 sm:mb-4">
                          <h3 className="text-lg xs:text-xl lg:text-2xl font-bold text-orange-300 mb-1 xs:mb-2">बाळकृष्ण निवास</h3>
                          <div className="w-12 xs:w-16 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto"></div>
                        </div>
                        {/* Summary text */}
                        <div className="text-xs xs:text-xs sm:text-sm lg:text-sm leading-relaxed font-medium text-gray-100 max-w-full">
                          <p className="text-justify">
                            हैदराबादच्या काचीगुडा येथे डॉ. शंकरराव बळवंत गोगटे यांनी १९३१-३३ दरम्यान उभारलेली ही ऐतिहासिक हवेली १९३५ मध्ये त्यांच्या पुत्राच्या नावावर "बाळकृष्ण निवास" म्हणून ओळखली जाऊ लागली.
                          </p>
                        </div>
                        {/* Footer with link */}
                        <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 xs:pt-3 border-t border-orange-400/30">
                          <a href="/about" className="inline-block text-orange-300 hover:text-orange-200 font-semibold text-xs sm:text-sm">अधिक वाचा →</a>
                        </div>
                      </div>
                    </div>
                    
                    {/* Fallback content */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white hidden rounded-2xl">
                      <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-lg font-semibold">Sacred Architecture</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Decorative Elements */}
                <div className="absolute -inset-8 bg-gradient-to-r from-orange-400/10 via-orange-500/15 to-orange-600/10 rounded-3xl -z-10 blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                <div className="absolute -inset-4 bg-gradient-to-r from-gray-200/30 to-gray-300/30 rounded-3xl -z-20 group-hover:from-gray-300/40 group-hover:to-gray-400/40 transition-all duration-500"></div>
                
                {/* Enhanced Floating Orbs with Better Animation */}
                <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full opacity-70 animate-pulse shadow-lg group-hover:scale-110 transition-all duration-500"></div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full opacity-50 animate-bounce shadow-md group-hover:scale-110 transition-all duration-500"></div>
                <div className="absolute top-1/2 -left-10 w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full opacity-60 animate-ping shadow-sm group-hover:scale-125 transition-all duration-500"></div>
                <div className="absolute top-1/4 -right-6 w-6 h-6 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full opacity-40 animate-pulse group-hover:scale-110 transition-all duration-500"></div>
              </div>
              
              {/* Enhanced Building Label */}
              <div className="mt-4 xs:mt-6 sm:mt-8 text-center max-w-2xl px-2 xs:px-4 group-hover:scale-105 transition-all duration-300">
                <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800 mb-2 xs:mb-3 group-hover:text-orange-600 transition-colors duration-300">{t('home.buildingName')}</h3>
                <p className="text-sm xs:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{t('home.architecturalMarvel')}</p>
              </div>
            </div>

            {/* Enhanced Right Column - shivv.webp and devi.png */}
            <div className="flex flex-col justify-center space-y-6 xs:space-y-8">
              {/* Enhanced Shivv Image - Clickable */}
              <div className="flex flex-col items-center group relative">
                <Link 
                  to="/vyadeshwar-temple"
                  className="relative w-full max-w-[180px] xs:max-w-[200px] sm:max-w-[220px] transform transition-all duration-700 hover:scale-115 hover:-translate-y-2 cursor-pointer"
                >
                  <div className="relative w-full h-36 xs:h-40 sm:h-44 lg:h-52 rounded-xl xs:rounded-2xl overflow-hidden shadow-xl bg-white p-1.5 xs:p-2 group-hover:shadow-2xl transition-all duration-500">
                    <div className="w-full h-full rounded-xl overflow-hidden">
                      <img 
                        src={shivvImage} 
                        alt="Shivv - Click to learn about Vyadeshwar Temple" 
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      
                      {/* Fallback content */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white hidden rounded-xl">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-1 bg-white/20 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-xs font-semibold">Lord Shiva</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Click Overlay */}
                    <div className="absolute inset-2 bg-gradient-to-t from-orange-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-orange-800 shadow-lg group-hover:scale-110 transition-all duration-300">
                        {t('home.clickToLearnMore') || 'Click to learn more'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Decorative Elements */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-orange-400/20 to-orange-600/20 rounded-2xl -z-10 blur-lg group-hover:blur-xl transition-all duration-500"></div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-gray-200/40 to-gray-300/40 rounded-2xl -z-20 group-hover:from-gray-300/50 group-hover:to-gray-400/50 transition-all duration-500"></div>
                </Link>
                
                {/* Enhanced Image Label */}
                <div className="mt-3 xs:mt-4 text-center group-hover:scale-105 transition-all duration-300">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg p-1.5 xs:p-2 border border-gray-200 group-hover:border-orange-300 group-hover:from-orange-50 group-hover:to-orange-100 transition-all duration-300">
                    <p className="text-xs font-medium text-gray-700 group-hover:text-orange-700 transition-colors duration-300">Vyadeshwar, Guhagar</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Devi Image */}
              <div className="flex flex-col items-center group">
                <div 
                  className="relative w-full max-w-[180px] xs:max-w-[200px] sm:max-w-[220px] transform transition-all duration-700 hover:scale-115 hover:-translate-y-2 cursor-pointer"
                  onClick={() => navigate('/yogeshwari-devi')}
                >
                  <div className="relative w-full h-36 xs:h-40 sm:h-44 lg:h-52 rounded-xl xs:rounded-2xl overflow-hidden shadow-xl bg-white p-1.5 xs:p-2 group-hover:shadow-2xl transition-all duration-500">
                    <div className="w-full h-full rounded-xl overflow-hidden">
                      <img 
                        src={deviImage} 
                        alt="Devi" 
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 cursor-pointer"
                        onClick={() => navigate('/yogeshwari-devi')}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      
                      {/* Fallback content */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white hidden rounded-xl">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-1 bg-white/20 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                         
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Hover Overlay with Click Indicator */}
                    <div 
                      className="absolute inset-2 bg-gradient-to-t from-orange-900/90 via-orange-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl flex items-center justify-center cursor-pointer backdrop-blur-sm"
                      onClick={() => navigate('/yogeshwari-devi')}
                    >
                      <div className="text-center text-white pointer-events-none group-hover:scale-110 transition-all duration-300">
                        <div className="text-2xl mb-2 animate-pulse">🕉️</div>
                        <p className="text-sm font-semibold">योगेश्वरी देवी</p>
                        <p className="text-xs opacity-90">Click to learn more</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Decorative Elements */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-orange-400/20 to-orange-600/20 rounded-2xl -z-10 blur-lg group-hover:blur-xl transition-all duration-500"></div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-gray-200/40 to-gray-300/40 rounded-2xl -z-20 group-hover:from-gray-300/50 group-hover:to-gray-400/50 transition-all duration-500"></div>
                </div>
                
                {/* Enhanced Image Label */}
                <div className="mt-3 xs:mt-4 text-center group-hover:scale-105 transition-all duration-300">
                   <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-lg p-2 xs:p-3 border-2 border-orange-300 shadow-md group-hover:shadow-lg group-hover:border-orange-400 group-hover:from-orange-200 group-hover:to-orange-100 transition-all duration-300">
                    <p className="text-sm xs:text-base font-bold text-orange-800 group-hover:text-orange-900 transition-colors duration-300">योगेश्वरी देवी, अंबाजोगाई</p>
                    <p className="text-xs text-orange-600 mt-1 group-hover:text-orange-700 transition-colors duration-300">👆 Click to learn more</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="relative z-10 py-12 xs:py-16 sm:py-20 bg-gradient-to-r from-gray-50 to-gray-100 overflow-hidden">
          <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
             </div>
            
            {/* Enhanced Animated Welcome Video-like Section */}
            <div className="relative w-full max-w-5xl mx-auto">
              <div className="heritage-card relative bg-gradient-to-br from-orange-900 via-orange-800 to-orange-700 rounded-2xl xs:rounded-3xl p-6 xs:p-8 sm:p-10 lg:p-12 shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500">
                {/* Enhanced Animated Background Elements */}
                <div className="absolute inset-0 opacity-40">
                  <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full animate-pulse shadow-lg"></div>
                  <div className="absolute top-20 right-20 w-16 h-16 bg-yellow-300 rounded-full animate-bounce shadow-md"></div>
                  <div className="absolute bottom-20 left-20 w-12 h-12 bg-orange-300 rounded-full animate-pulse shadow-lg"></div>
                  <div className="absolute bottom-10 right-10 w-24 h-24 bg-yellow-200 rounded-full animate-bounce shadow-md"></div>
                </div>
                
                {/* Enhanced Floating Particles */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-ping shadow-sm"></div>
                  <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-yellow-300 rounded-full animate-ping shadow-sm"></div>
                  <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-orange-300 rounded-full animate-ping shadow-sm"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-yellow-200 rounded-full animate-ping shadow-sm"></div>
                  <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping shadow-sm"></div>
                  <div className="absolute top-2/3 left-1/5 w-2 h-2 bg-orange-400 rounded-full animate-ping shadow-sm"></div>
                </div>
                
                {/* Enhanced Main Content */}
                <div className="relative z-10 text-center">
                  {/* Enhanced Decorative Top Border */}
                  <div className="flex items-center justify-center mb-8">
                    <div className="h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-32 animate-pulse shadow-lg"></div>
                    <div className="mx-4 w-4 h-4 bg-yellow-400 rounded-full animate-bounce shadow-lg"></div>
                    <div className="h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-32 animate-pulse shadow-lg"></div>
                  </div>
                  
                  {/* Enhanced Main Animated Text */}
                  <div className="mb-6 xs:mb-8">
                    <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-6xl font-bold text-yellow-300 mb-3 xs:mb-4 animate-pulse drop-shadow-2xl hover:scale-105 transition-all duration-300">
                      स्वागत आहे
                    </h2>
                    <h3 className="text-xl xs:text-2xl sm:text-3xl lg:text-5xl font-bold text-white animate-bounce drop-shadow-2xl hover:scale-105 transition-all duration-300">
                      बाळकृष्ण निवास
                    </h3>
                  </div>
                  
                  {/* Enhanced Animated Subtitle */}
                  <div className="text-sm xs:text-base sm:text-lg lg:text-xl text-yellow-200 font-medium">
                    <p className="animate-pulse drop-shadow-lg hover:scale-105 transition-all duration-300">{t('home.heartfeltWelcome')}</p>
                  </div>
                  
                  {/* Enhanced Decorative Bottom Border */}
                  <div className="flex items-center justify-center mt-8">
                    <div className="h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-32 animate-pulse shadow-lg"></div>
                    <div className="mx-4 w-4 h-4 bg-yellow-400 rounded-full animate-bounce shadow-lg"></div>
                    <div className="h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-32 animate-pulse shadow-lg"></div>
                  </div>
                </div>
                
                {/* Enhanced Glowing Border Effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-3xl opacity-60 blur-xl animate-pulse shadow-2xl"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 rounded-3xl opacity-40 blur-lg animate-pulse shadow-xl"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events Section - Only show when authenticated and events exist */}
        {isAuthenticated && upcomingEvents.length > 0 && (
          <div className="relative z-10 py-16 xs:py-20 sm:py-24 bg-gradient-to-r from-white via-orange-50 to-white overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 right-10 w-32 h-32 bg-orange-200/20 rounded-full animate-pulse"></div>
              <div className="absolute bottom-10 left-10 w-24 h-24 bg-orange-300/20 rounded-full animate-bounce"></div>
              <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-orange-400/15 rounded-full animate-ping"></div>
            </div>

            <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 relative z-10">
              {/* Section Header */}
              <div className="text-center mb-12 xs:mb-16">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Calendar className="text-orange-600" size={28} />
                  <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                    Upcoming Events
                  </h2>
                </div>
                <p className="text-gray-600 text-sm xs:text-base sm:text-lg max-w-2xl mx-auto">
                  Don't miss our upcoming family gatherings and celebrations
                </p>
              </div>

              {/* Events Grid */}
              {loadingEvents ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 mb-8">
                  {upcomingEvents.map((event, index) => (
                    <div
                      key={event._id || event.id}
                      className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer border border-gray-100 hover:border-orange-300"
                      onClick={() => navigate('/events')}
                    >
                      {/* Event Image */}
                      {event.images && event.images.length > 0 && (
                        <div className="relative h-40 xs:h-48 overflow-hidden bg-gradient-to-br from-orange-200 to-orange-100">
                          <img
                            src={event.images[0].thumbnail || event.images[0].url}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>
                      )}

                      {/* Event Details */}
                      <div className="p-4 xs:p-5 sm:p-6">
                        {/* Event Type Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            event.eventType === 'Birthday' ? 'bg-pink-100 text-pink-800' :
                            event.eventType === 'Anniversary' ? 'bg-red-100 text-red-800' :
                            event.eventType === 'Wedding' ? 'bg-purple-100 text-purple-800' :
                            event.eventType === 'Festival' ? 'bg-blue-100 text-blue-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {event.eventType}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            event.priority === 'High' ? 'bg-red-100 text-red-800' :
                            event.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {event.priority}
                          </span>
                        </div>

                        {/* Event Title */}
                        <h3 className="text-lg xs:text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300 line-clamp-2">
                          {event.title}
                        </h3>

                        {/* Event Meta Info */}
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-orange-500 flex-shrink-0" />
                            <span className="truncate">
                              {new Date(event.startDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-orange-500 flex-shrink-0" />
                            <span>{event.startTime}</span>
                          </div>
                          {event.venue?.name && (
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-orange-500 flex-shrink-0" />
                              <span className="truncate">{event.venue.name}</span>
                            </div>
                          )}
                        </div>

                        {/* Description Preview */}
                        {event.description && (
                          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        {/* View More Button */}
                        <button className="mt-4 w-full py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-medium text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* View All Events Button */}
              <div className="text-center">
                <button
                  onClick={() => navigate('/events')}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white text-orange-600 font-semibold rounded-xl shadow-lg hover:shadow-xl border-2 border-orange-600 hover:bg-orange-50 transition-all duration-300 hover:scale-105"
                >
                  View All Events
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Call to Action Section */}
        <div className="relative z-10 py-20 bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 bg-orange-200/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-orange-300/20 rounded-full animate-bounce"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-orange-400/15 rounded-full animate-ping"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6 hover:scale-105 transition-all duration-300">{t('home.welcome')}</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto hover:scale-105 transition-all duration-300">
              {t('home.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:scale-105"
              >
                {t('home.joinUs')}
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-200 hover:border-orange-300 hover:scale-105 hover:bg-orange-50"
              >
                {t('home.learnMore')}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-orange-50 to-transparent"></div>
        
        {/* Enhanced Floating Background Elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-orange-200/30 rounded-full blur-3xl animate-pulse shadow-lg"></div>
        <div className="absolute top-3/4 right-10 w-24 h-24 bg-gray-300/30 rounded-full blur-2xl animate-bounce shadow-md"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-orange-300/25 rounded-full blur-xl animate-ping shadow-sm"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-orange-400/20 rounded-full blur-2xl animate-pulse shadow-md"></div>
        <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-gray-400/25 rounded-full blur-lg animate-bounce shadow-sm"></div>
      </div>
        </div>
      </div>
    </>
  );
};

export default Home;