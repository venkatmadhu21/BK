const normalizeDateValue = (value) => {
  if (!value) return '';
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return date.toISOString().slice(0, 10);
  } catch (error) {
    return '';
  }
};

const createEmptyImage = () => ({
  data: '',
  mimeType: '',
  originalName: '',
});

const deepMergeDefaults = (defaults, source) => {
  const base = typeof defaults === 'object' && defaults !== null && !Array.isArray(defaults)
    ? { ...defaults }
    : defaults;

  if (typeof source !== 'object' || source === null || Array.isArray(source)) {
    return base;
  }

  const result = { ...base };

  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    const baseValue = base?.[key];

    if (typeof sourceValue === 'object' && sourceValue !== null && !Array.isArray(sourceValue)) {
      result[key] = deepMergeDefaults(
        typeof baseValue === 'object' && baseValue !== null && !Array.isArray(baseValue)
          ? baseValue
          : {},
        sourceValue,
      );
    } else {
      result[key] = sourceValue;
    }
  });

  return result;
};

export const createEmptyPersonalDetails = () => ({
  firstName: '',
  middleName: '',
  lastName: '',
  gender: 'male',
  dateOfBirth: '',
  confirmDateOfBirth: 'yes',
  isAlive: 'yes',
  dateOfDeath: '',
  confirmDateOfDeath: 'no',
  email: '',
  mobileNumber: '',
  alternateMobileNumber: '',
  country: 'India',
  state: '',
  district: '',
  city: '',
  area: '',
  colonyStreet: '',
  flatPlotNumber: '',
  buildingNumber: '',
  pinCode: '',
  aboutYourself: '',
  qualifications: '',
  profession: '',
  profileImage: createEmptyImage(),
  everMarried: 'no',
});

export const createEmptyDivorcedDetails = () => ({
  description: '',
  spouseFirstName: '',
  spouseMiddleName: '',
  spouseLastName: '',
  dateOfDivorce: '',
  spouseProfileImage: createEmptyImage(),
  marriageDate: '',
  everWidowed: 'no',
});

export const createEmptyMarriedDetails = () => ({
  description: '',
  spouseFirstName: '',
  spouseMiddleName: '',
  spouseLastName: '',
  spouseGender: 'female',
  dateOfMarriage: '',
  spouseDateOfBirth: '',
  spouseProfileImage: createEmptyImage(),
  spouseEmail: '',
  spouseMobileNumber: '',
  everDivorced: 'no',
});

export const createEmptyRemarriedDetails = () => ({
  description: '',
  spouseFirstName: '',
  spouseMiddleName: '',
  spouseLastName: '',
  spouseGender: 'female',
  dateOfMarriage: '',
  spouseDateOfBirth: '',
  spouseEmail: '',
  spouseMobileNumber: '',
  spouseProfileImage: createEmptyImage(),
});

export const createEmptyWidowedDetails = () => ({
  description: '',
  spouseFirstName: '',
  spouseMiddleName: '',
  spouseLastName: '',
  spouseDateOfDeath: '',
  spouseGender: 'female',
  dateOfMarriage: '',
  spouseDateOfBirth: '',
  spouseEmail: '',
  spouseMobileNumber: '',
  spouseProfileImage: createEmptyImage(),
  everRemarried: 'no',
});

export const createEmptyParentsInformation = () => ({
  description: '',
  fatherFirstName: '',
  fatherMiddleName: '',
  fatherLastName: '',
  fatherEmail: '',
  fatherMobileNumber: '',
  fatherDateOfBirth: '',
  fatherProfileImage: createEmptyImage(),
  motherFirstName: '',
  motherMiddleName: '',
  motherLastName: '',
  motherMobileNumber: '',
  motherDateOfBirth: '',
  motherProfileImage: createEmptyImage(),
});

const normalizeSectionDateFields = (section, fields) => {
  if (typeof section !== 'object' || section === null || Array.isArray(section)) return section;

  const normalized = { ...section };

  fields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(normalized, field)) {
      normalized[field] = normalizeDateValue(normalized[field]);
    }
  });

  return normalized;
};

export const createHierarchyFormDefaults = (entry = {}) => {
  const personalDetails = normalizeSectionDateFields(
    deepMergeDefaults(createEmptyPersonalDetails(), entry?.personalDetails ?? {}),
    ['dateOfBirth', 'dateOfDeath']
  );

  const marriedDetails = entry?.marriedDetails
    ? normalizeSectionDateFields(
        deepMergeDefaults(createEmptyMarriedDetails(), entry.marriedDetails),
        ['dateOfMarriage', 'spouseDateOfBirth']
      )
    : null;

  const divorcedDetails = entry?.divorcedDetails
    ? normalizeSectionDateFields(
        deepMergeDefaults(createEmptyDivorcedDetails(), entry.divorcedDetails),
        ['dateOfDivorce', 'marriageDate']
      )
    : null;

  const remarriedDetails = entry?.remarriedDetails
    ? normalizeSectionDateFields(
        deepMergeDefaults(createEmptyRemarriedDetails(), entry.remarriedDetails),
        ['dateOfMarriage', 'spouseDateOfBirth']
      )
    : null;

  const widowedDetails = entry?.widowedDetails
    ? normalizeSectionDateFields(
        deepMergeDefaults(createEmptyWidowedDetails(), entry.widowedDetails),
        ['spouseDateOfDeath', 'dateOfMarriage', 'spouseDateOfBirth']
      )
    : null;

  const parentsInformation = entry?.parentsInformation
    ? normalizeSectionDateFields(
        deepMergeDefaults(createEmptyParentsInformation(), entry.parentsInformation),
        ['fatherDateOfBirth', 'motherDateOfBirth']
      )
    : null;

  return {
    personalDetails,
    marriedDetails,
    divorcedDetails,
    remarriedDetails,
    widowedDetails,
    parentsInformation,
    isapproved: entry?.isapproved ?? false,
  };
};

export const prepareHierarchyFormPayload = (data) => {
  const normalizeSection = (section) => {
    if (!section || (typeof section !== 'object' || section === null || Array.isArray(section))) return section;
    const normalized = { ...section };
    Object.keys(normalized).forEach((key) => {
      if (normalized[key] === undefined) {
        delete normalized[key];
      }
    });
    return normalized;
  };

  return {
    personalDetails: normalizeSection(data.personalDetails),
    marriedDetails: data.marriedDetails ? normalizeSection(data.marriedDetails) : null,
    divorcedDetails: data.divorcedDetails ? normalizeSection(data.divorcedDetails) : null,
    remarriedDetails: data.remarriedDetails ? normalizeSection(data.remarriedDetails) : null,
    widowedDetails: data.widowedDetails ? normalizeSection(data.widowedDetails) : null,
    parentsInformation: data.parentsInformation ? normalizeSection(data.parentsInformation) : null,
    isapproved: data.isapproved ?? false,
  };
};

export const createEmptyTempMemberDetails = () => ({
  firstName: '',
  middleName: '',
  lastName: '',
  gender: 'male',
  dateOfBirth: '',
  email: '',
  mobileNumber: '',
  country: 'India',
  state: '',
  city: '',
  profileImage: createEmptyImage(),
  description: '',
});

export const createTempMemberDefaults = (entry = {}) => {
  const personalDetails = normalizeSectionDateFields(
    deepMergeDefaults(createEmptyTempMemberDetails(), entry?.personalDetails ?? {}),
    ['dateOfBirth']
  );

  return {
    personalDetails,
  };
};

export const prepareTempMemberPayload = (data) => {
  const normalizeSection = (section) => {
    if (!section || (typeof section !== 'object' || section === null || Array.isArray(section))) return section;
    const normalized = { ...section };
    Object.keys(normalized).forEach((key) => {
      if (normalized[key] === undefined) {
        delete normalized[key];
      }
    });
    return normalized;
  };

  return {
    personalDetails: normalizeSection(data.personalDetails),
  };
};
