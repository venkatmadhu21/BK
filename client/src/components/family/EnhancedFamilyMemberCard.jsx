import React from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
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

const EnhancedFamilyMemberCard = ({ member, showAllFields = false, compact = false }) => {
  if (!member) return null;

  const memberName = member.fullName || `${member.firstName || ''} ${member.middleName || ''} ${member.lastName || ''}`.trim();
  
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

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow border-l-4 border-orange-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
              member.gender === 'Male' ? 'bg-blue-100' : 'bg-pink-100'
            }`}>
              <User className={`h-5 w-5 ${member.gender === 'Male' ? 'text-blue-500' : 'text-pink-500'}`} />
            </div>
            <div>
              <h4 className="font-semibold text-sm">{memberName}</h4>
              <div className="flex items-center text-xs text-gray-500 space-x-2">
                <span>#{member.serNo}</span>
                <span>•</span>
                <span>Level {member.level}</span>
                {member.vansh && (
                  <>
                    <span>•</span>
                    <span>{member.vansh}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-1">
            <Link 
              to={`/family/member/${member.serNo}`}
              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
              title="View Details"
            >
              <Eye size={14} />
            </Link>
            <Link 
              to={`/family/tree/${member.serNo}`}
              className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
              title="View Tree"
            >
              <GitBranch size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-3 border-gray-200 shadow-lg">
            {member.profileImage ? (
              <img 
                src={member.profileImage} 
                alt={memberName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = member.gender === 'Male' 
                    ? '/images/profiles/male1.jpg' 
                    : '/images/profiles/female1.jpg';
                }}
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${
                member.gender === 'Male' ? 'bg-blue-100' : 'bg-pink-100'
              }`}>
                <User className={`h-8 w-8 ${member.gender === 'Male' ? 'text-blue-500' : 'text-pink-500'}`} />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{memberName}</h3>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">
                #{member.serNo}
              </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Level {member.level}
              </span>
              <span className={`px-2 py-1 rounded-full ${
                member.gender === 'Male' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-pink-100 text-pink-800'
              }`}>
                {member.gender}
              </span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link 
            to={`/family/member/${member.serNo}`}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Eye size={16} className="mr-1" />
            Details
          </Link>
          <Link 
            to={`/family/tree/${member.serNo}`}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <GitBranch size={16} className="mr-1" />
            Tree
          </Link>
        </div>
      </div>

      {/* Basic Information Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {member.vansh && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1 flex items-center">
              <MapPin size={12} className="mr-1" />
              Vansh
            </p>
            <p className="font-semibold text-gray-800">{member.vansh}</p>
          </div>
        )}
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-1 flex items-center">
            <Baby size={12} className="mr-1" />
            Children
          </p>
          <p className="font-semibold text-gray-800">{member.sonDaughterCount || 0}</p>
        </div>

        {member.dob && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1 flex items-center">
              <Calendar size={12} className="mr-1" />
              Birth
            </p>
            <p className="font-semibold text-gray-800 text-sm">{formatDate(member.dob)}</p>
          </div>
        )}

        {member.dod && (
          <div className="bg-gray-50 p-3 rounded-lg">
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
          <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
            <p className="text-sm text-pink-700 mb-2 flex items-center font-medium">
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
        {(member.fatherSerNo || member.motherSerNo) && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 mb-2 flex items-center font-medium">
              <UserCircle size={14} className="mr-2" />
              Parents
            </p>
            <div className="flex flex-wrap gap-2">
              {member.fatherSerNo && (
                <Link 
                  to={`/family/member/${member.fatherSerNo}`}
                  className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
                >
                  Father (#{member.fatherSerNo})
                </Link>
              )}
              {member.motherSerNo && (
                <Link 
                  to={`/family/member/${member.motherSerNo}`}
                  className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
                >
                  Mother (#{member.motherSerNo})
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Children */}
        {member.childrenSerNos && member.childrenSerNos.length > 0 && (
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="text-sm text-green-700 mb-2 flex items-center font-medium">
              <Users size={14} className="mr-2" />
              Children ({member.childrenSerNos.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {member.childrenSerNos.slice(0, 5).map((childSerNo) => (
                <Link 
                  key={childSerNo}
                  to={`/family/member/${childSerNo}`}
                  className="text-green-600 hover:text-green-800 text-sm hover:underline"
                >
                  #{childSerNo}
                </Link>
              ))}
              {member.childrenSerNos.length > 5 && (
                <span className="text-green-600 text-sm">
                  +{member.childrenSerNos.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Biography */}
      {showAllFields && member.Bio && (
        <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-700 mb-2 flex items-center font-medium">
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
  );
};

export default EnhancedFamilyMemberCard;