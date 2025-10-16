import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCircle,
  Calendar,
  MapPin,
  Heart,
  Baby,
  Info,
  Eye,
  GitBranch,
  Clock
} from 'lucide-react';
import { getProfileImageUrl } from '../../utils/profileImages';

const EnhancedFamilyMemberCard = ({ member, showAllFields = false, compact = false }) => {
  const memberName = (member?.fullName || `${member?.firstName || ''} ${member?.middleName || ''} ${member?.lastName || ''}`)
    .trim();

  const [imageErrorFull, setImageErrorFull] = useState(false);
  const [imageErrorCompact, setImageErrorCompact] = useState(false);

  const getInitials = () => {
    const parts = memberName.split(' ').filter(Boolean);
    const first = parts[0] ? parts[0][0] : '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase() || (String(member.serNo || '')[0] || 'U');
  };

  const getChildrenCount = () => {
    if (Array.isArray(member?.childrenSerNos)) return member.childrenSerNos.length;
    if (typeof member?.sonDaughterCount === 'number') return member.sonDaughterCount;
    if (Array.isArray(member?.children)) return member.children.length;
    return 0;
  };


  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (!member) return null;

  if (compact) {
    return (
      <div className={`transition-all duration-300 bg-gradient-to-r from-gray-200/60 via-gray-100/60 to-gray-200/60 p-[2px] rounded-xl hover:shadow-lg`}>
        <div className="bg-white rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative mr-3">
                <div className={`w-10 h-10 rounded-full overflow-hidden ring-2 ${member.gender === 'Male' ? 'ring-blue-200' : 'ring-pink-200'} shadow-sm relative`}> 
                  <img
                    src={getProfileImageUrl(member.profileImage, member.gender)}
                    alt={memberName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getProfileImageUrl(null, member.gender);
                      setImageErrorCompact(true);
                    }}
                  />
                  {(imageErrorCompact || !member.profileImage) && (
                    <div className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white ${member.gender === 'Male' ? 'bg-blue-400' : 'bg-pink-400'}`}>
                      {getInitials()}
                    </div>
                  )}
                </div>
                <span className={`absolute -bottom-1 -right-1 text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${member.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                  {member.gender?.[0] || 'U'}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-800">{memberName}</h4>
                <div className="flex flex-wrap items-center gap-1 text-[11px] text-gray-600">
                  <span className="inline-flex items-center bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded-full border border-amber-200">#{member.serNo}</span>
                  <span className="inline-flex items-center bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded-full border border-blue-200">Level {member.level}</span>
                  {member.vansh && (
                    <span className="inline-flex items-center bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded-full border border-emerald-200">{member.vansh}</span>
                  )}
                </div>
                {(member.vansh || member.dob) && (
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
                    {member.vansh && (
                      <span className="inline-flex items-center">
                        <MapPin size={10} className="mr-1" /> {member.vansh}
                      </span>
                    )}
                    {member.dob && (
                      <span className="inline-flex items-center">
                        <Calendar size={10} className="mr-1" /> {formatDate(member.dob)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex space-x-1">
              <Link 
                to={`/family/member/${member.serNo}`}
                className="p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 rounded transition-colors"
                title="View Details"
              >
                <Eye size={14} />
              </Link>
              <Link 
                to={`/family/tree/${member.serNo}`}
                className="p-1.5 text-emerald-600 hover:text-white hover:bg-emerald-600 rounded transition-colors"
                title="View Tree"
              >
                <GitBranch size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`transition-all duration-300 bg-gradient-to-r from-gray-200/60 via-gray-100/60 to-gray-200/60 p-[2px] rounded-2xl hover:shadow-xl`}>
      <div className="bg-white rounded-xl p-6">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="relative mr-4">
            <div className={`w-16 h-16 rounded-full overflow-hidden ring-2 ${member.gender === 'Male' ? 'ring-blue-200' : 'ring-pink-200'} shadow relative`}> 
              <img
                src={getProfileImageUrl(member.profileImage, member.gender)}
                alt={memberName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // On error, try another random default image
                  e.target.onerror = null;
                  e.target.src = getProfileImageUrl(null, member.gender);
                  setImageErrorFull(true);
                }}
              />
              {(imageErrorFull || !member.profileImage) && (
                <div className={`absolute inset-0 flex items-center justify-center text-xs font-bold text-white ${member.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                  {getInitials()}
                </div>
              )}
            </div>
            <span className={`absolute -bottom-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${member.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
              {member.gender?.[0] || 'U'}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-gray-800 mb-1 tracking-tight">{memberName}</h3>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="inline-flex items-center bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full font-semibold border border-amber-200">#{member.serNo}</span>
              <span className="inline-flex items-center bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">Level {member.level}</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full border ${
                member.gender === 'Male' 
                  ? 'bg-blue-50 text-blue-800 border-blue-200' 
                  : 'bg-pink-50 text-pink-800 border-pink-200'
              }`}>
                {member.gender}
              </span>
            </div>
            {(member.vansh || member.dob) && (
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
                {member.vansh && (
                  <span className="inline-flex items-center">
                    <MapPin size={12} className="mr-1" /> {member.vansh}
                  </span>
                )}
                {member.dob && (
                  <span className="inline-flex items-center">
                    <Calendar size={12} className="mr-1" /> {formatDate(member.dob)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link 
            to={`/family/member/${member.serNo}`}
            className="flex items-center px-3 py-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-colors text-sm border border-blue-200"
          >
            <Eye size={16} className="mr-1" />
            Details
          </Link>
          <Link 
            to={`/family/tree/${member.serNo}`}
            className="flex items-center px-3 py-2 text-emerald-600 hover:text-white hover:bg-emerald-600 rounded-lg transition-colors text-sm border border-emerald-200"
          >
            <GitBranch size={16} className="mr-1" />
            Tree
          </Link>
        </div>
      </div>

      {/* Basic Information Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {member.vansh && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 rounded-lg border border-emerald-200">
            <p className="text-xs text-gray-500 mb-1 flex items-center">
              <MapPin size={12} className="mr-1" />
              Vansh
            </p>
            <p className="font-semibold text-gray-800">{member.vansh}</p>
          </div>
        )}
        
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-3 rounded-lg border border-amber-200">
          <p className="text-xs text-gray-500 mb-1 flex items-center">
            <Baby size={12} className="mr-1" />
            Children
          </p>
          <p className="font-semibold text-gray-800">{getChildrenCount()}</p>
        </div>

        {member.dob && (
          <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-3 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-500 mb-1 flex items-center">
              <Calendar size={12} className="mr-1" />
              Birth
            </p>
            <p className="font-semibold text-gray-800 text-sm">{formatDate(member.dob)}</p>
          </div>
        )}

        {member.dod && (
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-1 flex items-center">
              <Clock size={12} className="mr-1" />
              Death
            </p>
            <p className="font-semibold text-gray-800 text-sm">{formatDate(member.dod)}</p>
          </div>
        )}
      </div>

      {/* Family Relationships */}
      <div className="space-y-3">
        {/* Spouse */}
        {member.spouseSerNo && (
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-3 rounded-lg border border-pink-200">
            <p className="text-sm text-pink-700 mb-2 flex items-center font-semibold">
              <Heart size={14} className="mr-2" />
              Spouse
            </p>
            <Link 
              to={`/family/member/${member.spouseSerNo}`}
              className="text-pink-600 hover:text-pink-800 font-medium text-sm hover:underline"
            >
              View Spouse (#{member.spouseSerNo})
            </Link>
          </div>
        )}

        {/* Parents */}
        {(member.fatherSerNo || member.motherSerNo || member.father || member.mother) && (
          <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 mb-2 flex items-center font-semibold">
              <UserCircle size={14} className="mr-2" />
              Parents
            </p>
            <div className="flex flex-wrap gap-2">
              {(member.fatherSerNo || member.father) && (
                <Link 
                  to={`/family/member/${(member.father && member.father.serNo) || member.fatherSerNo}`}
                  className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
                >
                  {member.father?.fullName || member.fatherName || `Father (#${(member.father && member.father.serNo) || member.fatherSerNo})`}
                </Link>
              )}
              {(member.motherSerNo || member.mother) && (
                <Link 
                  to={`/family/member/${(member.mother && member.mother.serNo) || member.motherSerNo}`}
                  className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
                >
                  {member.mother?.fullName || member.motherName || `Mother (#${(member.mother && member.mother.serNo) || member.motherSerNo})`}
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Children */}
        {((Array.isArray(member.children) && member.children.length > 0) || (Array.isArray(member.childrenSerNos) && member.childrenSerNos.length > 0)) && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
            <p className="text-sm text-green-700 mb-2 flex items-center font-semibold">
              <Users size={14} className="mr-2" />
              Children ({Array.isArray(member.children) ? member.children.length : member.childrenSerNos.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(member.children) ? member.children.slice(0, 5) : member.childrenSerNos.slice(0, 5)).map((child) => {
                const childSer = typeof child === 'object' ? child.serNo : child;
                const childName = typeof child === 'object' ? (child.fullName || `${child.firstName || ''} ${child.lastName || ''}`.trim()) : null;
                return (
                  <Link 
                    key={childSer}
                    to={`/family/member/${childSer}`}
                    className="text-green-600 hover:text-green-800 text-sm hover:underline"
                  >
                    {childName ? `${childName} (#${childSer})` : `#${childSer}`}
                  </Link>
                );
              })}
              {(Array.isArray(member.children) ? member.children.length : member.childrenSerNos.length) > 5 && (
                <span className="text-green-600 text-sm">
                  +{(Array.isArray(member.children) ? member.children.length : member.childrenSerNos.length) - 5} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Biography */}
      {showAllFields && member.Bio && (
        <div className="mt-4 bg-gradient-to-r from-yellow-50 to-amber-50 p-3 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-700 mb-2 flex items-center font-semibold">
            <Info size={14} className="mr-2" />
            Biography
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">{member.Bio}</p>
        </div>
      )}

      {/* Debug Information (only in development) */}
      {showAllFields && process.env.NODE_ENV === 'development' && (
        <div className="mt-4 bg-gray-100 p-3 rounded-lg border">
          <p className="text-xs text-gray-600 mb-2 font-medium">Debug Info:</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>ID: {member._id}</p>
            <p>Created: {member.createdAt ? formatDate(member.createdAt) : 'N/A'}</p>
            <p>Updated: {member.updatedAt ? formatDate(member.updatedAt) : 'N/A'}</p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default EnhancedFamilyMemberCard;
