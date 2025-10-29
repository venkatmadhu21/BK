import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Users, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import './HierarchyFormFamilyTree.css';

const HierarchyFormFamilyTree = ({ memberData, compact = false }) => {
  const [expanded, setExpanded] = useState(true);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Extract display name from personal details
  const getDisplayName = (details) => {
    if (!details) return 'Unknown';
    const parts = [
      details.firstName,
      details.middleName,
      details.lastName
    ].filter(Boolean);
    return parts.join(' ');
  };

  // Get parent display names
  const getParentName = (parentInfo) => {
    if (!parentInfo) return null;
    const parts = [
      parentInfo.firstName,
      parentInfo.middleName,
      parentInfo.lastName
    ].filter(Boolean);
    return parts.join(' ') || null;
  };

  const fatherName = memberData?.parentsInformation 
    ? getParentName({
        firstName: memberData.parentsInformation.fatherFirstName,
        middleName: memberData.parentsInformation.fatherMiddleName,
        lastName: memberData.parentsInformation.fatherLastName
      })
    : null;

  const motherName = memberData?.parentsInformation
    ? getParentName({
        firstName: memberData.parentsInformation.motherFirstName,
        middleName: memberData.parentsInformation.motherMiddleName,
        lastName: memberData.parentsInformation.motherLastName
      })
    : null;

  // Load children members (those whose parents match this member)
  const loadChildren = async () => {
    if (loading || children.length > 0) return;
    
    try {
      setLoading(true);
      // Fetch all hierarchy form entries and filter for children
      const res = await api.get('/api/admin/heirarchy-form');
      const allMembers = Array.isArray(res.data) ? res.data : [];
      
      // Filter members whose father or mother matches this person
      const childMembers = allMembers.filter(member => {
        if (!member.parentsInformation) return false;
        const personFirst = memberData.personalDetails.firstName;
        const personLast = memberData.personalDetails.lastName;
        const fatherMatch = member.parentsInformation.fatherFirstName === personFirst &&
                           member.parentsInformation.fatherLastName === personLast;
        const motherMatch = member.parentsInformation.motherFirstName === personFirst &&
                           member.parentsInformation.motherLastName === personLast;
        return fatherMatch || motherMatch;
      });
      
      setChildren(childMembers);
    } catch (err) {
      console.error('Error loading children:', err);
      setError('Failed to load children');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!expanded) {
      loadChildren();
    }
    setExpanded(!expanded);
  };

  if (!memberData || !memberData.personalDetails) {
    return (
      <div className="hierarchy-tree-error">
        <AlertCircle size={20} />
        <span>No member data available</span>
      </div>
    );
  }

  const personName = getDisplayName(memberData.personalDetails);
  const gender = memberData.personalDetails.gender;
  const hasParents = fatherName || motherName;
  const hasChildren = children.length > 0 || (expanded && loading);

  return (
    <div className={`hierarchy-family-tree ${compact ? 'compact' : ''}`}>
      <div className="tree-node-container">
        {/* Parents Section */}
        {hasParents && (
          <div className="parents-section">
            <div className="parents-row">
              {fatherName && (
                <div className="parent-node male">
                  <div className="parent-info">
                    <div className="parent-name">{fatherName}</div>
                    <div className="parent-role">Father</div>
                  </div>
                </div>
              )}
              {motherName && (
                <div className="parent-node female">
                  <div className="parent-info">
                    <div className="parent-name">{motherName}</div>
                    <div className="parent-role">Mother</div>
                  </div>
                </div>
              )}
            </div>
            <div className="connector-vertical"></div>
          </div>
        )}

        {/* Main Person Node */}
        <div className={`person-node ${gender}`}>
          <div className="person-header">
            <div className={`gender-indicator ${gender}`}></div>
            <div className="person-details">
              <h3 className="person-name">{personName}</h3>
              {memberData.personalDetails.dateOfBirth && (
                <p className="person-dob">
                  Born: {new Date(memberData.personalDetails.dateOfBirth).toLocaleDateString('en-IN')}
                </p>
              )}
              {memberData.personalDetails.isAlive === 'no' && memberData.personalDetails.dateOfDeath && (
                <p className="person-death">
                  Passed: {new Date(memberData.personalDetails.dateOfDeath).toLocaleDateString('en-IN')}
                </p>
              )}
            </div>
          </div>
          {(fatherName || motherName || children.length > 0) && (
            <button
              className="expand-btn"
              onClick={handleToggle}
              title={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          )}
        </div>

        {/* Children Section */}
        {expanded && (children.length > 0 || loading) && (
          <div className="children-section">
            <div className="connector-vertical"></div>
            <div className="children-row">
              {loading && !children.length && (
                <div className="loading-children">
                  <div className="spinner"></div>
                  <span>Loading children...</span>
                </div>
              )}
              {children.map((child, idx) => (
                <div key={idx} className="child-node-wrapper">
                  <div className={`child-node ${child.personalDetails?.gender}`}>
                    <div className="child-name">
                      {getDisplayName(child.personalDetails)}
                    </div>
                    <div className="child-info">
                      {child.personalDetails?.dateOfBirth && (
                        <span className="child-dob">
                          {new Date(child.personalDetails.dateOfBirth).getFullYear()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HierarchyFormFamilyTree;