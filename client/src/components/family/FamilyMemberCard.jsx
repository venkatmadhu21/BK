import React from 'react';
import { Link } from 'react-router-dom';
import { User, Users, UserCircle } from 'lucide-react';

const FamilyMemberCard = ({ member }) => {
  if (!member) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center mb-4">
        <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-gray-200 shadow-md">
          {member.profilePicture ? (
            <img 
              src={member.profilePicture} 
              alt={member.fullName || `${member.firstName || ''} ${member.lastName || ''}`.trim()}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = member.gender === 'Male' 
                  ? '/images/profiles/male1.jpg' 
                  : '/images/profiles/female1.jpg';
              }}
            />
          ) : (
            <div className="bg-blue-100 w-full h-full flex items-center justify-center">
              {member.gender === 'Male' ? (
                <User className="h-6 w-6 text-blue-500" />
              ) : (
                <User className="h-6 w-6 text-pink-500" />
              )}
            </div>
          )}
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

      {member.spouseSerNo && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-500 mb-1">Spouse</p>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden mr-3 border border-gray-200">
              <img 
                src={member.gender === 'Male' ? `/images/profiles/female${(member.spouseSerNo % 8) + 1}.jpg` : `/images/profiles/male${(member.spouseSerNo % 8) + 1}.jpg`}
                alt="Spouse"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = member.gender === 'Male' ? '/images/profiles/female1.jpg' : '/images/profiles/male1.jpg';
                }}
              />
            </div>
            <Link 
              to={`/family/member/${member.spouseSerNo}`}
              className="text-blue-600 hover:text-blue-800"
            >
              Spouse <span className="text-xs text-gray-500">#{member.spouseSerNo}</span>
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