import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';
import { useAsyncLoader } from '../hooks/usePageLoader';
import LoadingLink from '../components/common/LoadingLink';
import LoadingTest from '../components/common/LoadingTest';
import ManualLoaderDemo from '../components/common/ManualLoaderDemo';
import { ButtonLoader } from '../components/common/Loader';
import { 
  RefreshCw, 
  Navigation, 
  Eye, 
  Globe, 
  Wifi, 
  WifiOff,
  ArrowRight,
  Loader as LoaderIcon,
  Home
} from 'lucide-react';

const LoadingEffectsDemo = () => {
  const navigate = useNavigate();
  const { showLoader, hideLoader, showPageLoader, hidePageLoader } = useLoading();
  const { executeWithLoader } = useAsyncLoader();
  const [buttonLoading, setButtonLoading] = useState(false);

  // Simulate async operation
  const simulateAsyncOperation = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Operation completed successfully!');
      }, 3000);
    });
  };

  // Test different loading scenarios
  const testScenarios = [
    {
      title: 'Page Navigation Loading',
      description: 'Shows loader when navigating between pages',
      icon: <Navigation className="w-5 h-5" />,
      action: () => {
        showPageLoader('Navigating to About page...');
        setTimeout(() => navigate('/about'), 500);
      }
    },
    {
      title: 'Manual Loader Control',
      description: 'Manually show/hide the global loader',
      icon: <LoaderIcon className="w-5 h-5" />,
      action: () => {
        showLoader('Manual loading test...');
        setTimeout(() => hideLoader(), 1500);
      }
    },
    {
      title: 'Async Operation with Loader',
      description: 'Execute async operation with automatic loader',
      icon: <RefreshCw className="w-5 h-5" />,
      action: async () => {
        try {
          const result = await executeWithLoader(
            simulateAsyncOperation,
            'Processing async operation...'
          );
          alert(result);
        } catch (error) {
          alert('Operation failed!');
        }
      }
    },
    {
      title: 'Button Loading State',
      description: 'Show loading state in button',
      icon: <Eye className="w-5 h-5" />,
      action: () => {
        setButtonLoading(true);
        setTimeout(() => setButtonLoading(false), 1000);
      }
    },
    {
      title: 'Simulate Page Refresh',
      description: 'Refresh the current page',
      icon: <RefreshCw className="w-5 h-5" />,
      action: () => {
        window.location.reload();
      }
    },
    {
      title: 'Simulate Connection Loss',
      description: 'Test offline/online detection',
      icon: <WifiOff className="w-5 h-5" />,
      action: () => {
        // Simulate going offline
        window.dispatchEvent(new Event('offline'));
        setTimeout(() => {
          window.dispatchEvent(new Event('online'));
        }, 3000);
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent mb-4">
            Loading Effects Demo
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Test all the different loading effects: page navigation, tab switching, 
            page refresh, async operations, and more.
          </p>
        </div>

        {/* Test Scenarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testScenarios.map((scenario, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                  {scenario.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800">{scenario.title}</h3>
              </div>
              
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                {scenario.description}
              </p>
              
              <button
                onClick={scenario.action}
                disabled={buttonLoading && index === 3}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-70"
              >
                {buttonLoading && index === 3 ? (
                  <>
                    <ButtonLoader size="small" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>Test Effect</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Manual Loader Demo */}
        <ManualLoaderDemo />

        {/* Quick Test Component */}
        <LoadingTest />

        {/* Navigation Links with Loading */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Navigation with Loading Effects</h2>
          <p className="text-slate-600 mb-8">
            Click these links to see loading effects during navigation:
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <LoadingLink 
              to="/" 
              loadingMessage="Loading Home page..."
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </LoadingLink>

            <LoadingLink 
              to="/about" 
              loadingMessage="Loading About page..."
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium transition-all duration-300"
            >
              <Globe className="w-4 h-4" />
              <span>About</span>
            </LoadingLink>

            <LoadingLink 
              to="/media" 
              loadingMessage="Loading Media page..."
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Media</span>
            </LoadingLink>

            <LoadingLink 
              to="/yogeshwari-devi" 
              loadingMessage="Loading Yogeshwari Devi page..."
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-medium transition-all duration-300"
            >
              <Eye className="w-4 h-4" />
              <span>Devi</span>
            </LoadingLink>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-gradient-to-r from-orange-100 to-orange-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-orange-800 mb-4">How to Test Loading Effects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-orange-700 mb-3">Automatic Effects:</h3>
              <ul className="space-y-2 text-orange-600">
                <li>• Navigate between pages using navbar or links</li>
                <li>• Refresh the page (Ctrl+R or F5)</li>
                <li>• Switch to another tab and come back</li>
                <li>• Minimize/restore the browser window</li>
                <li>• Go offline/online (disconnect internet)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-orange-700 mb-3">Manual Tests:</h3>
              <ul className="space-y-2 text-orange-600">
                <li>• Click the test buttons above</li>
                <li>• Use the navigation links with loading</li>
                <li>• Try async operations</li>
                <li>• Test button loading states</li>
                <li>• Simulate page refresh</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoadingEffectsDemo;