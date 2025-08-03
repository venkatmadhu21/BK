import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import FamilyMemberCard from '../components/family/FamilyMemberCard';
import { ArrowLeft, Users, UserCircle, GitBranch, Download } from 'lucide-react';
import { exportMemberDetailsToPDF } from '../utils/pdfExport';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

const FamilyMemberPage = () => {
  const [member, setMember] = useState(null);
  const [parents, setParents] = useState({ father: null, mother: null });
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const { serNo } = useParams();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        setLoading(true);
        
        // Fetch member details
        const memberRes = await api.get(`/api/family/member/${serNo}`);
        setMember(memberRes.data);
        
        // Fetch parents
        const parentsRes = await api.get(`/api/family/member/${serNo}/parents`);
        setParents(parentsRes.data);
        
        // Fetch children
        const childrenRes = await api.get(`/api/family/member/${serNo}/children`);
        setChildren(childrenRes.data);
        
        // Set a minimum loading time for better UX
        setTimeout(() => {
          setLoading(false);
        }, 300);
      } catch (err) {
        console.error('Error fetching family member data:', err);
        setTimeout(() => {
          setError('Failed to load family member data. Please try again later.');
          setLoading(false);
        }, 300);
      }
    };

    fetchMemberData();
  }, [serNo]);

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `family-member-${member.name.replace(/\s+/g, '-')}-${timestamp}.pdf`;
      await exportMemberDetailsToPDF(member, filename);
      addToast('PDF exported successfully!', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      addToast('Failed to export PDF. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading member details...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!member) return <div className="text-center py-10">Member not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <Link to="/family" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Family List
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Family Member Details</h1>
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export PDF'}
        </button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <FamilyMemberCard member={member} />
          
          {/* Additional member details if available */}
          {(member.biography || member.occupation || member.dateOfBirth) && (
            <div className="bg-white rounded-lg shadow-md p-4 mt-4">
              <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
              
              {member.dateOfBirth && (
                <div className="mb-2">
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p>{new Date(member.dateOfBirth).toLocaleDateString()}</p>
                </div>
              )}
              
              {member.occupation && (
                <div className="mb-2">
                  <p className="text-sm text-gray-500">Occupation</p>
                  <p>{member.occupation}</p>
                </div>
              )}
              
              {member.biography && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500 mb-1">Biography</p>
                  <p className="text-sm">{member.biography}</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div>
          {/* Parents section */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <UserCircle className="h-5 w-5 mr-2 text-blue-500" />
              Parents
            </h3>
            
            {parents.father || parents.mother ? (
              <div>
                {parents.father && (
                  <Link to={`/family/member/${parents.father.serNo}`} className="block p-2 hover:bg-gray-50 rounded mb-2">
                    <p className="font-medium">{parents.father.name}</p>
                    <p className="text-xs text-gray-500">Father • #{parents.father.serNo}</p>
                  </Link>
                )}
                
                {parents.mother && (
                  <Link to={`/family/member/${parents.mother.serNo}`} className="block p-2 hover:bg-gray-50 rounded">
                    <p className="font-medium">{parents.mother.name}</p>
                    <p className="text-xs text-gray-500">Mother • #{parents.mother.serNo}</p>
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No parent information available</p>
            )}
          </div>
          
          {/* Children section */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              Children ({children.length})
            </h3>
            
            {children.length > 0 ? (
              <div className="max-h-60 overflow-y-auto">
                {children.map(child => (
                  <Link 
                    key={child.serNo} 
                    to={`/family/member/${child.serNo}`} 
                    className="block p-2 hover:bg-gray-50 rounded mb-1"
                  >
                    <p className="font-medium">{child.name}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{child.gender}</span>
                      <span>#{child.serNo}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No children</p>
            )}
          </div>
          
          {/* View tree button */}
          <div className="mt-4">
            <Link 
              to={`/family/tree/${member.serNo}`}
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-center flex items-center justify-center"
            >
              <GitBranch className="mr-2" size={16} />
              View Family Tree
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyMemberPage;