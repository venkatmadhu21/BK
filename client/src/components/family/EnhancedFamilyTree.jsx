import React, { useState, useEffect, useMemo } from 'react';
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
import EnhancedFamilyMemberCard from './EnhancedFamilyMemberCard';
import api from '../../utils/api';

const EnhancedFamilyTree = () => {
  const [treeData, setTreeData] = useState(null);
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [hasChildrenOnly, setHasChildrenOnly] = useState(false);
  const { serNo } = useParams();

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        setLoading(true);
        
        // Fetch the family tree (legacy endpoint)
        const treeRes = await api.get(`/api/family/tree/${serNo || 1}`);
        setTreeData(treeRes.data);
        
        // Fetch all relationships for context
        const relationshipsRes = await api.get('/api/family/relationships');
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

  const flattenTree = useMemo(() => {
    if (!treeData) return [];
    const list = [];
    const traverse = (node) => {
      if (!node) return;
      list.push(node);
      if (node.children && node.children.length) {
        node.children.forEach(traverse);
      }
    };
    traverse(treeData);
    return list;
  }, [treeData]);

  const filteredMembers = useMemo(() => {
    if (!flattenTree.length) return [];
    const query = searchQuery.trim().toLowerCase();
    return flattenTree.filter((m) => {
      const name = (m.name || `${m.firstName || ''} ${m.middleName || ''} ${m.lastName || ''}`.trim()).toLowerCase();
      const vansh = (m.vansh || '').toLowerCase();
      const matchesQuery = !query || name.includes(query) || String(m.serNo).includes(query) || vansh.includes(query);
      const matchesGender = genderFilter === 'All' || m.gender === genderFilter;
      const matchesChildren = !hasChildrenOnly || (m.children && m.children.length > 0);
      return matchesQuery && matchesGender && matchesChildren;
    });
  }, [flattenTree, searchQuery, genderFilter, hasChildrenOnly]);

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

  // Infer parents from relationships for higher accuracy
  const getParentSerNos = (member) => {
    if (!member) return { father: null, mother: null };
    let father = null;
    let mother = null;
    for (const rel of relationships) {
      if (rel?.toSerNo === member.serNo) {
        if (!father && (rel.relation === 'Father' || rel.relationEnglish === 'Father')) father = rel.fromSerNo;
        if (!mother && (rel.relation === 'Mother' || rel.relationEnglish === 'Mother')) mother = rel.fromSerNo;
      }
      if (father && mother) break;
    }
    return {
      father: father || member.fatherSerNo || null,
      mother: mother || member.motherSerNo || null
    };
  };

  const getChildrenCount = (member) => {
    if (!member) return 0;
    if (Array.isArray(member.children) && member.children.length > 0) return member.children.length;
    if (typeof member.sonDaughterCount === 'number') return member.sonDaughterCount;
    return 0;
  };

  const MemberNode = ({ member, level = 0, parentSerNo = null }) => {
    const isExpanded = expandedNodes.has(member.serNo);
    const hasChildren = member.children && member.children.length > 0;
    const memberName = member.name || `${member.firstName || ''} ${member.middleName || ''} ${member.lastName || ''}`.trim();
    
    // Get relationship info if this member has a parent
    const relationshipInfo = parentSerNo ? getRelationshipInfo(parentSerNo, member.serNo) : null;

    return (
      <div className="relative">
        {/* Connection Line */}
        {level > 0 && (
          <div className="absolute -left-6 top-6 w-6 h-px bg-gray-300"></div>
        )}
        
        {/* Member Card */}
        <div className={`mb-4 transition-all duration-300 ${
          member.serNo === parseInt(serNo)
            ? 'bg-gradient-to-r from-blue-500/70 via-sky-400/70 to-blue-500/70 p-[2px] rounded-xl shadow-lg'
            : 'bg-gradient-to-r from-gray-200/60 via-gray-100/60 to-gray-200/60 p-[2px] rounded-xl hover:shadow-lg'
        }`}>
          <div className={`bg-white rounded-[10px] ${member.serNo === parseInt(serNo) ? 'ring-1 ring-blue-200' : ''}`}>
            <div className="p-4">
            {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className={`relative mr-3`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-inner ${
                      member.gender === 'Male' ? 'bg-blue-50 ring-2 ring-blue-200' : 'bg-pink-50 ring-2 ring-pink-200'
                    }`}>
                      <User className={`h-6 w-6 ${member.gender === 'Male' ? 'text-blue-600' : 'text-pink-600'}`} />
                    </div>
                    <span className={`absolute -bottom-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      member.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                    }`}>
                      {member.gender?.[0] || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-gray-800 tracking-tight">{memberName}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mt-1">
                      <span className="inline-flex items-center bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full font-semibold border border-amber-200">
                        #{member.serNo}
                      </span>
                      <span className="inline-flex items-center bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                        Level {member.level}
                      </span>
                      {relationshipInfo && (
                        <span className="inline-flex items-center bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                          {relationshipInfo.relation}
                          {relationshipInfo.relationMarathi && ` (${relationshipInfo.relationMarathi})`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-1">
                  <Link 
                    to={`/family/member/${member.serNo}`}
                    className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </Link>
                  <Link 
                    to={`/family/tree/${member.serNo}`}
                    className="p-2 text-emerald-600 hover:text-white hover:bg-emerald-600 rounded-lg transition-colors"
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
                  <p className="font-semibold text-gray-800">{member.gender}</p>
                </div>
                
                {member.vansh && (
                  <div className="text-sm">
                    <p className="text-gray-500 flex items-center">
                      <MapPin size={12} className="mr-1" />
                      Vansh
                    </p>
                    <p className="font-semibold text-gray-800">{member.vansh}</p>
                  </div>
                )}
                
                <div className="text-sm">
                  <p className="text-gray-500">Children</p>
                  <p className="font-semibold text-gray-800">{getChildrenCount(member)}</p>
                </div>

                {member.dob && (
                  <div className="text-sm">
                    <p className="text-gray-500 flex items-center">
                      <Calendar size={12} className="mr-1" />
                      Birth
                    </p>
                    <p className="font-semibold text-gray-800">{formatDate(member.dob)}</p>
                  </div>
                )}
              </div>

            {/* Family Relationships */}
              <div className="space-y-2">
                {/* Spouse */}
                {member.spouseSerNo && (
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-2 rounded-lg border border-pink-200">
                    <p className="text-sm text-pink-700 flex items-center font-semibold">
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
                {(() => { const p = getParentSerNos(member); return p.father || p.mother; })() && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-2 rounded-lg border border-emerald-200">
                    <p className="text-sm text-blue-700 flex items-center font-semibold mb-1">
                      <Users size={14} className="mr-2" />
                      Parents:
                    </p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      {getParentSerNos(member).father && (
                        <Link 
                          to={`/family/member/${getParentSerNos(member).father}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          Father #{getParentSerNos(member).father}
                        </Link>
                      )}
                      {getParentSerNos(member).mother && (
                        <Link 
                          to={`/family/member/${getParentSerNos(member).mother}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          Mother #{getParentSerNos(member).mother}
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
                    className="group flex items-center text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <ArrowDown size={16} className="mr-1 transition-transform group-hover:translate-y-0.5" />
                        Hide {member.children.length} children
                      </>
                    ) : (
                      <>
                        <ArrowRight size={16} className="mr-1 transition-transform group-hover:translate-x-0.5" />
                        Show {member.children.length} children
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
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

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-500 mr-2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, #serNo, or vansh..."
                className="w-full bg-transparent outline-none text-sm text-gray-700"
              />
            </div>
          </div>
          <div>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700"
            >
              <option>All</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={hasChildrenOnly}
                onChange={(e) => setHasChildrenOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-200"
              />
              <span>Only with children</span>
            </label>
            <button
              onClick={() => { setSearchQuery(''); setGenderFilter('All'); setHasChildrenOnly(false); }}
              className="text-xs text-gray-600 hover:text-gray-800 px-2 py-1 border border-gray-200 rounded-md"
            >
              Clear
            </button>
          </div>
        </div>
        {searchQuery || genderFilter !== 'All' || hasChildrenOnly ? (
          <p className="mt-3 text-xs text-gray-600">{filteredMembers.length} result(s)</p>
        ) : null}
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

      {/* Filtered Results */}
      {(searchQuery || genderFilter !== 'All' || hasChildrenOnly) && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          {filteredMembers.length === 0 ? (
            <p className="text-sm text-gray-600">No members match the current filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.slice(0, 24).map((m) => (
                <EnhancedFamilyMemberCard key={m.serNo} member={m} compact={false} />
              ))}
            </div>
          )}
        </div>
      )}

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