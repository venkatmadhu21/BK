import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginConfirmed = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user somehow lands here without auth, send to login
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md border border-gray-200 p-6 sm:p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-600" size={48} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Login Confirmed</h1>
        <p className="text-gray-600 mb-6">
          {user?.firstName ? `Welcome, ${user.firstName}!` : 'You have successfully logged in.'}
        </p>
        <div className="grid grid-cols-1 gap-3">
          <Link to="/dashboard" className="w-full inline-flex justify-center items-center py-2.5 px-4 rounded-md text-white bg-primary-600 hover:bg-primary-700">
            Go to Dashboard
          </Link>
          <Link to="/family-tree" className="w-full inline-flex justify-center items-center py-2.5 px-4 rounded-md text-primary-700 border border-primary-200 hover:bg-primary-50">
            Explore Family Tree
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginConfirmed;