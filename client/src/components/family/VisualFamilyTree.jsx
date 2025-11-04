import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Users, 
  User, 
  Heart, 
  Eye, 
  Info,
  Calendar,
  MapPin,
  GitBranch,
  Home,
  Search,
  Filter,
  BarChart3,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import api from '../../utils/api';
import { transformMembersData } from '../../utils/memberTransform';

const VisualFamilyTree = ({ onClose }) => {
  const [allMembers, setAllMembers] = useState([]);
  const [allRelationships, setAllRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllRelationships, setShowAllRelationships] = useState(true);
  const { serNo } = useParams();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        const [membersRes, relationshipsRes] = await Promise.all([
          api.get('/api/family/members'),
          api.get('/api/family/all-relationships')
        ]);
        
        // Handle both response formats: array or { success, data } object
        const rawMembersData = Array.isArray(membersRes.data) ? membersRes.data : (membersRes.data.data || []);
        
        // Transform members data from new schema to flat structure
        const transformedMembers = transformMembersData(rawMembersData);
        
        setAllMembers(transformedMembers);
        setAllRelationships(relationshipsRes.data);
        
        if (serNo) {
          const member = transformedMembers.find(m => m.serNo === parseInt(serNo));
          setSelectedMember(member);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching visual family data:', err);
        setError('Failed to load family data');
        setLoading(false);
      }
    };

    fetchAllData();
  }, [serNo]);

  // Group members by level for tree structure
  const membersByLevel = allMembers.reduce((acc, member) => {
    const level = member.level || 0;
    if (!acc[level]) acc[level] = [];
    acc[level].push(member);
    return acc;
  }, {});

  // Get relationship between two members
  const getRelationship = (fromSerNo, toSerNo) => {
    return allRelationships.find(rel => 
      (rel.fromSerNo === fromSerNo && rel.toSerNo === toSerNo) ||
      (rel.fromSerNo === toSerNo && rel.toSerNo === fromSerNo)
    );
  };

  // Get all relationships for a member
  const getMemberRelationships = (memberSerNo) => {
    return allRelationships.filter(rel => 
      rel.fromSerNo === memberSerNo || rel.toSerNo === memberSerNo
    );
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

  // Filter members based on search
  const filteredMembers = allMembers.filter(member => {
    if (!searchTerm) return true;
    const legacyName = member.name || `${member.firstName || ''} ${member.middleName || ''} ${member.lastName || ''}`.trim();
    return legacyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           member.serNo.toString().includes(searchTerm) ||
           member.vansh?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const MemberNode = ({ member, level }) => {
    const memberName = member.name || `${member.firstName || ''} ${member.middleName || ''} ${member.lastName || ''}`.trim();
    const isSelected = selectedMember?.serNo === member.serNo;
    const memberRelationships = getMemberRelationships(member.serNo);
    
    // Find connections to other levels
    const parentConnections = allRelationships.filter(rel => 
      rel.toSerNo === member.serNo && 
      allMembers.find(m => m.serNo === rel.fromSerNo && m.level < member.level)
    );
    
    const childConnections = allRelationships.filter(rel => 
      rel.fromSerNo === member.serNo && 
      allMembers.find(m => m.serNo === rel.toSerNo && m.level > member.level)
    );

    return (
      <div className="relative flex flex-col items-center">
        {/* Parent Connection Lines */}
        {parentConnections.length > 0 && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="w-px h-6 bg-gray-300"></div>
            {parentConnections.map((rel, idx) => (
              <div key={idx} className="absolute -top-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium border border-purple-200 shadow-sm">
                  {rel.relation}
                  {rel.relationMarathi && (
                    <span className="ml-1 text-purple-600">({rel.relationMarathi})</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Member Card */}
        <div 
          className={`bg-white rounded-lg shadow-md border-2 p-3 transition-all duration-200 cursor-pointer min-w-[200px] ${
            isSelected 
              ? 'border-blue-500 shadow-lg scale-105' 
              : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
          }`}
          onClick={() => setSelectedMember(member)}
        >
          {/* Member Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                member.gender?.toLowerCase() === 'male' ? 'bg-blue-100' : 'bg-pink-100'
              }`}>
                <User className={`h-4 w-4 ${member.gender?.toLowerCase() === 'male' ? 'text-blue-500' : 'text-pink-500'}`} />
              </div>
              <div>
                <h4 className="font-bold text-sm">{memberName}</h4>
                <div className="flex items-center space-x-1 text-xs text-gray-600">
                  <span className="bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-full">
                    #{member.serNo}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                    L{member.level}
                  </span>
                </div>
              </div>
            </div>
            
            <Link 
              to={`/family/member/${member.serNo}`}
              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
              title="View Details"
            >
              <Eye size={12} />
            </Link>
          </div>

          {/* Member Details */}
          <div className="space-y-1 text-xs">
            {member.vansh && (
              <div className="flex items-center text-gray-600">
                <MapPin size={10} className="mr-1" />
                <span>{member.vansh}</span>
              </div>
            )}
            
            {member.dob && (
              <div className="flex items-center text-gray-600">
                <Calendar size={10} className="mr-1" />
                <span>Born: {formatDate(member.dob)}</span>
              </div>
            )}
            
            {member.sonDaughterCount > 0 && (
              <div className="flex items-center text-gray-600">
                <Users size={10} className="mr-1" />
                <span>Children: {member.sonDaughterCount}</span>
              </div>
            )}
          </div>

          {/* Relationship Count */}
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              {memberRelationships.length} relationships
            </div>
          </div>
        </div>

        {/* Child Connection Lines */}
        {childConnections.length > 0 && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="w-px h-6 bg-gray-300"></div>
            {childConnections.slice(0, 3).map((rel, idx) => (
              <div key={idx} className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium border border-green-200 shadow-sm">
                  {rel.relation}
                  {rel.relationMarathi && (
                    <span className="ml-1 text-green-600">({rel.relationMarathi})</span>
                  )}
                </div>
              </div>
            ))}
            {childConnections.length > 3 && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  +{childConnections.length - 3} more
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading visual family tree...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <div className="text-red-400 mb-4">
            <Users size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Visual Tree</h3>
          <p className="text-gray-500 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  const levels = Object.keys(membersByLevel).sort((a, b) => parseInt(a) - parseInt(b));
  const filteredLevels = levels.filter(level => 
    membersByLevel[level].some(member => filteredMembers.includes(member))
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Visual Family Tree</h1>
            <p className="text-gray-600 mt-1">
              Family tree with relationship connections - {allMembers.length} members, {allRelationships.length} relationships
            </p>
          </div>
          <div className="flex space-x-3 mt-4 lg:mt-0 relative z-50">
            <Link 
              to="/relationships"
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center transition-colors"
            >
              <Heart className="mr-2" size={16} />
              All Relationships
            </Link>
            <Link 
              to="/family"
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg flex items-center transition-colors"
            >
              <Home className="mr-2" size={16} />
              Family List
            </Link>
            {onClose && (
              <button
                onClick={onClose}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center transition-colors"
                title="Close this view"
              >
                <X className="mr-2" size={16} />
                Close
              </button>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search family members..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Show Relationships Toggle */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showAllRelationships}
                  onChange={(e) => setShowAllRelationships(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Show Relationship Labels</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Family Tree */}
      <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
        <div className="min-w-max">
          {filteredLevels.map((level, levelIndex) => {
            const levelMembers = membersByLevel[level].filter(member => 
              filteredMembers.includes(member)
            );

            return (
              <div key={level} className="mb-16 relative">
                {/* Level Header */}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-gray-800 bg-gray-100 inline-block px-4 py-2 rounded-full">
                    Generation {level} ({levelMembers.length} members)
                  </h3>
                </div>

                {/* Level Members */}
                <div className="flex flex-wrap justify-center gap-8">
                  {levelMembers.map(member => (
                    <MemberNode 
                      key={member.serNo} 
                      member={member} 
                      level={parseInt(level)}
                    />
                  ))}
                </div>

                {/* Connection Line to Next Level */}
                {levelIndex < filteredLevels.length - 1 && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-px h-8 bg-gray-300"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  {selectedMember.fullName} - All Relationships
                </h3>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {/* Member relationships */}
              <div className="space-y-3">
                {getMemberRelationships(selectedMember.serNo).map((rel, idx) => {
                  const otherMember = allMembers.find(m => 
                    m.serNo === (rel.fromSerNo === selectedMember.serNo ? rel.toSerNo : rel.fromSerNo)
                  );
                  const isFromSelected = rel.fromSerNo === selectedMember.serNo;
                  
                  return (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-600">
                          {isFromSelected ? 'Is' : 'Has'} 
                        </div>
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                          {rel.relation}
                        </span>
                        {rel.relationMarathi && (
                          <span className="text-sm text-gray-600">({rel.relationMarathi})</span>
                        )}
                        <div className="text-sm text-gray-600">
                          {isFromSelected ? 'of' : 'a'}
                        </div>
                      </div>
                      {otherMember && (
                        <Link 
                          to={`/family/member/${otherMember.serNo}`}
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                        >
                          <span>#{otherMember.serNo} {otherMember.fullName}</span>
                          <Eye size={16} className="ml-2" />
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-100 border border-purple-200 rounded mr-2"></div>
            <span>Parent relationships</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded mr-2"></div>
            <span>Child relationships</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 rounded mr-2"></div>
            <span>Male members</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-pink-100 rounded mr-2"></div>
            <span>Female members</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualFamilyTree;