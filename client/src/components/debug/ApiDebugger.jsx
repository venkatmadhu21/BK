import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const ApiDebugger = () => {
  const [status, setStatus] = useState('Testing...');
  const [results, setResults] = useState({});

  useEffect(() => {
    const testApis = async () => {
      const tests = [
        { name: 'Members API', url: '/api/family/members' },
        { name: 'Relations API (SerNo 3)', url: '/api/family/dynamic-relations/3' },
        { name: 'All Relationships', url: '/api/family/all-relationships' }
      ];

      const testResults = {};

      for (const test of tests) {
        try {
          console.log(`Testing ${test.name}: ${test.url}`);
          const response = await api.get(test.url);
          testResults[test.name] = {
            status: 'SUCCESS',
            data: Array.isArray(response.data) ? `Array(${response.data.length})` : typeof response.data,
            sample: Array.isArray(response.data) ? response.data[0] : response.data
          };
          console.log(`✅ ${test.name}:`, response.data);
        } catch (error) {
          testResults[test.name] = {
            status: 'ERROR',
            error: error.response?.data?.message || error.message
          };
          console.error(`❌ ${test.name}:`, error);
        }
      }

      setResults(testResults);
      setStatus('Complete');
    };

    testApis();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">API Debug Status: {status}</h2>
      
      <div className="space-y-4">
        {Object.entries(results).map(([testName, result]) => (
          <div key={testName} className={`p-4 rounded border ${
            result.status === 'SUCCESS' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <h3 className="font-semibold">{testName}</h3>
            <p className={`text-sm ${result.status === 'SUCCESS' ? 'text-green-700' : 'text-red-700'}`}>
              Status: {result.status}
            </p>
            {result.data && (
              <p className="text-sm text-gray-600">Data: {result.data}</p>
            )}
            {result.error && (
              <p className="text-sm text-red-600">Error: {result.error}</p>
            )}
            {result.sample && (
              <details className="mt-2">
                <summary className="text-sm cursor-pointer">Sample Data</summary>
                <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-auto">
                  {JSON.stringify(result.sample, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiDebugger;