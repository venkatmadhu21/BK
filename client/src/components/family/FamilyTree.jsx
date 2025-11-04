import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FamilyMemberCard from './FamilyMemberCard';
import GraphicalFamilyTree from './GraphicalFamilyTree';
import VerticalFamilyTree from './VerticalFamilyTree';
import ModernFamilyTree from './ModernFamilyTree';
import CardFamilyTree from './CardFamilyTree';
import FamilyTreePDFExport from './FamilyTreePDFExport';
import EnhancedFamilyTree from './EnhancedFamilyTree';
import ComprehensiveFamilyTree from './ComprehensiveFamilyTree';
import InteractiveFamilyTree from './InteractiveFamilyTree';
import ReactD3FamilyTree from './ReactD3FamilyTree';
import api from '../../utils/api';
import { transformMemberData, transformMembersData } from '../../utils/memberTransform';
import { getProfileImageUrl } from '../../utils/profileImages';
import '../../styles/heritage-background.css';

// Simple recursive component for text-based tree view
const SimpleTreeView = ({ data, level = 0 }) => {
  const [expanded, setExpanded] = useState(true);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const indent = Array(level * 2).fill('\u00A0').join('');

  return (
    <div className="font-mono">
      <div onClick={toggleExpand} className="cursor-pointer hover:bg-gray-100 p-1">
        {indent}
        {data.children.length > 0 ? (expanded ? '▼' : '►') : '•'}
        <Link to={`/family/member/${data.attributes.serNo}`} className="font-semibold hover:text-blue-600">
          {data.name}
        </Link>
        {data.attributes.spouse && <span className="text-gray-600"> (Spouse: {data.attributes.spouse})</span>}
        <span className="text-gray-500 text-sm ml-2">#{data.attributes.serNo}</span>
      </div>

      {expanded && data.children.map((child, index) => (
        <SimpleTreeView key={index} data={child} level={level + 1} />
      ))}
    </div>
  );
};

