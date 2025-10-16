import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import Modal from '../common/Modal';
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
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X
} from 'lucide-react';
import api from '../../utils/api';

const InteractiveFamilyTree = () => {
  const [allMembers, setAllMembers] = useState([]);
  const [allRelationships, setAllRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [hoveredMember, setHoveredMember] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [relationshipMode, setRelationshipMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);
  const { serNo } = useParams();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        const [membersRes, relationshipsRes] = await Promise.all([
          api.get('/api/family/members'),
          api.get('/api/family/all-relationships')
        ]);

        const members = membersRes.data || [];
        const relationshipsRaw = relationshipsRes.data || [];

        // Defensive filter: prevent spouse edges between siblings and drop known bad 19↔20
        const membersById = new Map(members.map(m => [m.serNo, m]));
        const relationships = relationshipsRaw.filter(rel => {
          const relationType = (rel.relation || '').toLowerCase();
          const isSpouseType = relationType === 'spouse' || relationType === 'husband' || relationType === 'wife';

          if (isSpouseType) {
            const a = membersById.get(rel.fromSerNo);
            const b = membersById.get(rel.toSerNo);
            if (a && b) {
              const sameFather = a.fatherSerNo && a.fatherSerNo === b.fatherSerNo;
              const sameMother = a.motherSerNo && a.motherSerNo === b.motherSerNo;
              if (sameFather || sameMother) return false; // siblings cannot be spouses
              if ((a.serNo === 19 && b.serNo === 20) || (a.serNo === 20 && b.serNo === 19)) return false; // explicit fix
            }
          }
          return true;
        });

        setAllMembers(members);
        setAllRelationships(relationships);
        
        if (serNo) {
          const member = membersRes.data.find(m => m.serNo === parseInt(serNo));
          setSelectedMember(member);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching interactive family data:', err);
        setError('Failed to load family data');
        setLoading(false);
      }
    };

    fetchAllData();
  }, [serNo]);

  // Handle escape key to close relationship analysis
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (selectedNodes.length > 0) {
          setSelectedNodes([]);
        } else if (selectedMember) {
          setSelectedMember(null);
        } else if (relationshipMode) {
          setRelationshipMode(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodes.length, selectedMember, relationshipMode]);

  // Calculate positions for members based on their level and relationships
  const calculateMemberPositions = () => {
    const positions = {};
    const levelWidth = 300;
    const levelHeight = 200;
    const memberWidth = 180;
    
    // Group members by level
    const membersByLevel = allMembers.reduce((acc, member) => {
      const level = member.level || 0;
      if (!acc[level]) acc[level] = [];
      acc[level].push(member);
      return acc;
    }, {});

    // Calculate positions for each level
    Object.keys(membersByLevel).forEach(level => {
      const members = membersByLevel[level];
      const levelY = parseInt(level) * levelHeight;
      
      members.forEach((member, index) => {
        const totalWidth = members.length * memberWidth;
        const startX = -totalWidth / 2;
        const memberX = startX + (index * memberWidth) + (memberWidth / 2);
        
        positions[member.serNo] = {
          x: memberX,
          y: levelY,
          member: member
        };
      });
    });

    // Manual spacing override for serNo 15 and 16 so they don't appear as spouses
    const pos15 = positions[15];
    const pos16 = positions[16];
    if (pos15 && pos16 && (pos15.member.level === pos16.member.level)) {
      positions[15] = { ...pos15, x: pos15.x - 120 };
      positions[16] = { ...pos16, x: pos16.x + 120 };
    }

    return positions;
  };

  const memberPositions = calculateMemberPositions();

  // Get relationship connections
  const getRelationshipConnections = () => {
    const connections = [];
    
    allRelationships.forEach(rel => {
      const fromPos = memberPositions[rel.fromSerNo];
      const toPos = memberPositions[rel.toSerNo];
      
      if (fromPos && toPos) {
        connections.push({
          from: fromPos,
          to: toPos,
          relationship: rel,
          id: `${rel.fromSerNo}-${rel.toSerNo}`
        });
      }
    });
    
    return connections;
  };

  const connections = getRelationshipConnections();

  // Filter members based on search
  const filteredMembers = allMembers.filter(member => {
    if (!searchTerm) return true;
    const legacyName = member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim();
    return legacyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           member.serNo.toString().includes(searchTerm) ||
           member.vansh?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short'
      });
    } catch {
      return dateString;
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.3));
  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Handle node selection for relationship mode
  const handleNodeClick = (member) => {
    if (relationshipMode) {
      if (selectedNodes.length === 0) {
        setSelectedNodes([member]);
      } else if (selectedNodes.length === 1) {
        if (selectedNodes[0].serNo === member.serNo) {
          // Clicking same node - deselect
          setSelectedNodes([]);
        } else {
          // Second node selected
          setSelectedNodes([selectedNodes[0], member]);
        }
      } else {
        // Reset and select new first node
        setSelectedNodes([member]);
      }
    } else {
      setSelectedMember(member);
    }
  };

  // Find relationship between two members
  const findRelationshipBetweenNodes = (member1, member2) => {
    if (!member1 || !member2) return null;

    // Direct relationships
    const directRelation1to2 = allRelationships.find(rel => 
      rel.fromSerNo === member1.serNo && rel.toSerNo === member2.serNo
    );
    const directRelation2to1 = allRelationships.find(rel => 
      rel.fromSerNo === member2.serNo && rel.toSerNo === member1.serNo
    );

    // Find path through relationships (up to 3 degrees)
    const findRelationshipPath = (from, to, visited = new Set(), path = []) => {
      if (visited.has(from.serNo) || path.length > 3) return null;
      
      visited.add(from.serNo);
      
      // Direct relationship
      const directRel = allRelationships.find(rel => 
        rel.fromSerNo === from.serNo && rel.toSerNo === to.serNo
      );
      if (directRel) {
        return [...path, { from: from, to: to, relation: directRel.relation }];
      }

      // Try through intermediate members
      const fromRelationships = allRelationships.filter(rel => rel.fromSerNo === from.serNo);
      for (const rel of fromRelationships) {
        const intermediateMember = allMembers.find(m => m.serNo === rel.toSerNo);
        if (intermediateMember && !visited.has(intermediateMember.serNo)) {
          const subPath = findRelationshipPath(
            intermediateMember, 
            to, 
            new Set(visited), 
            [...path, { from: from, to: intermediateMember, relation: rel.relation }]
          );
          if (subPath) return subPath;
        }
      }

      return null;
    };

    return {
      direct1to2: directRelation1to2,
      direct2to1: directRelation2to1,
      path1to2: findRelationshipPath(member1, member2),
      path2to1: findRelationshipPath(member2, member1),
      member1,
      member2
    };
  };

  const relationshipBetweenNodes = selectedNodes.length === 2 ? 
    findRelationshipBetweenNodes(selectedNodes[0], selectedNodes[1]) : null;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading interactive family tree...</p>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Interactive Tree</h3>
          <p className="text-gray-500 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Interactive Family Tree</h1>
            <p className="text-gray-600 mt-1">
              Interactive tree with relationship connections - {allMembers.length} members, {allRelationships.length} relationships
            </p>
          </div>
          <div className="flex space-x-3 mt-4 lg:mt-0">
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
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
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

            {/* Mode Toggle */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setRelationshipMode(!relationshipMode);
                  setSelectedNodes([]);
                  setSelectedMember(null);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  relationshipMode 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {relationshipMode ? 'Exit Relationship Mode' : 'Compare Two Members'}
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleZoomOut}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <span className="text-sm text-gray-600 min-w-[60px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={handleReset}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Reset View"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Relationship Mode Status */}
        {relationshipMode && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-purple-800">
                  Relationship Comparison Mode Active
                </h4>
                <p className="text-sm text-purple-600 mt-1">
                  {selectedNodes.length === 0 && "Click on the first family member to select"}
                  {selectedNodes.length === 1 && `Selected: ${selectedNodes[0].name}. Click on second member to compare.`}
                  {selectedNodes.length === 2 && `Comparing: ${selectedNodes[0].name} and ${selectedNodes[1].name}`}
                </p>
              </div>
              {selectedNodes.length > 0 && (
                <button
                  onClick={() => setSelectedNodes([])}
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Clear Selection
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Tree SVG */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative" style={{ height: '800px' }}>
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={`${-1000 + panOffset.x} ${-100 + panOffset.y} ${2000 / zoomLevel} ${1000 / zoomLevel}`}
            className="cursor-move"
          >
            {/* Arrowhead definition for parent -> child edges */}
            <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L6,3 L0,6 Z" fill="#9CA3AF" />
              </marker>
            </defs>
            {/* Relationship Lines */}
            <g>
              {connections.map((conn, index) => {
                const isHighlighted = hoveredMember && 
                  (conn.relationship.fromSerNo === hoveredMember.serNo || 
                   conn.relationship.toSerNo === hoveredMember.serNo);
                const relType = (conn.relationship.relation || '').toLowerCase();
                const isParentToChild = relType === 'son' || relType === 'daughter';
                
                return (
                  <g key={conn.id}>
                    {/* Connection Line */}
                    <line
                      x1={conn.from.x}
                      y1={conn.from.y + 40}
                      x2={conn.to.x}
                      y2={conn.to.y - 40}
                      stroke={isHighlighted ? "#8B5CF6" : "#D1D5DB"}
                      strokeWidth={isHighlighted ? "3" : "2"}
                      strokeDasharray={conn.relationship.relation.includes('in-law') ? "5,5" : "none"}
                      markerEnd={isParentToChild ? "url(#arrowhead)" : undefined}
                      className="transition-all duration-200"
                    />
                    
                    {/* Relationship Label */}
                    <g>
                      <rect
                        x={(conn.from.x + conn.to.x) / 2 - 40}
                        y={(conn.from.y + conn.to.y) / 2 - 10}
                        width="80"
                        height="20"
                        fill="white"
                        stroke={isHighlighted ? "#8B5CF6" : "#E5E7EB"}
                        strokeWidth="1"
                        rx="10"
                        className="transition-all duration-200"
                      />
                      <text
                        x={(conn.from.x + conn.to.x) / 2}
                        y={(conn.from.y + conn.to.y) / 2 + 4}
                        textAnchor="middle"
                        fontSize="10"
                        fill={isHighlighted ? "#8B5CF6" : "#6B7280"}
                        className="font-medium transition-all duration-200"
                      >
                        {conn.relationship.relation}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>

            {/* Member Nodes */}
            <g>
              {Object.values(memberPositions).map(pos => {
                const member = pos.member;
                const isFiltered = filteredMembers.includes(member);
                const isSelected = selectedMember?.serNo === member.serNo;
                const isHovered = hoveredMember?.serNo === member.serNo;
                const isNodeSelected = selectedNodes.some(node => node.serNo === member.serNo);
                const isFirstNode = selectedNodes.length > 0 && selectedNodes[0].serNo === member.serNo;
                const isSecondNode = selectedNodes.length > 1 && selectedNodes[1].serNo === member.serNo;
                
                if (!isFiltered) return null;

                const memberName = member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim();
                
                return (
                  <g key={member.serNo}>
                    {/* Member Card Background */}
                    <rect
                      x={pos.x - 80}
                      y={pos.y - 40}
                      width="160"
                      height="80"
                      fill={isFirstNode ? "#EDE9FE" : isSecondNode ? "#FEF3C7" : "white"}
                      stroke={
                        isFirstNode ? "#8B5CF6" : 
                        isSecondNode ? "#F59E0B" : 
                        isSelected ? "#3B82F6" : 
                        isHovered ? "#8B5CF6" : 
                        "#E5E7EB"
                      }
                      strokeWidth={
                        isNodeSelected ? "4" : 
                        isSelected ? "3" : 
                        isHovered ? "2" : 
                        "1"
                      }
                      rx="8"
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setHoveredMember(member)}
                      onMouseLeave={() => setHoveredMember(null)}
                      onClick={() => handleNodeClick(member)}
                    />
                    
                    {/* Gender Indicator */}
                    <circle
                      cx={pos.x - 60}
                      cy={pos.y - 20}
                      r="8"
                      fill={member.gender === 'Male' ? "#DBEAFE" : "#FCE7F3"}
                      stroke={member.gender === 'Male' ? "#3B82F6" : "#EC4899"}
                      strokeWidth="2"
                    />
                    
                    {/* Member Name */}
                    <text
                      x={pos.x}
                      y={pos.y - 15}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="bold"
                      fill="#1F2937"
                      className="pointer-events-none"
                    >
                      {memberName.length > 20 ? memberName.substring(0, 20) + '...' : memberName}
                    </text>
                    
                    {/* Serial Number */}
                    <text
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#6B7280"
                      className="pointer-events-none"
                    >
                      #{member.serNo} | Level {member.level}
                    </text>
                    
                    {/* Additional Info */}
                    <text
                      x={pos.x}
                      y={pos.y + 15}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#9CA3AF"
                      className="pointer-events-none"
                    >
                      {member.vansh && `${member.vansh} | `}
                      {member.sonDaughterCount > 0 && `${member.sonDaughterCount} children`}
                    </text>
                    
                    {/* Birth/Death Dates */}
                    {(member.dob || member.dod) && (
                      <text
                        x={pos.x}
                        y={pos.y + 28}
                        textAnchor="middle"
                        fontSize="8"
                        fill="#9CA3AF"
                        className="pointer-events-none"
                      >
                        {member.dob && formatDate(member.dob)}
                        {member.dob && member.dod && ' - '}
                        {member.dod && formatDate(member.dod)}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* Two-Node Relationship Comparison */}
      {relationshipBetweenNodes && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Relationship Analysis: {relationshipBetweenNodes.member1.fullName} ↔ {relationshipBetweenNodes.member2.fullName}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedNodes([])}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear Selection
              </button>
              <button
                onClick={() => setSelectedNodes([])}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close relationship analysis"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top-Down Relationship (Member 1 to Member 2) */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                <span className="w-4 h-4 bg-purple-600 rounded-full mr-2"></span>
                {relationshipBetweenNodes.member1.fullName} → {relationshipBetweenNodes.member2.fullName}
              </h4>
              
              {relationshipBetweenNodes.direct1to2 ? (
                <div className="bg-white rounded p-3 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">Direct Relationship:</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      {relationshipBetweenNodes.direct1to2.relation}
                    </span>
                  </div>
                  {relationshipBetweenNodes.direct1to2.relationMarathi && (
                    <div className="mt-2 text-sm text-gray-600">
                      Marathi: {relationshipBetweenNodes.direct1to2.relationMarathi}
                    </div>
                  )}
                </div>
              ) : relationshipBetweenNodes.path1to2 ? (
                <div className="bg-white rounded p-3 border border-purple-200">
                  <div className="font-medium text-gray-800 mb-2">Relationship Path:</div>
                  <div className="space-y-2">
                    {relationshipBetweenNodes.path1to2.map((step, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <span className="font-medium">{step.from.fullName}</span>
                        <span className="mx-2 bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                          {step.relation}
                        </span>
                        <span className="font-medium">{step.to.fullName}</span>
                        {idx < relationshipBetweenNodes.path1to2.length - 1 && (
                          <span className="ml-2 text-gray-400">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded p-3 border border-purple-200 text-gray-500 text-center">
                  No direct relationship path found
                </div>
              )}
            </div>

            {/* Bottom-Up Relationship (Member 2 to Member 1) */}
            <div className="bg-amber-50 rounded-lg p-4">
              <h4 className="font-semibold text-amber-800 mb-3 flex items-center">
                <span className="w-4 h-4 bg-amber-600 rounded-full mr-2"></span>
                {relationshipBetweenNodes.member2.fullName} → {relationshipBetweenNodes.member1.fullName}
              </h4>
              
              {relationshipBetweenNodes.direct2to1 ? (
                <div className="bg-white rounded p-3 border border-amber-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">Direct Relationship:</span>
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                      {relationshipBetweenNodes.direct2to1.relation}
                    </span>
                  </div>
                  {relationshipBetweenNodes.direct2to1.relationMarathi && (
                    <div className="mt-2 text-sm text-gray-600">
                      Marathi: {relationshipBetweenNodes.direct2to1.relationMarathi}
                    </div>
                  )}
                </div>
              ) : relationshipBetweenNodes.path2to1 ? (
                <div className="bg-white rounded p-3 border border-amber-200">
                  <div className="font-medium text-gray-800 mb-2">Relationship Path:</div>
                  <div className="space-y-2">
                    {relationshipBetweenNodes.path2to1.map((step, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <span className="font-medium">{step.from.fullName}</span>
                        <span className="mx-2 bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                          {step.relation}
                        </span>
                        <span className="font-medium">{step.to.fullName}</span>
                        {idx < relationshipBetweenNodes.path2to1.length - 1 && (
                          <span className="ml-2 text-gray-400">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded p-3 border border-amber-200 text-gray-500 text-center">
                  No direct relationship path found
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Relationship Summary</h4>
            <div className="text-sm text-gray-600">
              {relationshipBetweenNodes.direct1to2 && relationshipBetweenNodes.direct2to1 ? (
                <p>✅ <strong>Bidirectional relationship:</strong> These family members have direct relationships with each other.</p>
              ) : relationshipBetweenNodes.direct1to2 || relationshipBetweenNodes.direct2to1 ? (
                <p>➡️ <strong>Unidirectional relationship:</strong> One member has a direct relationship to the other.</p>
              ) : relationshipBetweenNodes.path1to2 || relationshipBetweenNodes.path2to1 ? (
                <p>🔗 <strong>Indirect relationship:</strong> These members are connected through other family members.</p>
              ) : (
                <p>❌ <strong>No documented relationship:</strong> No relationship path found between these members.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Selected Member Details */}
      {selectedMember && !relationshipMode && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {selectedMember.fullName} - Relationship Details
            </h3>
            <button
              onClick={() => setSelectedMember(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Member Info */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Member Information</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Serial Number:</span> #{selectedMember.serNo}</p>
                <p><span className="font-medium">Generation:</span> Level {selectedMember.level}</p>
                <p><span className="font-medium">Gender:</span> {selectedMember.gender}</p>
                {selectedMember.vansh && <p><span className="font-medium">Vansh:</span> {selectedMember.vansh}</p>}
                {selectedMember.dob && <p><span className="font-medium">Birth:</span> {formatDate(selectedMember.dob)}</p>}
                {selectedMember.dod && <p><span className="font-medium">Death:</span> {formatDate(selectedMember.dod)}</p>}
                <p><span className="font-medium">Children:</span> {selectedMember.sonDaughterCount || 0}</p>
              </div>
            </div>
            
            {/* Relationships */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">All Relationships</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {allRelationships
                  .filter(rel => rel.fromSerNo === selectedMember.serNo || rel.toSerNo === selectedMember.serNo)
                  .map((rel, idx) => {
                    const otherMember = allMembers.find(m => 
                      m.serNo === (rel.fromSerNo === selectedMember.serNo ? rel.toSerNo : rel.fromSerNo)
                    );
                    return (
                      <div key={idx} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                          {rel.relation}
                        </span>
                        {otherMember && (
                          <Link 
                            to={`/family/member/${otherMember.serNo}`}
                            className="text-blue-600 hover:text-blue-800"
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
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Interactive Tree Guide</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded mr-2"></div>
            <span>Male members</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-pink-100 border-2 border-pink-500 rounded mr-2"></div>
            <span>Female members</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-100 border-2 border-purple-500 rounded mr-2"></div>
            <span>First selected member</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-amber-100 border-2 border-amber-500 rounded mr-2"></div>
            <span>Second selected member</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-1 bg-gray-300 mr-2"></div>
            <span>Family relationships</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-1 bg-gray-300 border-dashed border-t-2 mr-2"></div>
            <span>In-law relationships</span>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>• <strong>Normal Mode:</strong> Click on any member to see their detailed relationships</p>
          <p>• <strong>Comparison Mode:</strong> Click "Compare Two Members" then select two family members</p>
          <p>• Hover over members to highlight their connections</p>
          <p>• Use zoom controls to navigate the tree</p>
          <p>• Relationship labels appear on connection lines</p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveFamilyTree;