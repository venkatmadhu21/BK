import React, { useState } from 'react';
import { Users, RefreshCw, Database, CheckCircle, AlertCircle, Info } from 'lucide-react';
import api from '../utils/api';

const AdminRelationsPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const generateAllRelations = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await api.post('/api/family/generate-relations');
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateSingleRelation = async (serNo) => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await api.post(`/api/family/generate-relations?serNo=${serNo}`);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <Database className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Relationship Management</h1>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">About Relationship Generation</p>
                <p>This tool automatically computes and stores family relationships using your relationRules collection. 
                It analyzes the family tree structure and generates relationships like Father, Mother, Uncle, Aunt, Cousin, etc., 
                with both English and Marathi labels.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Generate All Relations */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Generate Relations for All Members
              </h2>
              <p className="text-gray-600 mb-4">
                This will compute and store relationships for all family members. 
                Existing relationships will be replaced with fresh calculations.
              </p>
              <button
                onClick={generateAllRelations}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Database className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Generating...' : 'Generate All Relations'}
              </button>
            </div>

            {/* Generate Single Member Relations */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Generate Relations for Single Member
              </h2>
              <p className="text-gray-600 mb-4">
                Generate relationships for a specific member by their Serial Number.
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Enter Serial Number (e.g., 3)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value) {
                      generateSingleRelation(parseInt(e.target.value));
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.target.previousElementSibling;
                    if (input.value) {
                      generateSingleRelation(parseInt(input.value));
                    }
                  }}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="border border-green-200 bg-green-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-green-900">Generation Complete</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Mode:</span> {result.mode}</p>
                  <p><span className="font-medium">Total Generated:</span> {result.totalGenerated}</p>
                  {result.details && result.details.length > 0 && (
                    <div>
                      <p className="font-medium mb-2">Per Member Details:</p>
                      <div className="max-h-40 overflow-y-auto bg-white rounded border p-2">
                        {result.details.map((detail, idx) => (
                          <div key={idx} className="flex justify-between py-1">
                            <span>SerNo {detail.serNo}:</span>
                            <span>{detail.count} relations</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="border border-red-200 bg-red-50 rounded-lg p-6">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <h3 className="text-lg font-semibold text-red-900">Error</h3>
                </div>
                <p className="text-red-800 mt-2">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRelationsPage;