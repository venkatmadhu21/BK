import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ApiTestPage = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const testEndpoints = [
    // Old endpoints
    { name: 'Get All Family Members (Old)', endpoint: '/api/family' },
    { name: 'Get Member by SerNo (Old)', endpoint: '/api/family/member/1' },
    { name: 'Get Member Children (Old)', endpoint: '/api/family/member/1/children' },
    { name: 'Get Member Parents (Old)', endpoint: '/api/family/member/3/parents' },
    { name: 'Get Family Tree (Old)', endpoint: '/api/family/tree/1' },
    
    // New endpoints using members and relationships collections
    { name: 'Get All Members (New)', endpoint: '/api/family/members-new' },
    { name: 'Get Member by SerNo (New)', endpoint: '/api/family/member-new/1' },
    { name: 'Get Member Children (New)', endpoint: '/api/family/member-new/1/children' },
    { name: 'Get Member Parents (New)', endpoint: '/api/family/member-new/3/parents' },
    { name: 'Get Family Tree (New)', endpoint: '/api/family/tree-new/1' },
    { name: 'Get All Relationships', endpoint: '/api/family/all-relationships' },
    { name: 'Get Relationships for Member', endpoint: '/api/family/relationships/1' },
    { name: 'Get Relationship Types', endpoint: '/api/family/relationship-types' },
    { name: 'Get Raw Data (New)', endpoint: '/api/family/raw-data-new' }
  ];
  
  const seedDatabase = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await api.get('/api/seed');
      console.log('Seed response:', res.data);
      setResponse({
        endpoint: '/api/seed',
        data: res.data,
        status: res.status
      });
      
      setTimeout(() => {
        setLoading(false);
        // Navigate to the family tree view after successful seeding
        navigate('/family/tree/1');
      }, 1500);
    } catch (err) {
      console.error('API Error:', err);
      setError({
        endpoint: '/api/seed',
        message: err.message,
        status: err.response?.status
      });
      setLoading(false);
    }
  };

  const testApi = async (endpoint) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await api.get(endpoint);
      console.log('API Response:', res.data);
      setResponse({
        endpoint,
        data: res.data,
        status: res.status
      });
      
      setLoading(false);
    } catch (err) {
      console.error('API Error:', err);
      setError({
        endpoint,
        message: err.message,
        status: err.response?.status
      });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="mb-4">
          This page allows you to test the API endpoints for the family tree functionality.
          Click on any endpoint to test it.
        </p>
        
        {/* Seed Database Button */}
        <div className="mb-6">
          <button
            onClick={seedDatabase}
            disabled={loading}
            className="w-full p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
          >
            {loading ? 'Seeding Database...' : 'Seed Database with Comprehensive Family Data'}
          </button>
          <p className="text-sm text-gray-500 mt-2 text-center">
            This will clear existing data and populate the database with a complete family tree
          </p>
        </div>
        
        {/* View Raw Data Button */}
        <div className="mb-6">
          <Link 
            to="/raw-data"
            className="block w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-center"
          >
            View Raw Database Data
          </Link>
          <p className="text-sm text-gray-500 mt-2 text-center">
            View the exact data structure in the MongoDB database
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {testEndpoints.map((endpoint) => (
            <button
              key={endpoint.endpoint}
              onClick={() => testApi(endpoint.endpoint)}
              disabled={loading}
              className="p-3 border rounded-lg hover:bg-blue-50 text-left"
            >
              <p className="font-medium">{endpoint.name}</p>
              <p className="text-sm text-gray-500">{endpoint.endpoint}</p>
            </button>
          ))}
        </div>
        
        {loading && (
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-center">Loading...</p>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-100 rounded-lg">
            <h3 className="font-bold text-red-700">Error: {error.status}</h3>
            <p className="text-red-700">{error.message}</p>
            <p className="text-sm text-red-600 mt-2">Endpoint: {error.endpoint}</p>
          </div>
        )}
        
        {response && (
          <div className="p-4 bg-green-100 rounded-lg">
            <h3 className="font-bold text-green-700">Success: {response.status}</h3>
            <p className="text-sm text-green-600 mb-2">Endpoint: {response.endpoint}</p>
            <pre className="bg-white p-3 rounded-lg overflow-auto max-h-60 text-xs">
              {JSON.stringify(response.data, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      <div className="flex justify-center space-x-4">
        <Link 
          to="/family" 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Family List
        </Link>
        <Link 
          to="/seed" 
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Go to Seed Page
        </Link>
      </div>
    </div>
  );
};

export default ApiTestPage;