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
  const nodeClasses = `modern-tree-node ${node.attributes.gender === 'Male' ? 'male' : 'female'} ${hasChildren ? 'has-children' : ''}`;
  
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
              src={node.attributes.profilePicture || (node.attributes.gender === 'Male' ? `/images/profiles/male${(node.attributes.serNo % 8) + 1}.jpg` : `/images/profiles/female${(node.attributes.serNo % 8) + 1}.jpg`)}
              alt={node.name}
              className="profile-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = node.attributes.gender === 'Male' ? '/images/profiles/male1.jpg' : '/images/profiles/female1.jpg';
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