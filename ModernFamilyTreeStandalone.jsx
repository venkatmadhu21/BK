import React, { useState } from 'react';
import './ModernFamilyTreeStandalone.css';

/**
 * Modern Family Tree Component - Standalone Version
 * 
 * Features:
 * - Beautiful modern design with gradient backgrounds
 * - Gender-based color coding (blue for male, pink for female)
 * - Expandable/collapsible nodes
 * - Connecting lines between parent and children
 * - Profile pictures support
 * - Responsive design
 * - Hover effects and animations
 * 
 * Data Structure Expected:
 * {
 *   name: "Person Name",
 *   attributes: {
 *     serNo: 1,
 *     gender: "Male" | "Female",
 *     profilePicture: "url/to/image.jpg", // optional
 *     spouse: "Spouse Name", // optional
 *     vansh: "Family Line", // optional
 *   },
 *   children: [
 *     // Array of child objects with same structure
 *   ]
 * }
 */

const ModernFamilyTreeStandalone = ({ data, onNodeClick }) => {
  if (!data) {
    return (
      <div className="modern-tree-container">
        <div className="no-data-message">
          <p>No family tree data available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="modern-tree-container">
      <div className="modern-tree">
        <ModernTreeNode node={data} onNodeClick={onNodeClick} />
      </div>
    </div>
  );
};

const ModernTreeNode = ({ node, onNodeClick }) => {
  const [expanded, setExpanded] = useState(true);
  
  const toggleExpand = (e) => {
    e.stopPropagation();
    if (node.children && node.children.length > 0) {
      setExpanded(!expanded);
    }
  };
  
  const handleNodeClick = (e) => {
    e.stopPropagation();
    if (onNodeClick && typeof onNodeClick === 'function') {
      onNodeClick(node);
    }
  };
  
  const hasChildren = node.children && node.children.length > 0;
  const gender = node.attributes?.gender || 'Unknown';
  const nodeClasses = `modern-tree-node ${gender.toLowerCase()} ${hasChildren ? 'has-children' : ''}`;
  
  // Generate default profile picture based on gender and ID
  const getDefaultProfilePicture = () => {
    const serNo = node.attributes?.serNo || 1;
    const imageNumber = (serNo % 8) + 1;
    return gender === 'Male' 
      ? `/images/profiles/male${imageNumber}.jpg`
      : `/images/profiles/female${imageNumber}.jpg`;
  };
  
  const profilePicture = node.attributes?.profilePicture || getDefaultProfilePicture();
  
  return (
    <div className="modern-tree-item">
      <div className={nodeClasses}>
        <div className="node-content" onClick={handleNodeClick}>
          <div className="node-header">
            <span className="node-id">#{node.attributes?.serNo || '?'}</span>
            {hasChildren && (
              <button 
                className="expand-button"
                onClick={toggleExpand}
                aria-label={expanded ? 'Collapse' : 'Expand'}
              >
                {expanded ? '−' : '+'}
              </button>
            )}
          </div>
          
          <div className="node-photo">
            <img 
              src={profilePicture}
              alt={node.name || 'Family Member'}
              className="profile-image"
              onError={(e) => {
                e.target.onerror = null;
                // Fallback to a simple colored circle if image fails
                e.target.style.display = 'none';
                e.target.parentElement.classList.add('no-image');
                e.target.parentElement.setAttribute('data-gender', gender.toLowerCase());
              }}
            />
            <div className="profile-fallback">
              {(node.name || 'Unknown').charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div className="node-name">
            {node.name || 'Unknown'}
          </div>
          
          {node.attributes?.spouse && (
            <div className="node-spouse">
              <span className="spouse-label">Spouse:</span> {node.attributes.spouse}
            </div>
          )}
          
          {node.attributes?.vansh && (
            <div className="node-vansh">{node.attributes.vansh}</div>
          )}
          
          {node.attributes?.dateOfBirth && (
            <div className="node-birth-date">
              Born: {new Date(node.attributes.dateOfBirth).getFullYear()}
            </div>
          )}
          
          {node.attributes?.occupation && (
            <div className="node-occupation">{node.attributes.occupation}</div>
          )}
        </div>
      </div>
      
      {hasChildren && expanded && (
        <div className="modern-tree-children">
          {node.children.map((child, index) => (
            <ModernTreeNode 
              key={child.attributes?.serNo || index} 
              node={child} 
              onNodeClick={onNodeClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Sample data for testing
export const sampleFamilyData = {
  name: "John Doe",
  attributes: {
    serNo: 1,
    gender: "Male",
    spouse: "Jane Doe",
    vansh: "Doe Family",
    dateOfBirth: "1950-01-01",
    occupation: "Engineer"
  },
  children: [
    {
      name: "Alice Doe",
      attributes: {
        serNo: 2,
        gender: "Female",
        spouse: "Bob Smith",
        dateOfBirth: "1975-05-15"
      },
      children: [
        {
          name: "Charlie Smith",
          attributes: {
            serNo: 4,
            gender: "Male",
            dateOfBirth: "2000-03-10"
          },
          children: []
        },
        {
          name: "Diana Smith",
          attributes: {
            serNo: 5,
            gender: "Female",
            dateOfBirth: "2002-07-20"
          },
          children: []
        }
      ]
    },
    {
      name: "Robert Doe",
      attributes: {
        serNo: 3,
        gender: "Male",
        spouse: "Emily Johnson",
        dateOfBirth: "1978-11-30"
      },
      children: [
        {
          name: "Frank Doe",
          attributes: {
            serNo: 6,
            gender: "Male",
            dateOfBirth: "2005-09-12"
          },
          children: []
        }
      ]
    }
  ]
};

export default ModernFamilyTreeStandalone;