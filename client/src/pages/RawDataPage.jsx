import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const RawDataPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRawData = async () => {
      try {
        setLoading(true);
        // Use the new API endpoint that uses members collection
        const res = await api.get('/api/family/raw-data-new');
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching raw data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchRawData();
  }, []);

  if (loading) return <div className="text-center py-10">Loading data...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Raw Database Data</h1>
      
      <div className="mb-4">
        <Link to="/api-test" className="text-blue-600 hover:text-blue-800">
          ← Back to API Test
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="mb-4">
          This page shows the raw data from the MongoDB database (bal-krishna-nivas, collection: members).
        </p>
        
        <div className="mb-4">
          <p className="font-medium">Total Records: {data.length}</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SerNo
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vansh
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spouse
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Children
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parents
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((member) => (
                <tr key={member.serNo} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b border-gray-200">
                    <Link 
                      to={`/family/member/${member.serNo}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {member.serNo}
                    </Link>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {member.fullName || `${member.firstName || ''} ${member.middleName || ''} ${member.lastName || ''}`.trim()}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">{member.gender}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{member.vansh || '-'}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{member.level}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {member.spouseSerNo ? (
                      <Link 
                        to={`/family/member/${member.spouseSerNo}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Spouse (#{member.spouseSerNo})
                      </Link>
                    ) : '-'}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {member.childrenSerNos?.length > 0 ? (
                      <span>{member.childrenSerNos.join(', ')}</span>
                    ) : '-'}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {member.fatherSerNo || member.motherSerNo ? (
                      <span>
                        {member.fatherSerNo ? `Father: ${member.fatherSerNo}` : ''}
                        {member.fatherSerNo && member.motherSerNo ? ', ' : ''}
                        {member.motherSerNo ? `Mother: ${member.motherSerNo}` : ''}
                      </span>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Raw JSON Data</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-xs">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default RawDataPage;