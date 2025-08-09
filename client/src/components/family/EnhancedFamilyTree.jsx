import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Users, 
  User, 
  Heart, 
  ArrowDown, 
  ArrowRight, 
  Eye, 
  Info,
  Calendar,
  MapPin,
  GitBranch,
  Home
} from 'lucide-react';
import api from '../../utils/api';

const EnhancedFamilyTree = () => {
  const [treeData, setTreeData] = useState(null);
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const { serNo } = useParams();

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        setLoading(true);
        
        // Fetch the family tree
        const treeRes = await api.get(`/api/family/tree-new/${serNo || 1}`);
        setTreeData(treeRes.data);
        
        // Fetch all relationships for context
        const relationshipsRes = await api.get('/api/family/all-relationships');
        setRelationships(relationshipsRes.data);
        
        // Auto-expand the root node
        setExpandedNodes(new Set([parseInt(serNo || 1)]));
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tree data:', err);
        setError('Failed to load family tree data');
        setLoading(false);
      }
    };

    fetchTreeData();
  }, [serNo]);

  const toggleNode = (nodeSerNo) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeSerNo)) {
      newExpanded.delete(nodeSerNo);
    } else {
      newExpanded.add(nodeSerNo);
    }
    setExpandedNodes(newExpanded);
  };

  const getRelationshipInfo = (fromSerNo, toSerNo) => {
    const relationship = relationships.find(
      rel => rel.fromSerNo === fromSerNo && rel.toSerNo === toSerNo
    );
    return relationship ? {
      relation: relationship.relation,
      relationMarathi: relationship.relationMarathi
    } : null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const MemberNode = ({ member, level = 0, parentSerNo = null }) => {
    const isExpanded = expandedNodes.has(member.serNo);
    const hasChildren = member.children && member.children.length > 0;
    const memberName = member.fullName || `${member.firstName || ''} ${member.middleName || ''} ${member.lastName || ''}`.trim();
    
    // Get relationship info if this member has a parent
    const relationshipInfo = parentSerNo ? getRelationshipInfo(parentSerNo, member.serNo) : null;

    return (
      <div className="relative">
        {/* Connection Line */}
        {level > 0 && (
          <div className="absolute -left-6 top-6 w-6 h-px bg-gray-300"></div>
        )}
        
        {/* Member Card */}
        <div className={`bg-white rounded-lg shadow-md border-2 mb-4 transition-all duration-200 ${
          member.serNo === parseInt(serNo) 
            ? 'border-blue-500 shadow-lg' 
            : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
        }`}>
          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
                  member.gender === 'Male' ? 'bg-blue-100' : 'bg-pink-100'
                }`}>
                  <User className={`h-6 w-6 ${member.gender === 'Male' ? 'text-blue-500' : 'text-pink-500'}`} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{memberName}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">
                      #{member.serNo}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Level {member.level}
                    </span>
                    {relationshipInfo && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {relationshipInfo.relation}
                        {relationshipInfo.relationMarathi && ` (${relationshipInfo.relationMarathi})`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Link 
                  to={`/family/member/${member.serNo}`}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye size={16} />
                </Link>
                <Link 
                  to={`/family/tree/${member.serNo}`}
                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                  title="Center Tree Here"
                >
                  <GitBranch size={16} />
                </Link>
              </div>
            </div>

            {/* Member Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div className="text-sm">
                <p className="text-gray-500">Gender</p>
                <p className="font-medium">{member.gender}</p>
              </div>
              
              {member.vansh && (
                <div className="text-sm">
                  <p className="text-gray-500 flex items-center">
                    <MapPin size={12} className="mr-1" />
                    Vansh
                  </p>
                  <p className="font-medium">{member.vansh}</p>
                </div>
              )}
              
              <div className="text-sm">
                <p className="text-gray-500">Children</p>
                <p className="font-medium">{member.sonDaughterCount || 0}</p>
              </div>

              {member.dob && (
                <div className="text-sm">
                  <p className="text-gray-500 flex items-center">
                    <Calendar size={12} className="mr-1" />
                    Birth
                  </p>
                  <p className="font-medium">{formatDate(member.dob)}</p>
                </div>
              )}
            </div>

            {/* Family Relationships */}
            <div className="space-y-2">
              {/* Spouse */}
              {member.spouseSerNo && (
                <div className="bg-pink-50 p-2 rounded-lg border border-pink-200">
                  <p className="text-sm text-pink-700 flex items-center font-medium">
                    <Heart size={14} className="mr-2" />
                    Spouse: 
                    <Link 
                      to={`/family/member/${member.spouseSerNo}`}
                      className="ml-1 text-pink-600 hover:text-pink-800 hover:underline"
                    >
                      #{member.spouseSerNo}
                    </Link>
                  </p>
                </div>
              )}

              {/* Parents */}
              {(member.fatherSerNo || member.motherSerNo) && (
                <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 flex items-center font-medium mb-1">
                    <Users size={14} className="mr-2" />
                    Parents:
                  </p>
                  <div className="flex space-x-3 text-sm">
                    {member.fatherSerNo && (
                      <Link 
                        to={`/family/member/${member.fatherSerNo}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Father #{member.fatherSerNo}
                      </Link>
                    )}
                    {member.motherSerNo && (
                      <Link 
                        to={`/family/member/${member.motherSerNo}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Mother #{member.motherSerNo}
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Expand/Collapse Button */}
            {hasChildren && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <button
                  onClick={() => toggleNode(member.serNo)}
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <ArrowDown size={16} className="mr-1" />
                      Hide {member.children.length} children
                    </>
                  ) : (
                    <>
                      <ArrowRight size={16} className="mr-1" />
                      Show {member.children.length} children
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="ml-8 border-l-2 border-gray-200 pl-6">
            {member.children.map((child, index) => (
              <div key={child.serNo} className="relative">
                {/* Vertical connector */}
                {index < member.children.length - 1 && (
                  <div className="absolute -left-6 top-0 bottom-0 w-px bg-gray-300"></div>
                )}
                <MemberNode 
                  member={child} 
                  level={level + 1} 
                  parentSerNo={member.serNo}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading enhanced family tree...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <div className="text-red-400 mb-4">
            <Users size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Tree</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Link 
            to="/family"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Family List
          </Link>
        </div>
      </div>
    );
  }

  if (!treeData) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <div className="text-gray-400 mb-4">
            <Users size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Tree Data</h3>
          <p className="text-gray-500 mb-4">No family tree data found for this member.</p>
          <Link 
            to="/family"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Family List
          </Link>
        </div>
      </div>
    );
  }

  const rootName = treeData.fullName || `${treeData.firstName || ''} ${treeData.lastName || ''}`.trim();

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Enhanced Family Tree</h1>
            <p className="text-gray-600 mt-1">
              Family tree starting from <span className="font-semibold">{rootName}</span> (#{treeData.serNo})
            </p>
          </div>
          <div className="flex space-x-3">
            <Link 
              to="/family"
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg flex items-center transition-colors"
            >
              <Home className="mr-2" size={16} />
              Family List
            </Link>
            <Link 
              to={`/family/member/${treeData.serNo}`}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center transition-colors"
            >
              <Info className="mr-2" size={16} />
              Root Details
            </Link>
          </div>
        </div>
      </div>

      {/* Tree Statistics */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{relationships.length}</p>
            <p className="text-sm text-gray-600">Total Relationships</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{expandedNodes.size}</p>
            <p className="text-sm text-gray-600">Expanded Nodes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{treeData.level}</p>
            <p className="text-sm text-gray-600">Root Level</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{treeData.sonDaughterCount || 0}</p>
            <p className="text-sm text-gray-600">Root Children</p>
          </div>
        </div>
      </div>

      {/* Tree Visualization */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <MemberNode member={treeData} />
      </div>

      {/* Legend */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 rounded mr-2"></div>
            <span>Male members</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-pink-100 rounded mr-2"></div>
            <span>Female members</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-blue-500 rounded mr-2"></div>
            <span>Current root</span>
          </div>
          <div className="flex items-center">
            <Heart size={16} className="text-pink-600 mr-2" />
            <span>Spouse relationship</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedFamilyTree;