import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ModernFamilyTree.css';

const ModernFamilyTree = ({ data }) => {
  if (!data) return null;
  
  return (
    <div className="modern-tree-container">
      <div className="modern-tree">
        <ModernTreeNode node={data} />
      </div>
    </div>
  );
};

const ModernTreeNode = ({ node }) => {
  const [expanded, setExpanded] = useState(true);
  
  const toggleExpand = () => {
    if (node.children && node.children.length > 0) {
      setExpanded(!expanded);
    }
  };
  
  const hasChildren = node.children && node.children.length > 0;
  const normalizedGender = (node.attributes.gender || '').toString().trim().toLowerCase();
  const genderClass = ['male', 'm'].includes(normalizedGender)
    ? 'male'
    : ['female', 'f'].includes(normalizedGender)
      ? 'female'
      : 'unknown';
  const nodeClasses = `modern-tree-node ${genderClass} ${hasChildren ? 'has-children' : ''}`;
  const serialNumber = Number(node.attributes.serNo) || 0;
  const fallbackIndex = (serialNumber % 8) + 1;
  const profilePrefix = genderClass === 'female' ? 'female' : 'male';
  const profileFallback = `/images/profiles/${profilePrefix}${fallbackIndex}.jpg`;
  
  return (
    <div className="modern-tree-item">
      <div className={nodeClasses}>
        <div className="node-content" onClick={toggleExpand}>
          <div className="node-header">
            <span className="node-id">#{node.attributes.serNo}</span>
            {hasChildren && (
              <button className="expand-button">
                {expanded ? '−' : '+'}
              </button>
            )}
          </div>
          
          <div className="node-photo">
            <img 
              src={node.attributes.profilePicture || profileFallback}
              alt={node.name}
              className="profile-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = profileFallback;
              }}
            />
          </div>
          
          <div className="node-couple">
            <Link to={`/family/member/${node.attributes.serNo}`} className="node-name">
              {node.name}
            </Link>
            {node.spouse && (
              <>
                <span className="couple-sep">&nbsp;&amp;&nbsp;</span>
                <Link to={`/family/member/${node.spouse.serNo}`} className="node-name spouse-name">
                  {node.spouse.fullName}
                </Link>
              </>
            )}
          </div>

          {node.attributes.vansh && (
            <div className="node-vansh">{node.attributes.vansh}</div>
          )}
        </div>
      </div>
      
      {hasChildren && expanded && (
        <div className="modern-tree-children">
          {node.children.map((child, index) => (
            <ModernTreeNode key={index} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ModernFamilyTree;