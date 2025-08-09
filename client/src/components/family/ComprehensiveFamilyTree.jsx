import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Modal from '../common/Modal';
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
  Home,
  Search,
  Filter,
  BarChart3,
  Network,
  Maximize2,
  Minimize2
} from 'lucide-react';
import api from '../../utils/api';

const ComprehensiveFamilyTree = () => {
  const [allMembers, setAllMembers] = useState([]);
  const [allRelationships, setAllRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('tree'); // 'tree', 'network', 'list'
  const [selectedMember, setSelectedMember] = useState(null);
  const [expandedLevels, setExpandedLevels] = useState(new Set([1, 2]));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRelationType, setSelectedRelationType] = useState('');
  const [showRelationships, setShowRelationships] = useState(true);
  const { serNo } = useParams();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch all members and relationships
        const [membersRes, relationshipsRes] = await Promise.all([
          api.get('/api/family/members-new'),
          api.get('/api/family/all-relationships')
        ]);
        
        setAllMembers(membersRes.data);
        setAllRelationships(relationshipsRes.data);
        
        // Set selected member if serNo provided
        if (serNo) {
          const member = membersRes.data.find(m => m.serNo === parseInt(serNo));
          setSelectedMember(member);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching comprehensive family data:', err);
        setError('Failed to load family data');
        setLoading(false);
      }
    };

    fetchAllData();
  }, [serNo]);

  // Group members by level
  const membersByLevel = allMembers.reduce((acc, member) => {
    const level = member.level || 0;
    if (!acc[level]) acc[level] = [];
    acc[level].push(member);
    return acc;
  }, {});

  // Get relationships for a specific member
  const getMemberRelationships = (memberSerNo) => {
    return allRelationships.filter(rel => 
      rel.fromSerNo === memberSerNo || rel.toSerNo === memberSerNo
    );
  };

  // Get relationship types
  const relationshipTypes = [...new Set(allRelationships.map(r => r.relation))].sort();

  // Filter members based on search and filters
  const filteredMembers = allMembers.filter(member => {
    const matchesSearch = !searchTerm || 
      member.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.serNo.toString().includes(searchTerm) ||
      member.vansh?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Filter relationships based on selected type
  const filteredRelationships = selectedRelationType 
    ? allRelationships.filter(rel => rel.relation === selectedRelationType)
    : allRelationships;

  const toggleLevel = (level) => {
    const newExpanded = new Set(expandedLevels);
    if (newExpanded.has(level)) {
      newExpanded.delete(level);
    } else {
      newExpanded.add(level);
    }
    setExpandedLevels(newExpanded);
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

  const MemberCard = ({ member, showRelationships: showRels = false, parentMember = null }) => {
    const memberName = member.fullName || `${member.firstName || ''} ${member.middleName || ''} ${member.lastName || ''}`.trim();
    const memberRelationships = showRels ? getMemberRelationships(member.serNo) : [];
    const isSelected = selectedMember?.serNo === member.serNo;
    
    // Get relationship to parent if parent is provided
    const relationshipToParent = parentMember ? 
      allRelationships.find(rel => 
        (rel.fromSerNo === parentMember.serNo && rel.toSerNo === member.serNo) ||
        (rel.fromSerNo === member.serNo && rel.toSerNo === parentMember.serNo)
      ) : null;

    return (
      <div className="relative">
        {/* Relationship Label to Parent */}
        {relationshipToParent && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium border border-purple-200 shadow-sm">
              {relationshipToParent.relation}
              {relationshipToParent.relationMarathi && (
                <span className="ml-1 text-purple-600">({relationshipToParent.relationMarathi})</span>
              )}
            </div>
          </div>
        )}
        
        <div 
          className={`bg-white rounded-lg shadow-md border-2 p-4 transition-all duration-200 cursor-pointer ${
            isSelected 
              ? 'border-blue-500 shadow-lg scale-105' 
              : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
          }`}
          onClick={() => setSelectedMember(member)}
        >
        {/* Member Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
              member.gender === 'Male' ? 'bg-blue-100' : 'bg-pink-100'
            }`}>
              <User className={`h-5 w-5 ${member.gender === 'Male' ? 'text-blue-500' : 'text-pink-500'}`} />
            </div>
            <div>
              <h4 className="font-bold text-sm">{memberName}</h4>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                  #{member.serNo}
                </span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  L{member.level}
                </span>
                {member.vansh && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {member.vansh}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <Link 
              to={`/family/member/${member.serNo}`}
              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
              title="View Details"
            >
              <Eye size={14} />
            </Link>
          </div>
        </div>

        {/* Member Details */}
        <div className="space-y-2 text-xs">
          {member.dob && (
            <div className="flex items-center text-gray-600">
              <Calendar size={12} className="mr-1" />
              <span>Born: {formatDate(member.dob)}</span>
            </div>
          )}
          
          {member.dod && (
            <div className="flex items-center text-gray-600">
              <Calendar size={12} className="mr-1" />
              <span>Died: {formatDate(member.dod)}</span>
            </div>
          )}
          
          {member.sonDaughterCount > 0 && (
            <div className="flex items-center text-gray-600">
              <Users size={12} className="mr-1" />
              <span>Children: {member.sonDaughterCount}</span>
            </div>
          )}
        </div>

        {/* Relationships */}
        {showRels && memberRelationships.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-700 mb-2">Relationships:</p>
            <div className="space-y-1">
              {memberRelationships.slice(0, 3).map((rel, idx) => {
                const otherMember = allMembers.find(m => 
                  m.serNo === (rel.fromSerNo === member.serNo ? rel.toSerNo : rel.fromSerNo)
                );
                return (
                  <div key={idx} className="text-xs text-gray-600">
                    <span className="bg-purple-100 text-purple-800 px-1 py-0.5 rounded text-xs">
                      {rel.relation}
                    </span>
                    {otherMember && (
                      <span className="ml-1">
                        → #{otherMember.serNo} {otherMember.fullName}
                      </span>
                    )}
                  </div>
                );
              })}
              {memberRelationships.length > 3 && (
                <p className="text-xs text-gray-500">+{memberRelationships.length - 3} more</p>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading comprehensive family tree...</p>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Family Tree</h3>
          <p className="text-gray-500 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  const levels = Object.keys(membersByLevel).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Complete Family Tree</h1>
            <p className="text-gray-600 mt-1">
              All {allMembers.length} family members with {allRelationships.length} relationships
            </p>
          </div>
          <div className="flex space-x-3 mt-4 lg:mt-0">
            <Link 
              to="/family"
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg flex items-center transition-colors"
            >
              <Home className="mr-2" size={16} />
              Family List
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-blue-600 text-sm font-medium">Total Members</p>
            <p className="text-2xl font-bold text-blue-800">{allMembers.length}</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <p className="text-purple-600 text-sm font-medium">Relationships</p>
            <p className="text-2xl font-bold text-purple-800">{allRelationships.length}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="text-green-600 text-sm font-medium">Generations</p>
            <p className="text-2xl font-bold text-green-800">{levels.length}</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
            <p className="text-orange-600 text-sm font-medium">Relation Types</p>
            <p className="text-2xl font-bold text-orange-800">{relationshipTypes.length}</p>
          </div>
          <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
            <p className="text-pink-600 text-sm font-medium">Filtered</p>
            <p className="text-2xl font-bold text-pink-800">{filteredMembers.length}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search members..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Relationship Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedRelationType}
              onChange={(e) => setSelectedRelationType(e.target.value)}
            >
              <option value="">All Relationships</option>
              {relationshipTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Show Relationships Toggle */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showRelationships}
                onChange={(e) => setShowRelationships(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Show Relationships</span>
            </label>
          </div>
        </div>
      </div>

      {/* Family Tree by Levels */}
      <div className="space-y-6">
        {levels.map(level => {
          const levelMembers = membersByLevel[level].filter(member => 
            filteredMembers.includes(member)
          );
          const isExpanded = expandedLevels.has(parseInt(level));

          if (levelMembers.length === 0) return null;

          return (
            <div key={level} className="bg-white rounded-lg shadow-md">
              {/* Level Header */}
              <div 
                className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleLevel(parseInt(level))}
              >
                <div className="flex items-center">
                  {isExpanded ? (
                    <ArrowDown size={20} className="mr-2 text-gray-600" />
                  ) : (
                    <ArrowRight size={20} className="mr-2 text-gray-600" />
                  )}
                  <h3 className="text-xl font-bold text-gray-800">
                    Generation {level} ({levelMembers.length} members)
                  </h3>
                </div>
                <div className="text-sm text-gray-600">
                  Click to {isExpanded ? 'collapse' : 'expand'}
                </div>
              </div>

              {/* Level Members */}
              {isExpanded && (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {levelMembers.map(member => {
                      // Find parent member from previous level
                      const parentMember = parseInt(level) > 1 ? 
                        allMembers.find(m => 
                          m.level === parseInt(level) - 1 && 
                          allRelationships.some(rel => 
                            (rel.fromSerNo === m.serNo && rel.toSerNo === member.serNo) ||
                            (rel.fromSerNo === member.serNo && rel.toSerNo === m.serNo)
                          )
                        ) : null;
                      
                      return (
                        <MemberCard 
                          key={member.serNo} 
                          member={member} 
                          showRelationships={showRelationships}
                          parentMember={parentMember}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Member Details Modal */}
      <Modal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        title={selectedMember?.fullName}
        size="lg"
      >
        {selectedMember && (
          <div className="p-6">
            {/* Member Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Serial Number:</span> #{selectedMember.serNo}</p>
                  <p><span className="font-medium">Generation:</span> Level {selectedMember.level}</p>
                  <p><span className="font-medium">Gender:</span> {selectedMember.gender}</p>
                  {selectedMember.vansh && <p><span className="font-medium">Vansh:</span> {selectedMember.vansh}</p>}
                  {selectedMember.dob && <p><span className="font-medium">Birth:</span> {new Date(selectedMember.dob).toLocaleDateString()}</p>}
                  {selectedMember.dod && <p><span className="font-medium">Death:</span> {new Date(selectedMember.dod).toLocaleDateString()}</p>}
                  <p><span className="font-medium">Children:</span> {selectedMember.sonDaughterCount || 0}</p>
                </div>
              </div>
            </div>
              
            {/* Member relationships */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-700">All Relationships ({getMemberRelationships(selectedMember.serNo).length}):</h4>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {getMemberRelationships(selectedMember.serNo).map((rel, idx) => {
                  const otherMember = allMembers.find(m => 
                    m.serNo === (rel.fromSerNo === selectedMember.serNo ? rel.toSerNo : rel.fromSerNo)
                  );
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
                          {rel.relation}
                        </span>
                        {rel.relationMarathi && (
                          <span className="ml-2 text-sm text-gray-600">({rel.relationMarathi})</span>
                        )}
                      </div>
                      {otherMember && (
                        <Link 
                          to={`/family/member/${otherMember.serNo}`}
                          onClick={() => setSelectedMember(null)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          #{otherMember.serNo} {otherMember.fullName}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Relationship Types Legend */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          All Relationship Types ({relationshipTypes.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {relationshipTypes.map(type => {
            const count = allRelationships.filter(r => r.relation === type).length;
            return (
              <div 
                key={type} 
                className={`p-2 rounded-lg text-sm cursor-pointer transition-colors ${
                  selectedRelationType === type 
                    ? 'bg-purple-200 text-purple-800' 
                    : 'bg-white text-gray-700 hover:bg-purple-100'
                }`}
                onClick={() => setSelectedRelationType(selectedRelationType === type ? '' : type)}
              >
                <span className="font-medium">{type}</span>
                <span className="ml-1 text-xs text-gray-500">({count})</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveFamilyTree;