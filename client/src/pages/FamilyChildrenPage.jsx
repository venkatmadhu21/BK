import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import FamilyMemberCard from '../components/family/FamilyMemberCard';
import { ArrowLeft, Users, UserCircle, Download } from 'lucide-react';
import { exportToPDF } from '../utils/pdfExport';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

const FamilyChildrenPage = () => {
  const [parentMember, setParentMember] = useState(null);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const { serNo } = useParams();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchChildrenData = async () => {
      try {
        setLoading(true);
        
        // Fetch parent member details from Members collection
        const memberRes = await api.get(`/api/family/member-new/${serNo}`);
        setParentMember(memberRes.data);
        
        // Fetch children from Members collection
        const childrenRes = await api.get(`/api/family/member-new/${serNo}/children`);
        setChildren(childrenRes.data);
        
        // Set a minimum loading time for better UX
        setTimeout(() => {
          setLoading(false);
        }, 300);
      } catch (err) {
        console.error('Error fetching children data:', err);
        setTimeout(() => {
          setError('Failed to load children data. Please try again later.');
          setLoading(false);
        }, 300);
      }
    };

    fetchChildrenData();
  }, [serNo]);

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const timestamp = new Date().toISOString().slice(0, 10);
      const parentName = parentMember.fullName || `${parentMember.firstName || ''} ${parentMember.lastName || ''}`.trim() || 'Member';
      const filename = `children-of-${parentName.replace(/\s+/g, '-')}-${timestamp}.pdf`;
      await exportToPDF('children-container', filename, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      addToast('PDF exported successfully!', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      addToast('Failed to export PDF. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading children...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!parentMember) return <div className="text-center py-10">Parent member not found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-4">
        <Link to={`/family/member/${serNo}`} className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to {parentMember.name}
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold flex items-center">
            <Users className="h-6 w-6 mr-2 text-blue-500" />
            Children of {parentMember.name}
          </h1>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
        <p className="text-gray-600">
          Showing {children.length} {children.length === 1 ? 'child' : 'children'}
        </p>
      </div>

      {/* Parent Info Card */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <UserCircle className="h-5 w-5 mr-2 text-blue-500" />
          Parent Information
        </h3>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <p className="font-medium">{parentMember.name}</p>
            <p className="text-sm text-gray-500">
              {parentMember.gender} • Serial No: #{parentMember.serNo}
            </p>
            {parentMember.dateOfBirth && (
              <p className="text-sm text-gray-500">
                Born: {new Date(parentMember.dateOfBirth).toLocaleDateString()}
              </p>
            )}
          </div>
          <Link 
            to={`/family/member/${parentMember.serNo}`}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
          >
            View Full Profile
          </Link>
        </div>
      </div>

      {/* Children Grid */}
      <div id="children-container">
        {children.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map(child => (
              <FamilyMemberCard key={child.serNo} member={child} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Children</h3>
            <p className="text-gray-500">
              {parentMember.name} doesn't have any children recorded in the family tree.
            </p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Link 
          to="/family"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          View All Family Members
        </Link>
        <Link 
          to={`/family/tree/${parentMember.serNo}`}
          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
        >
          View Family Tree
        </Link>
      </div>
    </div>
  );
};

export default FamilyChildrenPage;