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
  Image as ImageIcon,
  Info,
  Globe,
  ChevronDown,
  Shield
} from 'lucide-react';

const NavbarWithDropdown = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { currentLanguage, languages, changeLanguage, getCurrentLanguage, t } = useLanguage();
  const { showPageLoader } = useLoading();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isTreeDropdownOpen, setIsTreeDropdownOpen] = useState(false);
  const languageDropdownRef = useRef(null);
  const treeDropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsLanguageDropdownOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
      }
      if (treeDropdownRef.current && !treeDropdownRef.current.contains(event.target)) {
        setIsTreeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

// Public navigation links (always visible)
const publicNavLinks = [
  { path: '/', label: t('nav.home'), icon: Home },
  { path: '/about', label: t('nav.family'), icon: Info },
  { path: '/media', label: t('nav.media'), icon: ImageIcon },
  { path: '/news', label: t('nav.news'), icon: Newspaper },
  { path: '/events', label: t('nav.events'), icon: Calendar },

  // Replace Family Tree dropdown with a single button
  { path: '/family', label: 'Family Tree', icon: Users },
];

// Private navigation links (only when authenticated)
const privateNavLinks = isAuthenticated
  ? user?.role === 'admin'
    ? [{ path: '/admin', label: 'Dashboard', icon: Shield }]
    : [{ path: '/dashboard', label: 'Dashboard', icon: Home }]
  : [];

  return (
    <nav className="fixed top-2 xs:top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-50 w-[98%] xs:w-[96%] max-w-8xl" style={{zIndex: 9999}}>
      <div className="rounded-2xl xs:rounded-3xl sm:rounded-full shadow-2xl backdrop-blur-lg border border-orange-100/60 px-3 xs:px-4 sm:px-6 lg:px-8 py-1 hover:shadow-orange-200/50 transition-shadow duration-300 relative overflow-visible animate-navbar-gradient bg-gradient-to-r from-orange-100 via-orange-300 to-orange-200">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/20 via-transparent to-orange-100/20 rounded-2xl xs:rounded-3xl sm:rounded-full pointer-events-none"></div>
        <div className="relative flex justify-between items-center py-1 xs:py-2" style={{ clipPath: 'none' }}>
          {/* Logo */}
          <button 
            onClick={() => {
              navigate('/');
              setIsMenuOpen(false);
            }}
            className="flex items-center space-x-2 xs:space-x-3 group"
          >
            <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-orange-300 shadow-lg group-hover:shadow-xl group-hover:shadow-orange-200/60 transition-all duration-300 group-hover:scale-105">
              <img
                src={ionBalImage}
                alt="Bal Krishna"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-gray-800">
              <h1 className="text-sm xs:text-base sm:text-lg font-bold leading-tight text-orange-800">Bal Krishna Nivas</h1>
              <p className="text-xs xs:text-sm text-orange-600 font-medium leading-tight">{t('home.subtitle')}</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-0.5 lg:space-x-1 xl:space-x-2">
            {/* Public Links */}
            {publicNavLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  setIsMenuOpen(false);
                }}
                className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 xl:px-4 py-1 lg:py-1.5 rounded-full text-sm lg:text-base font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-white text-orange-700 shadow-lg transform scale-105'
                    : 'text-gray-700 hover:text-orange-800 hover:bg-orange-100/50 hover:shadow-md hover:scale-105'
                }`}
              >
                <item.icon size={16} className="lg:w-[18px] lg:h-[18px]" />
                <span className="hidden xl:block">{item.label}</span>
                <span className="xl:hidden text-xs lg:text-sm">{item.label.split(' ')[0]}</span>
              </Link>
            ))}

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
                    ? 'bg-white text-orange-700 shadow-lg transform scale-105'
                    : 'text-gray-700 hover:text-orange-800 hover:bg-orange-100/50 hover:shadow-md hover:scale-105'
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
                className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 xl:px-4 py-1 lg:py-1.5 rounded-full text-sm lg:text-base font-medium text-gray-700 hover:bg-orange-100/50 hover:text-orange-800 transition-all duration-300 hover:scale-105"
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

            {/* User Menu (when authenticated) */}
            {isAuthenticated ? (
              <div className="relative group ml-1 lg:ml-2">
                <button className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 xl:px-4 py-1 lg:py-1.5 rounded-full text-sm lg:text-base font-medium text-gray-700 hover:bg-orange-100/50 hover:text-orange-800 transition-all duration-300 hover:scale-105">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={`${user?.firstName || 'User'} avatar`}
                      className="w-6 h-6 lg:w-7 lg:h-7 rounded-full object-cover ring-2 ring-orange-300/50"
                    />
                  ) : (
                    <User size={16} className="lg:w-[18px] lg:h-[18px]" />
                  )}
                  <span className="hidden xl:block">{user?.firstName}</span>
                </button>
                
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[12000] border border-orange-200">
                  <div className="px-4 py-3 border-b border-orange-100">
                    <div className="flex items-center space-x-3">
                      {user?.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={`${user?.firstName || 'User'} avatar`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center">
                          <User size={16} />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/profile')}
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
              </div>
            ) : (
              <div className="flex items-center space-x-0.5 lg:space-x-1 xl:space-x-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-2 lg:px-3 xl:px-4 py-1 lg:py-1.5 text-xs lg:text-sm font-medium text-gray-700 hover:text-orange-800 hover:bg-orange-100/50 rounded-full transition-all duration-300 hover:scale-105"
                >
                  <span className="hidden lg:block">{t('nav.signIn')}</span>
                  <span className="lg:hidden text-xs">{t('nav.signIn')}</span>
                </button>
                <button
                  onClick={() => navigate('/family-form')}
                  className="px-2 lg:px-3 xl:px-4 xl:px-5 py-1 lg:py-1.5 bg-orange-500 text-white text-xs lg:text-sm font-medium rounded-full hover:bg-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="hidden lg:block">{t('nav.joinFamily')}</span>
                  <span className="lg:hidden text-xs">Join</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1.5 xs:p-2 rounded-full text-gray-700 hover:bg-orange-100/50 hover:text-orange-800 transition-all duration-300 hover:scale-110"
          >
            {isMenuOpen ? <X size={18} className="xs:w-[22px] xs:h-[22px]" /> : <Menu size={18} className="xs:w-[22px] xs:h-[22px]" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 xs:mt-3 sm:mt-4">
            <div className="bg-white rounded-xl xs:rounded-2xl shadow-2xl border border-orange-200 p-3 xs:p-4 space-y-1 xs:space-y-2 max-h-[80vh] overflow-y-auto">
              {/* Public Links */}
              {publicNavLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 px-3 xs:px-4 py-2 xs:py-2.5 rounded-lg text-sm xs:text-base font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-700 hover:bg-orange-50 hover:text-orange-700'
                  }`}
                >
                  <item.icon size={18} className="xs:w-[22px] xs:h-[22px]" />
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Private Links (when authenticated) */}
              {isAuthenticated && (
                <>
                  <div className="border-t border-gray-100 my-2"></div>
                  {privateNavLinks.map(({ path, label, icon: Icon }) => (
                    <button
                      key={path}
                      onClick={() => {
                        navigate(path);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 xs:px-4 py-2 xs:py-2.5 rounded-lg text-sm xs:text-base font-medium transition-all duration-300 ${
                        isActive(path)
                          ? 'bg-orange-100 text-orange-700'
                          : 'text-gray-700 hover:bg-orange-50 hover:text-orange-700'
                      }`}
                    >
                      <Icon size={18} className="xs:w-[22px] xs:h-[22px]" />
                      <span>{label}</span>
                    </button>
                  ))}
                </>
              )}

              {/* Language Selector */}
              <div className="border-t border-gray-100 my-2"></div>
              <div className="px-3 xs:px-4 py-2">
                <p className="text-sm text-gray-500 mb-2">{t('nav.selectLanguage')}</p>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        currentLanguage === language.code 
                          ? 'bg-orange-100 text-orange-600 font-medium' 
                          : 'bg-gray-50 text-gray-700 hover:bg-orange-50'
                      }`}
                    >
                      <span className="text-lg">{language.flag}</span>
                      <span>{language.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Authentication Buttons */}
              {!isAuthenticated ? (
                <>
                  <div className="border-t border-gray-100 my-2"></div>
                  <div className="grid grid-cols-2 gap-2 px-3 xs:px-4">
                    <button
                      onClick={() => {
                        navigate('/login');
                        setIsMenuOpen(false);
                      }}
                      className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-colors"
                    >
                      {t('nav.signIn')}
                    </button>
                    <button
                      onClick={() => {
                        navigate('/register');
                        setIsMenuOpen(false);
                      }}
                      className="w-full py-2 px-4 rounded-lg bg-orange-600 text-white font-medium text-sm hover:bg-orange-700 transition-colors"
                    >
                      {t('nav.joinFamily')}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-100 my-2"></div>
                  <div className="px-3 xs:px-4 py-2">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setIsMenuOpen(false);
                        }}
                        className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-colors"
                      >
                        {t('nav.profile')}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full py-2 px-4 rounded-lg bg-red-50 text-red-600 font-medium text-sm hover:bg-red-100 transition-colors"
                      >
                        {t('nav.signOut')}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarWithDropdown;