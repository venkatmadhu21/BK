import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Loader from './Loader';

const QuickLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const location = useLocation();

  // Route-specific loading messages
  const getLoadingMessage = (pathname) => {
    const messages = {
      '/': 'Loading Home...',
      '/about': 'Loading About...',
      '/media': 'Loading Media...',
      '/news': 'Loading News...',
      '/events': 'Loading Events...',
      '/login': 'Loading Login...',
      '/register': 'Loading Registration...',
      '/dashboard': 'Loading Dashboard...',
      '/family-tree': 'Loading Family Tree...',
      '/family': 'Loading Family List...',
      '/profile': 'Loading Profile...',
      '/yogeshwari-devi': 'Loading Yogeshwari Devi...',
      '/loader-demo': 'Loading Loader Demo...',
      '/loader-examples': 'Loading Examples...',
      '/loading-effects': 'Loading Effects Demo...',
      '/pdf-export-demo': 'Loading PDF Export Demo...'
    };
    
    // Handle dynamic routes
    if (pathname.startsWith('/family/member/') && pathname.endsWith('/children')) {
      return 'Loading Children...';
    }
    if (pathname.startsWith('/family/member/')) {
      return 'Loading Family Member...';
    }
    if (pathname.startsWith('/family/tree/')) {
      return 'Loading Family Tree...';
    }
    
    return messages[pathname] || 'Loading page...';
  };

  useEffect(() => {
    // Show loader on route change
    setIsLoading(true);
    setLoadingMessage(getLoadingMessage(location.pathname));
    
    // Hide after a short time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400); // 0.4 seconds for quick loading

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <Loader size="large" message={loadingMessage} />
        </div>
      )}
    </>
  );
};

export default QuickLoader;