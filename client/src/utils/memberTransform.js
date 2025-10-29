/**
 * Transforms family member data from the new schema (with nested personalDetails)
 * to the format expected by the frontend components
 */

export const transformMemberData = (member) => {
  if (!member) return null;

  // Check if member already has flat structure (backwards compatibility)
  if (member.firstName && !member.personalDetails?.firstName) {
    return member;
  }

  // Extract from nested personalDetails
  const personal = member.personalDetails || {};
  const married = member.marriedDetails || {};
  const parents = member.parentsInformation || {};

  return {
    _id: member._id,
    sNo: member.sNo || member.serNo,
    serNo: member.serNo || member.sNo,
    
    // Personal Details (flattened from personalDetails object)
    firstName: personal.firstName || '',
    middleName: personal.middleName || '',
    lastName: personal.lastName || '',
    fullName: `${personal.firstName || ''} ${personal.middleName || ''} ${personal.lastName || ''}`.trim(),
    
    gender: personal.gender || 'Unknown',
    dateOfBirth: personal.dateOfBirth,
    confirmDateOfBirth: personal.confirmDateOfBirth,
    isAlive: personal.isAlive === 'yes' ? true : personal.isAlive === 'no' ? false : true,
    dateOfDeath: personal.dateOfDeath,
    
    email: personal.email || '',
    mobileNumber: personal.mobileNumber || '',
    phone: personal.mobileNumber || '', // Alias for compatibility
    alternateMobileNumber: personal.alternateMobileNumber || '',
    
    country: personal.country || 'India',
    state: personal.state || '',
    district: personal.district || '',
    city: personal.city || '',
    area: personal.area || '',
    colonyStreet: personal.colonyStreet || '',
    flatPlotNumber: personal.flatPlotNumber || '',
    buildingNumber: personal.buildingNumber || '',
    pinCode: personal.pinCode || '',
    
    aboutYourself: personal.aboutYourself || '',
    qualifications: personal.qualifications || '',
    profession: personal.profession || '',
    
    profileImage: personal.profileImage || null,
    
    // Marital Status
    everMarried: personal.everMarried === 'yes' ? true : false,
    
    // Spouse Information
    spouse: married ? {
      firstName: married.spouseFirstName || '',
      middleName: married.spouseMiddleName || '',
      lastName: married.spouseLastName || '',
      fullName: `${married.spouseFirstName || ''} ${married.spouseMiddleName || ''} ${married.spouseLastName || ''}`.trim(),
      gender: married.spouseGender,
      serNo: member.spouseSerNo
    } : null,
    
    spouseSerNo: member.spouseSerNo,
    dateOfMarriage: married.dateOfMarriage,
    
    // Family Tree Relationships
    fatherSerNo: member.fatherSerNo,
    motherSerNo: member.motherSerNo,
    childrenSerNos: member.childrenSerNos || [],
    sonDaughterCount: (member.childrenSerNos || []).length,
    
    // Hierarchy Info
    level: member.level,
    vansh: member.vansh || '',
    isapproved: member.isapproved || false,
    
    // Timestamps
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
    __v: member.__v
  };
};

/**
 * Transform an array of members
 */
export const transformMembersData = (members) => {
  if (!Array.isArray(members)) {
    return members;
  }
  return members.map(member => transformMemberData(member));
};

/**
 * Reverse transform - convert from flat structure to new schema format
 * Useful for sending data back to the API
 */
export const reverseTransformMemberData = (flatMember) => {
  if (!flatMember) return null;

  return {
    sNo: flatMember.sNo || flatMember.serNo,
    serNo: flatMember.serNo || flatMember.sNo,
    isapproved: flatMember.isapproved || false,
    
    personalDetails: {
      firstName: flatMember.firstName || '',
      middleName: flatMember.middleName || '',
      lastName: flatMember.lastName || '',
      gender: flatMember.gender || 'male',
      dateOfBirth: flatMember.dateOfBirth,
      confirmDateOfBirth: flatMember.confirmDateOfBirth || 'no',
      isAlive: flatMember.isAlive ? 'yes' : 'no',
      dateOfDeath: flatMember.dateOfDeath,
      email: flatMember.email || '',
      mobileNumber: flatMember.mobileNumber || flatMember.phone || '',
      alternateMobileNumber: flatMember.alternateMobileNumber || '',
      country: flatMember.country || 'India',
      state: flatMember.state || '',
      district: flatMember.district || '',
      city: flatMember.city || '',
      area: flatMember.area || '',
      colonyStreet: flatMember.colonyStreet || '',
      flatPlotNumber: flatMember.flatPlotNumber || '',
      buildingNumber: flatMember.buildingNumber || '',
      pinCode: flatMember.pinCode || '',
      aboutYourself: flatMember.aboutYourself || '',
      qualifications: flatMember.qualifications || '',
      profession: flatMember.profession || '',
      profileImage: flatMember.profileImage || null,
      everMarried: flatMember.everMarried ? 'yes' : 'no'
    },
    
    marriedDetails: flatMember.everMarried ? {
      spouseFirstName: flatMember.spouse?.firstName || '',
      spouseMiddleName: flatMember.spouse?.middleName || '',
      spouseLastName: flatMember.spouse?.lastName || '',
      spouseGender: flatMember.spouse?.gender,
      dateOfMarriage: flatMember.dateOfMarriage
    } : null,
    
    fatherSerNo: flatMember.fatherSerNo,
    motherSerNo: flatMember.motherSerNo,
    spouseSerNo: flatMember.spouseSerNo,
    childrenSerNos: flatMember.childrenSerNos || [],
    
    level: flatMember.level,
    vansh: flatMember.vansh || ''
  };
};