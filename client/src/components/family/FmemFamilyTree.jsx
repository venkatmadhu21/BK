import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertCircle, GitBranch, Home, Loader2, Users } from 'lucide-react';
import api from '../../utils/api';

// Simple recursive renderer for Members collection-based trees
const TreeNode = ({ node }) => {
  if (!node) {
    return null;
  }

  const {
    serNo,
    firstName = '',
    middleName = '',
    lastName = '',
    gender = '',
    level,
    vansh = '',
    spouseSerNo,
    children = []
  } = node;

  // Build display name from fields
  const displayName = [firstName, middleName, lastName]
    .filter(Boolean)
    .join(' ')
    .trim() || `Member #${serNo || 'Unknown'}`;

  return (
    <li className="mb-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{displayName}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                #{serNo}
              </span>
              {gender && (
                <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                  {gender}
                </span>
              )}
              {vansh && (
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  {vansh}
                </span>
              )}
              {level !== undefined && level !== null && (
                <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                  Level {level}
                </span>
              )}
              {spouseSerNo && (
                <span className="inline-flex items-center px-2 py-1 bg-pink-100 text-pink-700 rounded-full">
                  Married
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/family/member/${serNo}`}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <GitBranch size={16} />
              View Profile
            </Link>
          </div>
        </div>

        {spouseSerNo && (
          <div className="mt-3 text-sm text-gray-600">
            <span className="font-medium text-gray-700">Spouse:</span>{' '}
            <Link
              to={`/family/member/${spouseSerNo}`}
              className="text-blue-600 hover:text-blue-800"
            >
              #{spouseSerNo}
            </Link>
          </div>
        )}

        {Array.isArray(children) && children.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Children ({children.length}):
            </p>
            <ul className="ml-4 border-l border-gray-200 pl-4">
              {children.map(child => (
                <TreeNode key={child.serNo || child._id} node={child} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </li>
  );
};

const FmemFamilyTree = ({ defaultSerNo = 1 }) => {
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
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Loading FamilyMember tree for #{resolvedSerNo}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
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
      <div className="max-w-4xl mx-auto p-6">
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
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FamilyMember Tree Preview</h1>
          <p className="text-sm text-gray-600 mt-1">
            Rendering data directly from the `/api/family/tree-fmem/{resolvedSerNo}` endpoint.
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
            to={`/family/tree-horizontal/${resolvedSerNo}`}
            className="inline-flex items-center gap-1 px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Users size={16} />
            Horizontal Tree
          </Link>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <ul className="space-y-4">
          <TreeNode node={treeData} />
        </ul>
      </div>
    </div>
  );
};

export default FmemFamilyTree;