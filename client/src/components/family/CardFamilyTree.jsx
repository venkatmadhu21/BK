import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, User } from 'lucide-react';
import './CardFamilyTree.css';
const CardFamilyTree = ({ data }) => {
  if (!data) return null;
  return (
    <div className="card-tree-container">
      <CardTreeNode node={data} level={0} />
    </div>
  );
};

const CardTreeNode = ({ node, level }) => {
  const [expanded, setExpanded] = useState(true);
  
  const toggleExpand = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (node.children && node.children.length > 0) {
      setExpanded(!expanded);
    }
  };
  
  const hasChildren = node.children && node.children.length > 0;
  const isMale = node.attributes.gender === 'Male';
  
  return (
    <div className="card-tree-node-container" style={{ paddingLeft: `${level * 40}px` }}>
      <div className={`card-tree-node ${isMale ? 'male' : 'female'}`}>
        <div className="card-node-avatar">
          <User size={24} color={isMale ? '#1890ff' : '#eb2f96'} />
        </div>
        
        <div className="card-node-content">
          <div className="card-node-header">
            <Link to={`/family/member/${node.attributes.serNo}`} className="card-node-name">
              {node.name}
            </Link>
            <span className="card-node-id">#{node.attributes.serNo}</span>
          </div>
          
          {node.attributes.spouse && (
            <div className="card-node-detail">
              <span className="detail-label">Spouse:</span> {node.attributes.spouse}
            </div>
          )}
          
          {node.attributes.vansh && (
            <div className="card-node-detail">
              <span className="detail-label">Vansh:</span> {node.attributes.vansh}
            </div>
          )}
        </div>
        
        {hasChildren && (
          <button 
            className="card-expand-button" 
            onClick={toggleExpand}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
      </div>
      
      {hasChildren && expanded && (
        <div className="card-tree-children">
          {node.children.map((child, index) => (
            <CardTreeNode key={index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CardFamilyTree;