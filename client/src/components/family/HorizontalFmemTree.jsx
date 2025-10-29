import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertCircle, GitBranch, Home, Loader2, Users, Heart } from 'lucide-react';
import api from '../../utils/api';
import { getProfileImageUrl } from '../../utils/profileImages';

// Horizontal tree node component
const HorizontalTreeNode = ({ node, level = 0 }) => {
  if (!node) {
    return null;
  }

  const {
    serNo,
    firstName,
    middleName,
    lastName,
    name,
    fullName,
    spouse,
    spouseSerNo,
    gender,
    vansh,
    maritalInfo,
    children = []
  } = node;

  // Build display name from available fields
  const displayName = name || fullName || 
    [firstName, middleName, lastName].filter(Boolean).join(' ') || 
    `Member #${serNo || 'Unknown'}`;

  const hasChildren = Array.isArray(children) && children.length > 0;

  return (
    <div className="flex items-start">
      {/* Current Member and Spouse */}
      <div className="flex flex-col items-center min-w-0">
        {/* Member Card */}
        <div className="bg-white border-2 border-blue-300 rounded-lg shadow-md p-2 m-0.5 min-w-[140px] max-w-[180px]">
          <div className="text-center">
            {/* Profile Image */}
            <div className="mb-1 flex justify-center">
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: getProfileImageUrl(node.profileImage, node.gender)
                    ? `url(${getProfileImageUrl(node.profileImage, node.gender)})`
                    : `linear-gradient(135deg, ${gender?.toLowerCase() === 'male' ? '#91d5ff' : '#ffadd2'} 0%, ${gender?.toLowerCase() === 'male' ? '#91d5ffdd' : '#ffadd2dd'} 100%)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '3px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: '#ffffff',
                  fontWeight: 'bold',
                }}
              >
                {!getProfileImageUrl(node.profileImage, node.gender) && displayName.charAt(0).toUpperCase()}
              </div>
            </div>

            <h3 className="text-xs font-bold text-gray-800 mb-1 leading-tight">
              {displayName}
            </h3>
            
            <div className="flex flex-wrap justify-center gap-0.5 mb-1">
              <span className="inline-flex items-center px-1 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                #{serNo}
              </span>
              {gender && (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                  gender.toLowerCase() === 'male' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-pink-100 text-pink-700'
                }`}>
                  {gender}
                </span>
              )}
              {vansh && (
                <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                  {vansh}
                </span>
              )}
            </div>

            {maritalInfo?.married && (
              <div className="text-xs text-green-600 mb-2">
                <Heart size={12} className="inline mr-1" />
                Married
              </div>
            )}

            <Link
              to={`/family/member/${serNo}`}
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
            >
              <GitBranch size={12} />
              Profile
            </Link>
          </div>
        </div>

        {/* Spouse Card (if exists) */}
        {(spouse || spouseSerNo) && (
          <div className="bg-white border-2 border-pink-300 rounded-lg shadow-md p-1.5 m-0.5 min-w-[120px] max-w-[160px]">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Heart size={14} className="text-pink-500" />
                <span className="text-xs font-medium text-gray-600">Spouse</span>
              </div>
              
              {spouse ? (
                <>
                  {/* Spouse Profile Image */}
                  <div className="mb-1 flex justify-center">
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: getProfileImageUrl(spouse.profileImage, spouse.gender)
                          ? `url(${getProfileImageUrl(spouse.profileImage, spouse.gender)})`
                          : `linear-gradient(135deg, ${spouse.gender?.toLowerCase() === 'male' ? '#91d5ff' : '#ffadd2'} 0%, ${spouse.gender?.toLowerCase() === 'male' ? '#91d5ffdd' : '#ffadd2dd'} 100%)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: '2px solid white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        color: '#ffffff',
                        fontWeight: 'bold',
                      }}
                    >
                      {!getProfileImageUrl(spouse.profileImage, spouse.gender) && (spouse.fullName || spouse.name || '').charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <h4 className="text-xs font-semibold text-gray-800 mb-1">
                    {spouse.fullName || spouse.name || `#${spouse.serNo}`}
                  </h4>
                  <Link
                    to={`/family/member/${spouse.serNo}`}
                    className="inline-flex items-center gap-1 text-xs text-pink-600 hover:text-pink-800 hover:underline"
                  >
                    <GitBranch size={12} />
                    Profile
                  </Link>
                </>
              ) : (
                <Link
                  to={`/family/member/${spouseSerNo}`}
                  className="text-sm text-pink-600 hover:text-pink-800 hover:underline"
                >
                  #{spouseSerNo}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Connection Line and Children */}
      {hasChildren && (
        <div className="flex items-center">
          {/* Horizontal line to children */}
          <div className="w-3 h-0.5 bg-gray-400 mx-1"></div>
          
          {/* Children container */}
          <div className="flex flex-col items-start">
            {children.map((child, index) => (
              <div key={child.serNo || child._id || index} className="flex items-center">
                {/* Vertical line for multiple children */}
                {children.length > 1 && (
                  <div className="flex items-center">
                    <div className={`w-4 h-0.5 bg-gray-400 ${index === 0 ? 'mt-2' : index === children.length - 1 ? 'mb-2' : ''}`}></div>
                    <div className={`w-0.5 bg-gray-400 ${
                      index === 0 ? 'h-1/2 self-end' : 
                      index === children.length - 1 ? 'h-1/2 self-start' : 
                      'h-full'
                    }`}></div>
                    <div className="w-4 h-0.5 bg-gray-400"></div>
                  </div>
                )}
                
                {/* Child node */}
                <HorizontalTreeNode node={child} level={level + 1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const HorizontalFmemTree = ({ defaultSerNo = 1 }) => {
  const { serNo: routeSerNo } = useParams();
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resolvedSerNo = useMemo(() => {
    const parsed = parseInt(routeSerNo, 10);
    return Number.isNaN(parsed) ? defaultSerNo : parsed;
  }, [routeSerNo, defaultSerNo]);

  useEffect(() => {
    let isMounted = true;

    const fetchTree = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/api/family/tree-fmem/${resolvedSerNo}`);
        if (!isMounted) return;
        setTreeData(response.data);
      } catch (err) {
        if (!isMounted) return;
        const message = err?.response?.data?.message || err?.message || 'Failed to load tree data';
        setError(message);
        setTreeData(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTree();

    return () => {
      isMounted = false;
    };
  }, [resolvedSerNo]);

  if (loading) {
    return (
      <div className="max-w-full mx-auto p-6">
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Loading horizontal FamilyMember tree for #{resolvedSerNo}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-full mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <AlertCircle size={20} />
            Unable to fetch Fmem tree
          </div>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!treeData) {
    return (
      <div className="max-w-full mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl p-6">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Users size={20} />
            No FamilyMember data available
          </div>
          <p className="mt-2 text-sm">
            The API responded successfully, but no tree data was returned for serial number #{resolvedSerNo}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Horizontal Family Tree</h1>
          <p className="text-sm text-gray-600 mt-1">
            FamilyMember collection data for #{resolvedSerNo} and descendants
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/family"
            className="inline-flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Home size={16} />
            Family List
          </Link>
          <Link
            to={`/family/tree/${resolvedSerNo}`}
            className="inline-flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <GitBranch size={16} />
            Legacy Tree
          </Link>
          <Link
            to={`/family/tree-fmem/${resolvedSerNo}`}
            className="inline-flex items-center gap-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Users size={16} />
            Vertical Tree
          </Link>
        </div>
      </div>

      {/* Horizontal Tree Container */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 rounded-xl p-6 overflow-x-auto">
        <div className="min-w-max">
          <HorizontalTreeNode node={treeData} level={0} />
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-300 border-2 border-blue-300 rounded"></div>
            <span>Family Member</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-pink-300 border-2 border-pink-300 rounded"></div>
            <span>Spouse</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-gray-400"></div>
            <span>Parent-Child Relationship</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart size={14} className="text-pink-500" />
            <span>Marriage</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalFmemTree;