import defaultImages from '../photos_base64.json';

export function getDefaultProfileImage(gender) {
  if (!gender) return null;

  const genderKey = gender.toLowerCase();
  const genderImages = Object.keys(defaultImages).filter(key =>
    key.toLowerCase().startsWith(genderKey)
  );

  if (genderImages.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * genderImages.length);
  return defaultImages[genderImages[randomIndex]];
}

const BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/;

const toBase64FromArray = (values) => {
  if (!values || values.length === 0) return '';
  const chunkSize = 0x8000;
  let binary = '';
  for (let i = 0; i < values.length; i += chunkSize) {
    const chunk = values.slice(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }
  if (typeof window !== 'undefined' && window.btoa) {
    return window.btoa(binary);
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(binary, 'binary').toString('base64');
  }
  return '';
};

const normalizeStringSource = (input) => {
  if (!input) return '';
  return input.trim();
};

export function getProfileImageUrl(profileImage, gender) {
  if (profileImage && typeof profileImage === 'object') {
    const mimeType = profileImage.mimeType || 'image/jpeg';
    const raw = profileImage.data ?? profileImage.base64 ?? profileImage.value ?? profileImage.source;
    if (typeof raw === 'string') {
      const trimmed = normalizeStringSource(raw);
      if (!trimmed) {
        return getDefaultProfileImage(gender);
      }
      if (trimmed.startsWith('data:')) {
        return trimmed;
      }
      const compact = trimmed.replace(/\s+/g, '');
      if (BASE64_PATTERN.test(compact) && compact.length >= 40) {
        return `data:${mimeType};base64,${compact}`;
      }
    }
    if (Array.isArray(raw) || ArrayBuffer.isView(raw)) {
      const values = Array.isArray(raw) ? raw : Array.from(raw);
      const base64 = toBase64FromArray(values);
      if (base64) {
        return `data:${mimeType};base64,${base64}`;
      }
    }
    if (raw && typeof raw === 'object' && Array.isArray(raw.data)) {
      return getProfileImageUrl({ ...profileImage, data: raw.data }, gender);
    }
    if (typeof profileImage.url === 'string') {
      const trimmedUrl = normalizeStringSource(profileImage.url);
      if (trimmedUrl) {
        return trimmedUrl;
      }
    }
  }

  if (profileImage && typeof profileImage === 'string') {
    const trimmed = normalizeStringSource(profileImage);
    if (!trimmed) {
      return getDefaultProfileImage(gender);
    }
    if (trimmed.startsWith('data:')) {
      return trimmed;
    }
    if (trimmed.includes('drive.google.com')) {
      const fileId = trimmed.split('id=')[1];
      if (fileId) {
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h400`;
      }
    }
    const compact = trimmed.replace(/\s+/g, '');
    if (BASE64_PATTERN.test(compact) && compact.length > 100) {
      return `data:image/jpeg;base64,${compact}`;
    }
    return trimmed;
  }

  return getDefaultProfileImage(gender);
}

export function resolveProfileImage(person, fallbackGender) {
  const gender = person?.gender || fallbackGender;
  const candidates = [
    person?.profileImage,
    person?.personalDetails?.profileImage,
    person?.profilePicture,
    person?.profileImageData,
    person?.profileImageUrl,
    person?.photo,
    person?.image,
    person?.avatar
  ];
  for (const candidate of candidates) {
    if (candidate) {
      const resolved = getProfileImageUrl(candidate, gender);
      if (resolved) {
        return resolved;
      }
    }
  }
  return getProfileImageUrl(null, gender);
}
