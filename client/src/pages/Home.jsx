import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// Import images
import paraImage from '../assets/images/para.jpg';
import heroImage from '../assets/images/hero.jpg';
import shivvImage from '../assets/images/shivv.webp';
import deviImage from '../assets/images/devi.png';


const Home = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  
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



  return (
    <>
      
      <div className="min-h-screen pt-20 xs:pt-24 sm:pt-28 relative bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section with Three Images */}
      <div id="main-content" className="relative overflow-hidden">
        {/* Enhanced Background with Patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #f97316 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, #6b7280 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Hero Title Section */}
        <div className="relative z-10 text-center py-4 xs:py-6 sm:py-8">
          <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="h-12 xs:h-16 sm:h-20 lg:h-24 flex items-center justify-center mb-2 xs:mb-4">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent tracking-tight min-h-[1.2em] flex items-center">
                <span className="font-inter tracking-tight">
                  {displayText || 'BalKrishna Nivas'}
                </span>
                <span className={`inline-block w-1 bg-orange-600 ml-2 transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`} style={{height: '0.8em'}}>
                </span>
              </h1>
            </div>
          
            
            {/* Decorative Line */}
            <div className="flex items-center justify-center mt-2 xs:mt-3 sm:mt-4 mb-3 xs:mb-4 sm:mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent w-16 xs:w-32 sm:w-48 lg:w-64"></div>
              <div className="mx-2 xs:mx-3 sm:mx-4 w-1.5 h-1.5 xs:w-2 xs:h-2 bg-orange-500 rounded-full"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent w-16 xs:w-32 sm:w-48 lg:w-64"></div>
            </div>
            
            {/* Family Tree - Compact Horizontal Layout */}
            <div className="mb-4 xs:mb-6 sm:mb-8 w-full max-w-7xl mx-auto px-2 xs:px-4">
              <div className="bg-gradient-to-r from-orange-50/50 via-white to-orange-50/50 rounded-xl p-3 xs:p-4 sm:p-6 shadow-sm border border-orange-100">
                {/* Horizontal Tree Layout */}
                <div className="flex flex-wrap items-center justify-center gap-2 xs:gap-3 sm:gap-4 text-xs xs:text-sm sm:text-base">
                  
                  {/* First Generation - Ganesh Gogte (Red) */}
                  <div className="bg-gradient-to-r from-red-500 to-red-400 border border-red-600 rounded-md px-2 xs:px-3 sm:px-4 py-1 xs:py-2 shadow-sm">
                    <span className="font-semibold text-white">{t('familyNames.ganeshGogte')}</span>
                  </div>
                  
                  {/* Arrow */}
                  <div className="text-orange-500 font-bold">→</div>
                  
                  {/* Second Generation - Balal Gogte (Dark Blue) */}
                  <div className="bg-gradient-to-r from-blue-800 to-blue-700 border border-blue-900 rounded-md px-2 xs:px-3 sm:px-4 py-1 xs:py-2 shadow-sm">
                    <span className="font-semibold text-white">{t('familyNames.balalGogte')}</span>
                  </div>
                  
                  {/* Arrow */}
                  <div className="text-orange-500 font-bold">→</div>
                  
                  {/* Third Generation - Ramkrishna Gogte (Yellow) */}
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 border border-yellow-500 rounded-md px-2 xs:px-3 sm:px-4 py-1 xs:py-2 shadow-sm">
                    <span className="font-semibold text-gray-800">{t('familyNames.ramakrishnaGogte')}</span>
                  </div>
                  
                  {/* Arrow */}
                  <div className="text-orange-500 font-bold">→</div>
                  
                  {/* Fourth Generation - Three Brothers (Light Yellow) */}
                  <div className="flex flex-wrap items-center gap-1 xs:gap-2 sm:gap-3">
                    <div className="bg-gradient-to-r from-yellow-200 to-yellow-100 border border-yellow-300 rounded-md px-2 xs:px-3 sm:px-4 py-1 xs:py-2 shadow-sm">
                      <span className="font-bold text-gray-800">{t('familyNames.balwantGogte')}</span>
                    </div>
                    
                    <div className="text-orange-400 text-xs">|</div>
                    
                    <div className="bg-gradient-to-r from-yellow-200 to-yellow-100 border border-yellow-300 rounded-md px-2 xs:px-3 sm:px-4 py-1 xs:py-2 shadow-sm">
                      <span className="font-bold text-gray-800">{t('familyNames.ganeshGogte2')}</span>
                    </div>
                    
                    <div className="text-orange-400 text-xs">|</div>
                    
                    <div className="bg-gradient-to-r from-yellow-200 to-yellow-100 border border-yellow-300 rounded-md px-2 xs:px-3 sm:px-4 py-1 xs:py-2 shadow-sm">
                      <span className="font-bold text-gray-800">{t('familyNames.hariGogte')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pb-12 xs:pb-16 sm:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xs:gap-8 sm:gap-10 lg:gap-12 items-center justify-center">
            
            {/* Left Image - para.jpg */}
            <div className="flex flex-col items-center group relative">
              <div className="relative w-full max-w-xs xs:max-w-sm transform transition-all duration-500 hover:scale-105">
                <div className="relative w-full h-64 xs:h-80 sm:h-96 lg:h-[500px] rounded-2xl xs:rounded-3xl overflow-hidden shadow-2xl bg-white p-1.5 xs:p-2">
                  <div className="w-full h-full rounded-2xl overflow-hidden relative">
                    <img 
                      src={paraImage} 
                      alt="Para" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
                    
                    {/* Text Overlay on Image - Parashurama Information */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl flex items-center justify-center p-2 xs:p-3 sm:p-4">
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
                <div className="absolute -inset-6 bg-gradient-to-r from-orange-400/10 via-orange-500/15 to-orange-600/10 rounded-3xl -z-10 blur-xl"></div>
                <div className="absolute -inset-3 bg-gradient-to-r from-gray-200/50 to-gray-300/50 rounded-3xl -z-20"></div>
              </div>
              
              {/* Image Label */}
              <div className="mt-4 xs:mt-5 sm:mt-6 text-center">
                <h3 className="text-base xs:text-lg font-semibold text-gray-800 mb-1 xs:mb-2">परशुराम</h3>
                <p className="text-xs xs:text-sm text-gray-600 max-w-xs">विष्णूचा षष्ठ अवतार - योद्धा ब्राह्मण</p>
              </div>
            </div>

            {/* Center Image - hero.jpg (Building) */}
            <div className="flex flex-col items-center group">
              <div className="relative w-full max-w-2xl xs:max-w-3xl sm:max-w-4xl lg:max-w-6xl transform transition-all duration-700 hover:scale-[1.02]">
                <div className="relative w-full h-48 xs:h-56 sm:h-64 md:h-80 lg:h-[400px] rounded-2xl xs:rounded-3xl overflow-hidden shadow-2xl bg-white p-2 xs:p-3">
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
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 via-transparent to-transparent"></div>
                    
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
                <div className="absolute -inset-8 bg-gradient-to-r from-orange-400/5 via-orange-500/10 to-orange-600/5 rounded-3xl -z-10 blur-2xl"></div>
                <div className="absolute -inset-4 bg-gradient-to-r from-gray-200/30 to-gray-300/30 rounded-3xl -z-20"></div>
                
                {/* Floating Orbs with Enhanced Animation */}
                <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full opacity-70 animate-pulse shadow-lg"></div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full opacity-50 animate-bounce shadow-md"></div>
                <div className="absolute top-1/2 -left-10 w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full opacity-60 animate-ping shadow-sm"></div>
                <div className="absolute top-1/4 -right-6 w-6 h-6 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full opacity-40 animate-pulse"></div>
              </div>
              
              {/* Building Label */}
              <div className="mt-4 xs:mt-6 sm:mt-8 text-center max-w-2xl px-2 xs:px-4">
                <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800 mb-2 xs:mb-3">{t('home.buildingName')}</h3>
                <p className="text-sm xs:text-base text-gray-600 leading-relaxed">{t('home.architecturalMarvel')}</p>
              </div>
            </div>

            {/* Right Column - shivv.webp and devi.png */}
            <div className="flex flex-col justify-center space-y-6 xs:space-y-8">
              {/* Shivv Image - Clickable */}
              <div className="flex flex-col items-center group relative">
                <Link 
                  to="/vyadeshwar-temple"
                  className="relative w-full max-w-[180px] xs:max-w-[200px] sm:max-w-[220px] transform transition-all duration-500 hover:scale-110 cursor-pointer"
                >
                  <div className="relative w-full h-36 xs:h-40 sm:h-44 lg:h-52 rounded-xl xs:rounded-2xl overflow-hidden shadow-xl bg-white p-1.5 xs:p-2">
                    <div className="w-full h-full rounded-xl overflow-hidden">
                      <img 
                        src={shivvImage} 
                        alt="Shivv - Click to learn about Vyadeshwar Temple" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
                    
                    {/* Click Overlay */}
                    <div className="absolute inset-2 bg-gradient-to-t from-orange-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-orange-800 shadow-lg">
                        {t('home.clickToLearnMore') || 'Click to learn more'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Decorative Elements */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-orange-400/15 to-orange-600/15 rounded-2xl -z-10 blur-lg"></div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-gray-200/40 to-gray-300/40 rounded-2xl -z-20"></div>
                </Link>
                
                {/* Image Label */}
                <div className="mt-3 xs:mt-4 text-center">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg p-1.5 xs:p-2 border border-gray-200">
                    <p className="text-xs font-medium text-gray-700">Vyadeshwar, Guhagar</p>
                  </div>
                </div>
              </div>

              {/* Devi Image */}
              <div className="flex flex-col items-center group">
                <div 
                  className="relative w-full max-w-[180px] xs:max-w-[200px] sm:max-w-[220px] transform transition-all duration-500 hover:scale-110 cursor-pointer"
                  onClick={() => navigate('/yogeshwari-devi')}
                >
                  <div className="relative w-full h-36 xs:h-40 sm:h-44 lg:h-52 rounded-xl xs:rounded-2xl overflow-hidden shadow-xl bg-white p-1.5 xs:p-2">
                    <div className="w-full h-full rounded-xl overflow-hidden">
                      <img 
                        src={deviImage} 
                        alt="Devi" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"
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
                    
                    {/* Hover Overlay with Click Indicator */}
                    <div 
                      className="absolute inset-2 bg-gradient-to-t from-orange-900/80 via-orange-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center cursor-pointer"
                      onClick={() => navigate('/yogeshwari-devi')}
                    >
                      <div className="text-center text-white pointer-events-none">
                        <div className="text-2xl mb-2">🕉️</div>
                        <p className="text-sm font-semibold">योगेश्वरी देवी</p>
                        <p className="text-xs opacity-90">Click to learn more</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Decorative Elements */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-orange-400/15 to-orange-600/15 rounded-2xl -z-10 blur-lg"></div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-gray-200/40 to-gray-300/40 rounded-2xl -z-20"></div>
                </div>
                
                {/* Image Label */}
                <div className="mt-3 xs:mt-4 text-center">
                   <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-lg p-2 xs:p-3 border-2 border-orange-300 shadow-md">
                    <p className="text-sm xs:text-base font-bold text-orange-800">योगेश्वरी देवी, अंबाजोगाई</p>
                    <p className="text-xs text-orange-600 mt-1">👆 Click to learn more</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Features Section */}
        <div className="relative z-10 py-12 xs:py-16 sm:py-20 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
             </div>
            
            {/* Animated Welcome Video-like Section */}
            <div className="relative w-full max-w-5xl mx-auto">
              <div className="relative bg-gradient-to-br from-orange-900 via-orange-800 to-orange-700 rounded-2xl xs:rounded-3xl p-6 xs:p-8 sm:p-10 lg:p-12 shadow-2xl overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full animate-pulse"></div>
                  <div className="absolute top-20 right-20 w-16 h-16 bg-yellow-300 rounded-full animate-bounce"></div>
                  <div className="absolute bottom-20 left-20 w-12 h-12 bg-orange-300 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-10 right-10 w-24 h-24 bg-yellow-200 rounded-full animate-bounce"></div>
                </div>
                
                {/* Floating Particles */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                  <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                  <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-orange-300 rounded-full animate-ping"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-yellow-200 rounded-full animate-ping"></div>
                </div>
                
                {/* Main Content */}
                <div className="relative z-10 text-center">
                  {/* Decorative Top Border */}
                  <div className="flex items-center justify-center mb-8">
                    <div className="h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-32 animate-pulse"></div>
                    <div className="mx-4 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
                    <div className="h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-32 animate-pulse"></div>
                  </div>
                  
                  {/* Main Animated Text */}
                  <div className="mb-6 xs:mb-8">
                    <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-6xl font-bold text-yellow-300 mb-3 xs:mb-4 animate-pulse drop-shadow-2xl">
                      स्वागत आहे
                    </h2>
                    <h3 className="text-xl xs:text-2xl sm:text-3xl lg:text-5xl font-bold text-white animate-bounce drop-shadow-2xl">
                      बाळकृष्ण निवास
                    </h3>
                  </div>
                  
                  {/* Animated Subtitle */}
                  <div className="text-sm xs:text-base sm:text-lg lg:text-xl text-yellow-200 font-medium">
                    <p className="animate-pulse drop-shadow-lg">{t('home.heartfeltWelcome')}</p>
                  </div>
                  
                  {/* Decorative Bottom Border */}
                  <div className="flex items-center justify-center mt-8">
                    <div className="h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-32 animate-pulse"></div>
                    <div className="mx-4 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
                    <div className="h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-32 animate-pulse"></div>
                  </div>
                </div>
                
                {/* Enhanced Glowing Border Effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-3xl opacity-50 blur-xl animate-pulse"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 rounded-3xl opacity-30 blur-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="relative z-10 py-20 bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">{t('home.welcome')}</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('home.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-orange-600 hover:to-orange-700"
              >
                {t('home.joinUs')}
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-200 hover:border-orange-300"
              >
                {t('home.learnMore')}
              </button>

            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-orange-50 to-transparent"></div>
        
        {/* Floating Background Elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-10 w-24 h-24 bg-gray-300/20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-orange-300/15 rounded-full blur-xl animate-ping"></div>
      </div>
      </div>
    </>
  );
};

export default Home;