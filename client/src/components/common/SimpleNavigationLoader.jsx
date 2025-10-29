import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FullScreenLoader } from './Loader';

const SimpleNavigationLoader = ({ children }) => {
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
      '/profile': 'Loading Profile...',
      '/yogeshwari-devi': 'Loading Yogeshwari Devi...',
      '/loader-demo': 'Loading Loader Demo...',
      '/loader-examples': 'Loading Examples...',
      '/loading-effects': 'Loading Effects Demo...'
    };
    
    return messages[pathname] || 'Loading page...';
  };

  useEffect(() => {
    // Show loader immediately on route change
    setIsLoading(true);
    setLoadingMessage(getLoadingMessage(location.pathname));

    // Hide loader very quickly - just a flash
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 900); // Very short flash

    return () => {
      clearTimeout(timer);
      setIsLoading(false); // Ensure cleanup
    };
  }, [location.pathname]);

  return (
    <>
      {children}
      {isLoading && (
        <FullScreenLoader message={loadingMessage} showLogo={false} />
      )}
    </>
  );
};

export default SimpleNavigationLoader;