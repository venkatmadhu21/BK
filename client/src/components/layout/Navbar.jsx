import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useLoading } from '../../context/LoadingContext';
import BalKrishnaIcon from '../../assets/icons/BalKrishnaIcon';
import ionBalImage from '../../assets/images/ion-bal.jpg';
import { 
  Home, 
  Users, 
  Newspaper, 
  Calendar, 
  User, 
  LogOut, 
  Menu,
  X,
  BookOpen,
  Info,
  Globe,
  ChevronDown,
  Heart
} from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { currentLanguage, languages, changeLanguage, getCurrentLanguage, t } = useLanguage();
  const { showPageLoader } = useLoading();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isTreeDropdownOpen, setIsTreeDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const languageDropdownRef = useRef(null);
  const treeDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsLanguageDropdownOpen(false);
  };

  // Close dropdowns when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
      }
      if (treeDropdownRef.current && !treeDropdownRef.current.contains(event.target)) {
        setIsTreeDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsLanguageDropdownOpen(false);
        setIsTreeDropdownOpen(false);
        setIsUserDropdownOpen(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);



  // Public navigation links (always visible)
  const publicNavLinks = [
    { path: '/', label: t('nav.home'), icon: Home },
    { path: '/about', label: t('nav.family'), icon: Info },
    { path: '/history', label: t('nav.history'), icon: BookOpen },
    { path: '/news', label: t('nav.news'), icon: Newspaper },
    { path: '/events', label: t('nav.events'), icon: Calendar },
    { 
      type: 'dropdown',
      label: t('nav.familyTree'),
      icon: Users,
      items: [
        { path: '/family', label: t('nav.viewTree'), icon: Users },
        { path: '/relationships', label: 'All Relationships', icon: Heart },
        { path: '/new-features', label: 'New Features', icon: Info },
        { path: '/api-test', label: t('nav.apiTest'), icon: Home },
        { path: '/seed', label: t('nav.seedData'), icon: Home },
        { path: '/raw-data', label: t('nav.rawData'), icon: Home }
      ]
    }
  ];

  // Private navigation links (only when authenticated)
  const privateNavLinks = [
    { path: '/dashboard', label: t('nav.dashboard'), icon: Home },
    { path: '/family-tree', label: t('nav.familyTree'), icon: Users },
    { path: '/family', label: t('nav.familyMembers'), icon: Users },
  ];

  return (
    <nav className="fixed top-2 xs:top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-50 w-[98%] xs:w-[96%] max-w-8xl" style={{zIndex: 9999}}>
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 rounded-2xl xs:rounded-3xl sm:rounded-full shadow-2xl backdrop-blur-lg border border-orange-200/40 px-3 xs:px-4 sm:px-6 lg:px-8 py-1">
        <div className="flex justify-between items-center py-1 xs:py-2">
          {/* Logo */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 xs:space-x-3 group"
          >
            <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-white to-orange-50 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 p-0.5 xs:p-1 overflow-hidden">
              <img 
                src={ionBalImage} 
                alt="Bal Krishna Nivas Icon" 
                className="w-full h-full rounded-full object-cover drop-shadow-sm"
              />
            </div>
            <div className="hidden xs:block">
              <h1 className="text-sm xs:text-base sm:text-xl lg:text-2xl font-bold text-white font-serif group-hover:text-orange-100 transition-colors leading-tight">
                {t('home.title')}
              </h1>
              <p className="text-xs xs:text-sm text-orange-100 font-medium leading-tight">{t('home.subtitle')}</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-0.5 lg:space-x-1 xl:space-x-2">
            {/* Public Links */}
            {publicNavLinks.map((item, index) => 
              item.type === 'dropdown' ? (
                <div key={`dropdown-${index}`} className="relative" ref={treeDropdownRef}>
                  <button
                    onClick={() => setIsTreeDropdownOpen(!isTreeDropdownOpen)}
                    className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 xl:px-4 py-1 lg:py-1.5 rounded-full text-sm lg:text-base font-medium transition-all duration-300 
                      text-white hover:text-orange-100 hover:bg-white/25 hover:shadow-md hover:scale-105
                      ${isTreeDropdownOpen ? 'bg-white/25 text-orange-100 shadow-md scale-105' : ''}
                    `}
                  >
                    <item.icon size={16} className="lg:w-[18px] lg:h-[18px]" />
                    <span className="hidden xl:block">{item.label}</span>
                    <span className="xl:hidden text-xs lg:text-sm">{item.label.split(' ')[0]}</span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${isTreeDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isTreeDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg overflow-hidden z-50 w-48">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          onClick={() => {
                            setIsTreeDropdownOpen(false);
                            setIsMenuOpen(false);
                          }}
                          className={`flex items-center space-x-2 px-4 py-2 text-sm hover:bg-orange-50 transition-colors ${
                            isActive(subItem.path) ? 'bg-orange-100 text-orange-700 font-medium' : 'text-gray-700'
                          }`}
                        >
                          <subItem.icon size={16} />
                          <span>{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    console.log('🔍 Link clicked:', item.path);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 xl:px-4 py-1 lg:py-1.5 rounded-full text-sm lg:text-base font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-white text-orange-600 shadow-lg transform scale-105'
                      : 'text-white hover:text-orange-100 hover:bg-white/25 hover:shadow-md hover:scale-105'
                  }`}
                >
                  <item.icon size={16} className="lg:w-[18px] lg:h-[18px]" />
                  <span className="hidden xl:block">{item.label}</span>
                  <span className="xl:hidden text-xs lg:text-sm">{item.label.split(' ')[0]}</span>
                </Link>
              )
            )}

            {/* Private Links (when authenticated) */}
            {isAuthenticated && privateNavLinks.map(({ path, label, icon: Icon }) => (
              <button
                key={path}
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate(path);
                }}
                className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 xl:px-4 py-1 lg:py-1.5 rounded-full text-sm lg:text-base font-medium transition-all duration-300 ${
                  isActive(path)
                    ? 'bg-white text-orange-600 shadow-lg transform scale-105'
                    : 'text-white hover:text-orange-100 hover:bg-white/25 hover:shadow-md hover:scale-105'
                }`}
              >
                <Icon size={16} className="lg:w-[18px] lg:h-[18px]" />
                <span className="hidden xl:block">{label}</span>
                <span className="xl:hidden text-xs lg:text-sm">{label.split(' ')[0]}</span>
              </button>
            ))}

            {/* Language Selector */}
            <div className="relative group ml-1 lg:ml-2" ref={languageDropdownRef}>
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 xl:px-4 py-1 lg:py-1.5 rounded-full text-sm lg:text-base font-medium text-white hover:bg-white/25 transition-all duration-300 hover:scale-105"
              >
                <Globe size={16} className="lg:w-[18px] lg:h-[18px]" />
                <span className="hidden xl:block">
                  {getCurrentLanguage()?.name}
                </span>
                <span className="xl:hidden">
                  {getCurrentLanguage()?.flag}
                </span>
                <ChevronDown size={12} className={`lg:w-[14px] lg:h-[14px] transition-transform duration-200 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Language Dropdown */}
              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl py-2 border border-orange-200 z-50">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors hover:bg-orange-50 ${
                        currentLanguage === language.code 
                          ? 'text-orange-600 bg-orange-50' 
                          : 'text-gray-700 hover:text-orange-600'
                      }`}
                    >
                      <span className="text-lg">{language.flag}</span>
                      <span className="font-medium">{language.name}</span>
                      {currentLanguage === language.code && (
                        <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Section */}
            <div className="ml-1 lg:ml-2 xl:ml-4 pl-1 lg:pl-2 xl:pl-4 border-l border-white/30">
              {isAuthenticated ? (
                <div className="relative" ref={userDropdownRef}>
                  <button 
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 xl:px-4 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      isUserDropdownOpen 
                        ? 'bg-white/25 text-orange-100' 
                        : 'text-white hover:bg-white/25'
                    }`}
                  >
                    <div className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                      <User size={12} className="lg:w-[14px] lg:h-[14px] text-orange-600" />
                    </div>
                    <span className="hidden xl:block">{user?.firstName}</span>
                    <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-orange-200 rounded-full animate-pulse"></div>
                  </button>
                  
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-orange-200">
                    <div className="px-4 py-3 border-b border-orange-100">
                      <p className="text-sm font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setIsUserDropdownOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors rounded-lg mx-2 w-full text-left"
                    >
                      <User size={16} />
                      <span>{t('nav.profile')}</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg mx-2"
                    >
                      <LogOut size={16} />
                      <span>{t('nav.signOut')}</span>
                    </button>
                  </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-0.5 lg:space-x-1 xl:space-x-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-2 lg:px-3 xl:px-4 py-1 lg:py-1.5 text-xs lg:text-sm font-medium text-white hover:text-orange-100 hover:bg-white/25 rounded-full transition-all duration-300 hover:scale-105"
                  >
                    <span className="hidden lg:block">{t('nav.signIn')}</span>
                    <span className="lg:hidden text-xs">{t('nav.signIn')}</span>
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-2 lg:px-3 xl:px-4 xl:px-5 py-1 lg:py-1.5 bg-white text-orange-600 text-xs lg:text-sm font-medium rounded-full hover:bg-orange-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span className="hidden lg:block">{t('nav.joinFamily')}</span>
                    <span className="lg:hidden text-xs">Join</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1.5 xs:p-2 rounded-full text-white hover:bg-white/25 transition-all duration-300 hover:scale-110"
          >
            {isMenuOpen ? <X size={18} className="xs:w-[22px] xs:h-[22px]" /> : <Menu size={18} className="xs:w-[22px] xs:h-[22px]" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 xs:mt-3 sm:mt-4">
            <div className="bg-white rounded-xl xs:rounded-2xl shadow-2xl border border-orange-200 p-3 xs:p-4 space-y-1 xs:space-y-2 max-h-[80vh] overflow-y-auto">
              {/* Public Links */}
              {publicNavLinks.map((item, index) => 
                item.type === 'dropdown' ? (
                  <div key={`mobile-dropdown-${index}`} className="space-y-1">
                    <div className="px-3 xs:px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {item.label}
                    </div>
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        onClick={() => {
                          console.log('🔍 Mobile Dropdown Link clicked:', subItem.path);
                          setIsMenuOpen(false);
                        }}
                        className={`flex items-center space-x-2 xs:space-x-3 px-6 xs:px-8 py-2.5 xs:py-3 rounded-lg xs:rounded-xl text-sm xs:text-base font-medium transition-all duration-300 w-full text-left ${
                          isActive(subItem.path)
                            ? 'bg-orange-600 text-white shadow-lg'
                            : 'text-gray-700 hover:text-orange-600 hover:bg-orange-100'
                        }`}
                      >
                        <subItem.icon size={16} className="xs:w-[18px] xs:h-[18px]" />
                        <span>{subItem.label}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      console.log('🔍 Mobile Link clicked:', item.path);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 xs:space-x-3 px-3 xs:px-4 py-2.5 xs:py-3 rounded-lg xs:rounded-xl text-sm xs:text-base font-medium transition-all duration-300 w-full text-left ${
                      isActive(item.path)
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'text-gray-700 hover:text-orange-600 hover:bg-orange-100'
                    }`}
                  >
                    <item.icon size={16} className="xs:w-[18px] xs:h-[18px]" />
                    <span>{item.label}</span>
                  </Link>
                )
              )}

              {/* Private Links (when authenticated) */}
              {isAuthenticated && (
                <>
                  <div className="border-t border-orange-200 pt-2 mt-2">
                    {privateNavLinks.map(({ path, label, icon: Icon }) => (
                      <button
                        key={path}
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate(path);
                        }}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 w-full text-left ${
                          isActive(path)
                            ? 'bg-orange-600 text-white shadow-lg'
                            : 'text-gray-700 hover:text-orange-600 hover:bg-orange-100'
                        }`}
                      >
                        <Icon size={18} />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="border-t border-orange-200 pt-2 mt-2">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/profile');
                      }}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-100 transition-all duration-300 w-full text-left"
                    >
                      <User size={18} />
                      <span>{t('nav.profile')}</span>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-300"
                    >
                      <LogOut size={18} />
                      <span>{t('nav.signOut')}</span>
                    </button>
                  </div>
                </>
              )}

              {/* Language Selector for Mobile */}
              <div className="border-t border-orange-200 pt-4 mt-4">
                <div className="px-4 py-2">
                  <p className="text-sm font-semibold text-gray-600 mb-2">{t('nav.language')} / भाषा</p>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          currentLanguage === language.code
                            ? 'bg-orange-600 text-white shadow-md'
                            : 'bg-orange-100 text-gray-700 hover:bg-orange-200'
                        }`}
                      >
                        <span>{language.flag}</span>
                        <span>{language.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Auth Section for Mobile */}
              {!isAuthenticated && (
                <div className="border-t border-orange-200 pt-4 mt-4 space-y-2">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/login');
                    }}
                    className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-100 transition-all duration-300 w-full text-left"
                  >
                    {t('nav.signIn')}
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/register');
                    }}
                    className="block px-4 py-3 rounded-xl text-base font-medium bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-lg w-full text-left"
                  >
                    {t('nav.joinFamily')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;