// Timeline view component for chronological family events
const TimelineView = ({ data }) => {
  // Flatten the tree data into a timeline
  const flattenTree = (node, events = [], level = 0) => {
    if (!node) return events;

    // Add birth event if we have date info
    if (node.attributes?.birthYear || node.attributes?.birthDate) {
      events.push({
        type: 'birth',
        person: node.name,
        serNo: node.attributes.serNo,
        date: node.attributes.birthDate || node.attributes.birthYear,
        year: node.attributes.birthYear || (node.attributes.birthDate ? new Date(node.attributes.birthDate).getFullYear() : null)
      });
    }

    // Add marriage event if we have marriage info
    if (node.attributes?.marriageYear || node.attributes?.marriageDate) {
      events.push({
        type: 'marriage',
        person: node.name,
        spouse: node.attributes.spouse,
        serNo: node.attributes.serNo,
        date: node.attributes.marriageDate || node.attributes.marriageYear,
        year: node.attributes.marriageYear || (node.attributes.marriageDate ? new Date(node.attributes.marriageDate).getFullYear() : null)
      });
    }

    // Recursively process children
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(child => flattenTree(child, events, level + 1));
    }

    return events;
  };

  const events = flattenTree(data);

  // Group events by year
  const eventsByYear = events.reduce((acc, event) => {
    if (event.year) {
      if (!acc[event.year]) {
        acc[event.year] = [];
      }
      acc[event.year].push(event);
    }
    return acc;
  }, {});

  // Sort years
  const sortedYears = Object.keys(eventsByYear).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="space-y-6">
      {sortedYears.map(year => (
        <div key={year} className="border-l-4 border-blue-500 pl-4">
          <h4 className="text-lg font-semibold text-blue-600 mb-3">{year}</h4>
          <div className="space-y-3">
            {eventsByYear[year].map((event, index) => (
              <div key={index} className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      event.type === 'birth' ? 'bg-green-100 text-green-800' :
                      event.type === 'marriage' ? 'bg-pink-100 text-pink-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                    <Link
                      to={`/family/member/${event.serNo}`}
                      className="ml-2 font-medium text-gray-900 hover:text-blue-600"
                    >
                      {event.person}
                    </Link>
                    {event.type === 'marriage' && event.spouse && (
                      <span className="text-gray-600"> & {event.spouse}</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{event.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {events.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No timeline data available for this family member.
        </div>
      )}
    </div>
  );
};

const FamilyTree = () => {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { serNo } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user is admin
  const isAdmin = user && (user.isAdmin || user.role === 'admin');

  // Define available views based on user role
  const availableViews = isAdmin ? [
    { key: 'reactd3', label: 'React D3 Tree (Couples)' },
    { key: 'enhanced', label: 'Enhanced Tree' },
    { key: 'card', label: 'Collapsible Tree' },
    { key: 'horizontal', label: 'Horizontal Tree' },
    { key: 'text', label: 'Text View' }
  ] : [
    { key: 'reactd3', label: 'Interactive Family Tree' }
  ];

  // Default view based on role and route
  const getDefaultView = () => {
    if (!isAdmin) return 'reactd3';
    return serNo ? 'horizontal' : 'reactd3';
  };

  const [viewType, setViewType] = useState(getDefaultView());

  useEffect(() => {
    const fetchFamilyTree = async () => {
      try {
        setLoading(true);

        // ReactD3FamilyTree handles its own data fetching, so skip for that view
        if (viewType === 'reactd3') {
          setLoading(false);
          return;
        }

        // Helper to pick a valid root serNo from the Members collection
        const getDefaultRootSerNo = async () => {
          try {
            const res = await api.get('/api/family/members-new');
            const list = Array.isArray(res.data) ? res.data : [];
            if (list.length > 0) {
              const noParents = list.find(m => !m.fatherSerNo && !m.motherSerNo);
              return (noParents && noParents.serNo) ? noParents.serNo : list[0].serNo;
            }
          } catch (e) {
            console.warn('Failed to fetch members for default root:', e?.message || e);
          }
          // Fallback
          return 1;
        };

        if (viewType === 'comprehensive') {
          // Use the complete tree API for comprehensive views
          const res = await api.get('/api/family/complete-tree');
          // Transform members in the response
          const transformedData = {
            ...res.data,
            membersByLevel: Object.keys(res.data.membersByLevel || {}).reduce((acc, level) => {
              acc[level] = transformMembersData(res.data.membersByLevel[level] || []);
              return acc;
            }, {})
          };
          console.log('Complete tree data loaded:', res.data.totalMembers, 'members');
          setTreeData(transformedData);
        } else {
          // Resolve a valid root serNo first
          let rootSerNo = serNo ? parseInt(serNo, 10) : null;

          if (rootSerNo) {
            try {
              // Verify the member exists in new Members collection
              await api.get(`/api/family/member-new/${rootSerNo}`);
            } catch (e) {
              console.warn(`Provided serNo ${rootSerNo} not found in Members collection, selecting default root.`);
              rootSerNo = await getDefaultRootSerNo();
            }
          } else {
            rootSerNo = await getDefaultRootSerNo();
          }

          // Use the family tree API for single-root views
          console.log('Resolved root serNo:', rootSerNo);
          const res = await api.get(`/api/family/tree-fmem/${rootSerNo}`);
          console.log('Individual tree data loaded for serNo:', rootSerNo);

          // Transform the data for our tree view
          const transformedData = transformData(res.data);
          setTreeData(transformedData);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching family tree:', err);
        setError('Failed to load family tree. Please try again later.');
        setLoading(false);
      }
    };

    fetchFamilyTree();
  }, [serNo, viewType]);

  // Transform the data structure for our tree view (original API shape)
  const transformData = (member) => {
    if (!member) return null;

    // First, normalize the member data from new schema
    const normalizedMember = transformMemberData(member);

    const memberName = normalizedMember.fullName || 'Unknown';
    
    // Build spouse object if exists (preserve full structure for components like GraphicalFamilyTree)
    const spouseObj = normalizedMember.spouse ? {
      fullName: normalizedMember.spouse.fullName || 'Unknown Spouse',
      firstName: normalizedMember.spouse.firstName || '',
      lastName: normalizedMember.spouse.lastName || '',
      serNo: normalizedMember.spouse.serNo,
      gender: normalizedMember.spouse.gender || 'Unknown'
    } : null;

    const node = {
      name: memberName,
      attributes: {
        serNo: normalizedMember.serNo || 0,
        gender: normalizedMember.gender || 'Unknown',
        vansh: normalizedMember.vansh || '',
        level: normalizedMember.level || 1,
        sonDaughterCount: normalizedMember.sonDaughterCount || 0,
        spouse: spouseObj?.fullName || '', // Keep as string for backwards compatibility in attributes
        birthDate: normalizedMember.dateOfBirth || '',
        birthYear: normalizedMember.dateOfBirth ? new Date(normalizedMember.dateOfBirth).getFullYear() : null,
        marriageDate: normalizedMember.dateOfMarriage || '',
        marriageYear: normalizedMember.dateOfMarriage ? new Date(normalizedMember.dateOfMarriage).getFullYear() : null,
        profilePicture: getProfileImageUrl(normalizedMember.profileImage, normalizedMember.gender)
      },
      children: [],
      spouse: spouseObj // Add spouse as separate property for components that need full object
    };

    // Original API: no spouse augmentation, only nested children
    if (Array.isArray(member.children) && member.children.length > 0) {
      node.children = member.children
        .filter(Boolean)
        .map(child => transformData(child))
        .filter(Boolean);
    }

    return node;
  };

  // ReactD3FamilyTree handles its own loading and data, skip validation for that view
  if (viewType !== 'reactd3') {
    if (loading) return <div className="text-center py-10">Loading family tree...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
    if (!treeData) return <div className="text-center py-10">No family tree data available.</div>;

    // Additional safety check for data structure
    if (viewType === 'comprehensive' && !treeData.totalMembers) {
      return <div className="text-center py-10 text-yellow-600">Complete tree data not available. Please try again.</div>;
    }
  }

  return (
    <div className="heritage-bg min-h-screen">
      <div className="heritage-gradient-overlay"></div>
      <div className="heritage-decoration"></div>
      <div className="heritage-decoration"></div>
      <div className="heritage-decoration"></div>
      <div className="heritage-decoration"></div>
      <div className="heritage-content family-tree-container">
        <div className="mb-4">
          <Link to="/family" className="text-blue-600 hover:text-blue-800">
            ← Back to Family List
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-center">Family Tree</h2>
        {viewType === 'comprehensive' ? (
          <p className="text-center mb-6 text-gray-600">
            Showing complete family tree with <strong>{treeData.totalMembers}</strong> members across {treeData.levels.length} generations
          </p>
        ) : (
          <p className="text-center mb-6 text-gray-600">
            Showing family tree for: <strong>{treeData?.name || 'Family Member'}</strong>
            {treeData?.attributes?.serNo && ` (#${treeData.attributes.serNo})`}
          </p>
        )}

        {/* View type selector - only show if multiple views available */}
        {availableViews.length > 1 && (
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-md shadow-sm flex-wrap justify-center" role="group">
              {availableViews.map((view, index) => (
                <button
                  key={view.key}
                  type="button"
                  className={`px-4 py-2 text-sm font-medium ${
                    viewType === view.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  } ${
                    index === 0 ? 'rounded-l-lg' :
                    index === availableViews.length - 1 ? 'rounded-r-lg' : ''
                  }`}
                  onClick={() => setViewType(view.key)}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>
        )}



        {/* React D3 Tree view (couple nodes, zoom/pan) */}
        {viewType === 'reactd3' && (
          <div className="heritage-card mb-8 p-4 border rounded bg-white overflow-hidden">
            <h3 className="text-xl mb-2">Interactive Family Tree</h3>
            <p className="text-sm text-gray-500 mb-4">Zoom, pan, expand/collapse. Spouses are side-by-side.</p>
            <ReactD3FamilyTree />
          </div>
        )}

        {/* Interactive tree view - SVG tree with relationship lines */}
        {viewType === 'interactive' && (
          <InteractiveFamilyTree />
        )}

        {/* Comprehensive view - All members organized by levels */}
        {viewType === 'comprehensive' && treeData && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">All Family Members ({treeData.totalMembers})</h3>
            <div className="space-y-6">
              {treeData.levels.map(level => (
                <div key={level} className="heritage-card bg-white rounded-lg shadow-md p-6">
                  <h4 className="text-lg font-semibold mb-4 text-gray-800">
                    Generation {level} ({treeData.membersByLevel[level].length} members)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {treeData.membersByLevel[level].map(member => (
                      <div key={member.serNo} className="heritage-card border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${member.gender?.toLowerCase() === 'male' ? 'bg-blue-500' : 'bg-pink-500'}`}></div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{member.fullName}</h5>
                            <p className="text-sm text-gray-500">#{member.serNo}</p>
                            {member.vansh && <p className="text-xs text-gray-400">{member.vansh}</p>}
                          </div>
                        </div>
                        <div className="mt-2 flex space-x-2">
                          <Link
                            to={`/family/member/${member.serNo}`}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => navigate(`/family/tree/${member.serNo}`)}
                            className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                          >
                            View Tree
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Note: Comprehensive view is handled above with the complete tree data */}

        {/* Enhanced tree view */}
        {viewType === 'enhanced' && (
          <EnhancedFamilyTree />
        )}

        {/* Modern tree view */}
        {viewType === 'modern' && treeData && (treeData.serNo || treeData.attributes?.serNo) && (
          <div className="heritage-card mb-8 p-4 border rounded bg-white overflow-x-auto">
            <h3 className="text-xl mb-2">Modern Family Tree</h3>
            <p className="text-sm text-gray-500 mb-4">Click on any name to view their details. Click on a node to expand/collapse.</p>
            <div id="modern-tree-container" className="overflow-x-auto">
              <ModernFamilyTree data={treeData} />
            </div>
          </div>
        )}

        {/* Card tree view */}
        {viewType === 'card' && treeData && (treeData.serNo || treeData.attributes?.serNo) && (
          <div className="heritage-card mb-8 p-4 border rounded bg-white">
            <h3 className="text-xl mb-2">Card-based Family Tree</h3>
            <p className="text-sm text-gray-500 mb-4">Click on any name to view their details. Click on a node to expand/collapse.</p>
            <div id="card-tree-container">
              <CardFamilyTree data={treeData} />
            </div>
          </div>
        )}

        {/* Horizontal graphical tree view */}
        {viewType === 'horizontal' && treeData && (treeData.serNo || treeData.attributes?.serNo) && (
          <div className="heritage-card mb-8 p-4 border rounded bg-white overflow-x-auto">
            <h3 className="text-xl mb-2">Horizontal Family Tree</h3>
            <p className="text-sm text-gray-500 mb-4">Click on any name to view their details. Click on a node to expand/collapse.</p>
            <div id="horizontal-tree-container" className="overflow-x-auto">
              <GraphicalFamilyTree data={treeData} />
            </div>
          </div>
        )}

        {/* Vertical tree view */}
        {viewType === 'vertical' && treeData && (treeData.serNo || treeData.attributes?.serNo) && (
          <div className="heritage-card mb-8 p-4 border rounded bg-white">
            <h3 className="text-xl mb-2">Vertical Family Tree</h3>
            <p className="text-sm text-gray-500 mb-4">Click on any name to view their details. Click on a node to expand/collapse.</p>
            <div id="vertical-tree-container">
              <VerticalFamilyTree data={treeData} />
            </div>
          </div>
        )}

        {/* Simple text-based tree view */}
        {viewType === 'text' && treeData && (treeData.serNo || treeData.attributes?.serNo) && (
          <div className="heritage-card mb-8 p-4 border rounded bg-white">
            <h3 className="text-xl mb-2">Text-based Family Tree</h3>
            <p className="text-sm text-gray-500 mb-4">Click on any name to view their details</p>
            <div id="text-tree-container">
              <SimpleTreeView data={treeData} />
            </div>
          </div>
        )}

        {/* Pedigree chart view - using vertical tree layout */}
        {viewType === 'pedigree' && treeData && (treeData.serNo || treeData.attributes?.serNo) && (
          <div className="heritage-card mb-8 p-4 border rounded bg-white">
            <h3 className="text-xl mb-2">Pedigree Chart</h3>
            <p className="text-sm text-gray-500 mb-4">Traditional pedigree chart showing ancestry. Click on any name to view their details.</p>
            <div id="pedigree-tree-container">
              <VerticalFamilyTree data={treeData} />
            </div>
          </div>
        )}

        {/* Timeline view - chronological family events */}
        {viewType === 'timeline' && treeData && (treeData.serNo || treeData.attributes?.serNo) && (
          <div className="heritage-card mb-8 p-4 border rounded bg-white">
            <h3 className="text-xl mb-2">Family Timeline</h3>
            <p className="text-sm text-gray-500 mb-4">Chronological view of family members and events</p>
            <div id="timeline-container" className="space-y-4">
              <TimelineView data={treeData} />
            </div>
          </div>
        )}

        {/* Error message for incompatible view types */}
        {(viewType === 'modern' || viewType === 'card' || viewType === 'horizontal' || viewType === 'vertical' || viewType === 'text' || viewType === 'pedigree' || viewType === 'timeline') &&
         (!treeData || (!treeData.serNo && !treeData.attributes?.serNo)) && (
          <div className="heritage-card mb-8 p-4 border rounded bg-yellow-50 border-yellow-200">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">View Not Available</h3>
            <p className="text-yellow-700 mb-4">
              This view type requires individual tree data. Please try the "All Members" view instead, or select a specific family member first.
            </p>
            <button
              onClick={() => setViewType('comprehensive')}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
            >
              Switch to All Members View
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyTree;
