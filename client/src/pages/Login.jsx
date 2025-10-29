import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import jointImage from '../assets/images/joint.png';
import '../styles/heritage-background.css';

const Login = () => {
  const { login, isAuthenticated, error, clearErrors, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect based on role if available
      const stored = localStorage.getItem('token') || sessionStorage.getItem('token');
      // We already have user in context; rely on that
      const role = (typeof window !== 'undefined') ? JSON.parse(JSON.stringify((() => {
        try { return JSON.parse(sessionStorage.getItem('auth_user') || localStorage.getItem('auth_user') || 'null'); } catch { return null; }
      })()))?.role : null;
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'dataentry') {
        navigate('/data-entry');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, navigate]);

  const { username, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login({ username, password }, rememberMe);
    
    if (result.success) {
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  return (
    <div className="heritage-bg min-h-screen flex items-center justify-center py-8 xs:py-12 px-3 xs:px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="heritage-gradient-overlay"></div>
      <div className="heritage-decoration"></div>
      <div className="heritage-decoration"></div>
      <div className="heritage-decoration"></div>
      <div className="heritage-decoration"></div>
      <div className="flex w-full max-w-6xl gap-16 lg:gap-24 items-center relative z-10">
        <div className="heritage-content flex-1 max-w-md space-y-6 xs:space-y-8">
        <div>
          <h2 className="mt-4 xs:mt-6 text-center text-2xl xs:text-3xl font-bold text-gray-900">
            {t('auth.welcomeBack')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('auth.signInToAccount')}
          </p>
        </div>
        
        <form className="mt-6 xs:mt-8 space-y-4 xs:space-y-6" onSubmit={onSubmit}>
          <div className="space-y-3 xs:space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 xs:h-5 xs:w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={onChange}
                  className="pl-9 xs:pl-10 block w-full px-3 py-2.5 xs:py-2 text-sm xs:text-base border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 xs:h-5 xs:w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={onChange}
                  className="pl-9 xs:pl-10 pr-9 xs:pr-10 block w-full px-3 py-2.5 xs:py-2 text-sm xs:text-base border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 xs:h-5 xs:w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 xs:h-5 xs:w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-start justify-between">
                <p className="text-sm text-red-600">{error}</p>
                <button
                  type="button"
                  onClick={clearErrors}
                  className="text-xs text-red-700 hover:text-red-800 underline ml-3"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 xs:py-3 px-4 border border-transparent text-sm xs:text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span className="text-sm xs:text-base">Signing In...</span>
                </div>
              ) : (
                <span className="text-sm xs:text-base">Sign In</span>
              )}
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/family-form" 
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Create one here
              </Link>
            </p>
          </div>
        </form>
        </div>
        <div className="hidden lg:flex flex-1 justify-end items-center">
          <img 
            src={jointImage} 
            alt="Bal Krishna Nivas" 
            className="max-w-2xl w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;