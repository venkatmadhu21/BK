import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import FamilyMemberCard from './FamilyMemberCard';
import GraphicalFamilyTree from './GraphicalFamilyTree';
import VerticalFamilyTree from './VerticalFamilyTree';
import ModernFamilyTree from './ModernFamilyTree';
import CardFamilyTree from './CardFamilyTree';
import FamilyTreePDFExport from './FamilyTreePDFExport';
import EnhancedFamilyTree from './EnhancedFamilyTree';
import ComprehensiveFamilyTree from './ComprehensiveFamilyTree';
import VisualFamilyTree from './VisualFamilyTree';
import InteractiveFamilyTree from './InteractiveFamilyTree';
import api from '../../utils/api';

const FamilyTree = () => {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState('interactive');
  const { serNo } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFamilyTree = async () => {
      try {
        setLoading(true);
        // Use the new API endpoint that uses members and relationships collections
        const res = await api.get(`/api/family/tree-new/${serNo || 1}`);
        
        // Log the raw data from the API
        console.log('Raw API data from new endpoint:', JSON.stringify(res.data, null, 2));
        
        // Transform the data for our tree view
        const transformedData = transformData(res.data);
        
        // Log the transformed data
        console.log('Transformed data:', JSON.stringify(transformedData, null, 2));
        
        // Set a minimum loading time for better UX
        setTimeout(() => {
          setTreeData(transformedData);
          setLoading(false);
        }, 300);
      } catch (err) {
        console.error('Error fetching family tree:', err);
        setTimeout(() => {
          setError('Failed to load family tree. Please try again later.');
          setLoading(false);
        }, 300);
      }
    };

    fetchFamilyTree();
  }, [serNo]);

  // Transform the data structure for our tree view
  const transformData = (member) => {
    if (!member) {
      console.error('Invalid member data:', member);
      return null;
    }
    
    // Handle both old and new data structures
    const memberName = member.fullName || member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'Unknown';
    console.log('Processing member:', memberName, member.serNo);
    
    const node = {
      name: memberName,
      attributes: {
        serNo: member.serNo || 0,
        gender: member.gender || 'Unknown',
        vansh: member.vansh || '',
        level: member.level || 1,
        sonDaughterCount: member.sonDaughterCount || 0
      },
      children: []
    };

    // Add spouse if exists
    if (member.spouse && member.spouse.name) {
      node.attributes.spouse = member.spouse.name;
      node.attributes.spouseSerNo = member.spouse.serNo;
    }
    
    // Add additional attributes if they exist
    if (member.dateOfBirth) {
      node.attributes.dateOfBirth = member.dateOfBirth;
    }
    if (member.occupation) {
      node.attributes.occupation = member.occupation;
    }
    if (member.biography) {
      node.attributes.biography = member.biography;
    }
    
    // Add children if they exist
    if (Array.isArray(member.children) && member.children.length > 0) {
      console.log(`Member ${memberName} (${member.serNo}) has ${member.children.length} children`);
      node.children = member.children
        .filter(child => child) // Filter out null/undefined children
        .map(child => transformData(child))
        .filter(child => child); // Filter out failed transformations
    } else if (Array.isArray(member.childrenSerNos) && member.childrenSerNos.length > 0) {
      // If we have childrenSerNos but no children array, log this for debugging
      console.log(`Member ${memberName} (${member.serNo}) has childrenSerNos but no children array:`, 
        member.childrenSerNos);
    }

    return node;
  };

  if (loading) return <div className="text-center py-10">Loading family tree...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!treeData) return <div className="text-center py-10">No family tree data available.</div>;
  
  return (
    <div className="family-tree-container">
      <div className="mb-4">
        <Link to="/family" className="text-blue-600 hover:text-blue-800">
          ← Back to Family List
        </Link>
      </div>
      
      <h2 className="text-2xl font-bold mb-4 text-center">Family Tree</h2>
      <p className="text-center mb-6 text-gray-600">
        Showing family tree for: <strong>{treeData.name}</strong> (#{treeData.attributes.serNo})
      </p>
      
      {/* View type selector */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm flex-wrap justify-center" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              viewType === 'interactive' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } rounded-l-lg`}
            onClick={() => setViewType('interactive')}
          >
            Interactive Tree with Relationships
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              viewType === 'visual' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setViewType('visual')}
          >
            Visual Tree with Relationships
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              viewType === 'comprehensive' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setViewType('comprehensive')}
          >
            All Members & Relationships
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              viewType === 'enhanced' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setViewType('enhanced')}
          >
            Enhanced Tree
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              viewType === 'modern' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setViewType('modern')}
          >
            Modern Tree
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              viewType === 'card' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setViewType('card')}
          >
            Card View
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              viewType === 'horizontal' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setViewType('horizontal')}
          >
            Horizontal Tree
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              viewType === 'vertical' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setViewType('vertical')}
          >
            Vertical Tree
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              viewType === 'text' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setViewType('text')}
          >
            Text View
          </button>
        </div>
      </div>
      
      {/* PDF Export Component */}
      <FamilyTreePDFExport 
        treeData={treeData} 
        viewType={viewType} 
        rootMemberName={treeData?.name}
      />
      
      {/* Interactive tree view - SVG tree with relationship lines */}
      {viewType === 'interactive' && (
        <InteractiveFamilyTree />
      )}
      
      {/* Visual tree view - Tree with relationship connections */}
      {viewType === 'visual' && (
        <VisualFamilyTree />
      )}
      
      {/* Comprehensive tree view - All members and relationships */}
      {viewType === 'comprehensive' && (
        <ComprehensiveFamilyTree />
      )}
      
      {/* Enhanced tree view */}
      {viewType === 'enhanced' && (
        <EnhancedFamilyTree />
      )}
      
      {/* Modern tree view */}
      {viewType === 'modern' && (
        <div className="mb-8 p-4 border rounded bg-white overflow-x-auto">
          <h3 className="text-xl mb-2">Modern Family Tree</h3>
          <p className="text-sm text-gray-500 mb-4">Click on any name to view their details. Click on a node to expand/collapse.</p>
          <div id="modern-tree-container" className="overflow-x-auto">
            <ModernFamilyTree data={treeData} />
          </div>
        </div>
      )}
      
      {/* Card tree view */}
      {viewType === 'card' && (
        <div className="mb-8 p-4 border rounded bg-white">
          <h3 className="text-xl mb-2">Card-based Family Tree</h3>
          <p className="text-sm text-gray-500 mb-4">Click on any name to view their details. Click on a node to expand/collapse.</p>
          <div id="card-tree-container">
            <CardFamilyTree data={treeData} />
          </div>
        </div>
      )}
      
      {/* Horizontal graphical tree view */}
      {viewType === 'horizontal' && (
        <div className="mb-8 p-4 border rounded bg-white overflow-x-auto">
          <h3 className="text-xl mb-2">Horizontal Family Tree</h3>
          <p className="text-sm text-gray-500 mb-4">Click on any name to view their details. Click on a node to expand/collapse.</p>
          <div id="horizontal-tree-container" className="overflow-x-auto">
            <GraphicalFamilyTree data={treeData} />
          </div>
        </div>
      )}
      
      {/* Vertical tree view */}
      {viewType === 'vertical' && (
        <div className="mb-8 p-4 border rounded bg-white">
          <h3 className="text-xl mb-2">Vertical Family Tree</h3>
          <p className="text-sm text-gray-500 mb-4">Click on any name to view their details. Click on a node to expand/collapse.</p>
          <div id="vertical-tree-container">
            <VerticalFamilyTree data={treeData} />
          </div>
        </div>
      )}
      
      {/* Simple text-based tree view */}
      {viewType === 'text' && (
        <div className="mb-8 p-4 border rounded bg-white">
          <h3 className="text-xl mb-2">Text-based Family Tree</h3>
          <p className="text-sm text-gray-500 mb-4">Click on any name to view their details</p>
          <div id="text-tree-container">
            <SimpleTreeView data={treeData} />
          </div>
        </div>
      )}
    </div>
  );
};

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

export default FamilyTree;