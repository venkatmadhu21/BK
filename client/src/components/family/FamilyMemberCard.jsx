import React from 'react';
import { Link } from 'react-router-dom';
import { User, Users, UserCircle } from 'lucide-react';
import { getProfileImageUrl } from '../../utils/profileImages';

const FamilyMemberCard = ({ member, spouse = null }) => {
  if (!member) return null;

  const isMale = () => member?.gender?.toLowerCase() === 'male';
  
  // Get spouse name with fallback
  const getSpouseName = () => {
    if (spouse?.fullName) return spouse.fullName;
    if (spouse?.firstName || spouse?.lastName) {
      return `${spouse?.firstName || ''} ${spouse?.lastName || ''}`.trim();
    }
    return 'Spouse';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center mb-4">
        <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-gray-200 shadow-md">
          <img
            src={getProfileImageUrl(member.profileImage, member.gender)}
            alt={member.fullName || `${member.firstName || ''} ${member.lastName || ''}`.trim()}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getProfileImageUrl(null, member.gender);
            }}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold">
            {member.fullName || `${member.firstName || ''} ${member.middleName || ''} ${member.lastName || ''}`.trim()}
          </h3>
          <p className="text-gray-600 text-sm">
            {member.vansh && <span className="mr-2">{member.vansh}</span>}
            <span className="bg-gray-200 px-2 py-1 rounded text-xs">#{member.serNo}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Level</p>
          <p className="font-medium">{member.level}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Children</p>
          <p className="font-medium">{member.sonDaughterCount || 0}</p>
        </div>
      </div>

      {(member.spouseSerNo || spouse) && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-500 mb-1">Spouse</p>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden mr-3 border border-gray-200">
              <img
                src={getProfileImageUrl(spouse?.profileImage, isMale() ? 'Female' : 'Male')}
                alt="Spouse"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getProfileImageUrl(null, isMale() ? 'Female' : 'Male');
                }}
              />
            </div>
            <Link 
              to={`/family/member/${spouse?.serNo || member.spouseSerNo}`}
              className="text-blue-600 hover:text-blue-800"
            >
              {getSpouseName()} <span className="text-xs text-gray-500">#{spouse?.serNo || member.spouseSerNo}</span>
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        {member.fatherSerNo && (
          <Link 
            to={`/family/member/${member.fatherSerNo}`}
            className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200"
          >
            View Father
          </Link>
        )}
        {member.motherSerNo && (
          <Link 
            to={`/family/member/${member.motherSerNo}`}
            className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200"
          >
            View Mother
          </Link>
        )}
        {member.childrenSerNos && member.childrenSerNos.length > 0 && (
          <Link 
            to={`/family/member/${member.serNo}/children`}
            className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200"
          >
            <Users className="h-3 w-3 inline mr-1" />
            View Children ({member.childrenSerNos.length})
          </Link>
        )}
        <Link 
          to={`/family/tree/${member.serNo}`}
          className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200"
        >
          View Family Tree
        </Link>
      </div>
    </div>
  );
};

export default FamilyMemberCard;