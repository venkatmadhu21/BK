import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './GraphicalFamilyTree.css';

const GraphicalFamilyTree = ({ data }) => {
  if (!data) return null;
  
  return (
    <div className="graphical-tree-container">
      <div className="tree">
        <ul>
          <TreeNode node={data} />
        </ul>
      </div>
    </div>
  );
};

const TreeNode = ({ node }) => {
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
  const serialNumber = Number(node.attributes.serNo) || 0;
  const fallbackIndex = (serialNumber % 8) + 1;
  const profilePrefix = genderClass === 'female' ? 'female' : 'male';
  const profileFallback = `/images/profiles/${profilePrefix}${fallbackIndex}.jpg`;
  const imageSrc = node.attributes.profilePicture || profileFallback;
  
  return (
    <li>
      <div 
        className={`tree-node ${genderClass}`}
        onClick={toggleExpand}
      >
        <div className="node-content">
          <div className="node-photo">
            <img 
              src={imageSrc}
              alt={node.name}
              className="profile-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `/images/profiles/${profilePrefix}1.jpg`;
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
          <div className="node-details">
            <span className="node-id">#{node.attributes.serNo}</span>
            {node.attributes.vansh && <span className="node-vansh">{node.attributes.vansh}</span>}
          </div>
          {hasChildren && (
            <div className="expand-icon">{expanded ? '−' : '+'}</div>
          )}
        </div>
      </div>
      
      {hasChildren && expanded && (
        <ul>
          {node.children.map((child, index) => (
            <TreeNode key={index} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default GraphicalFamilyTree;