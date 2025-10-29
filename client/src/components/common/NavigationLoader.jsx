import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLoading } from '../../context/LoadingContext';

const NavigationLoader = ({ children }) => {
  const location = useLocation();
  const { showPageLoader, hidePageLoader } = useLoading();

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
      '/loader-examples': 'Loading Examples...'
    };
    
    return messages[pathname] || 'Loading page...';
  };

  useEffect(() => {
    // Show loader on route change
    const message = getLoadingMessage(location.pathname);
    showPageLoader(message);

    // Hide loader after a shorter delay
    const timer = setTimeout(() => {
      hidePageLoader();
    }, 300); // Reduced from 800ms to 300ms

    return () => clearTimeout(timer);
  }, [location.pathname, showPageLoader, hidePageLoader]);

  return children;
};

// Hook to programmatically show navigation loader
export const useNavigationLoader = () => {
  const navigate = useNavigate();

  const navigateWithLoader = (path, message) => {
    // You can add custom logic here if needed
    navigate(path);
  };

  return { navigateWithLoader };
};

export default NavigationLoader;