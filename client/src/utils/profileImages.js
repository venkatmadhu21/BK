import defaultImages from '../photos_base64.json';

// Get default profile image based on gender
export function getDefaultProfileImage(gender) {
  if (!gender) return null;

  const genderKey = gender.toLowerCase();
  const genderImages = Object.keys(defaultImages).filter(key =>
    key.toLowerCase().startsWith(genderKey)
  );

  if (genderImages.length === 0) return null;

  // Return a random image for the gender
  const randomIndex = Math.floor(Math.random() * genderImages.length);
  return defaultImages[genderImages[randomIndex]];
}

// Get profile image URL with fallback to default
export function getProfileImageUrl(profileImage, gender) {
  // Handle object format with data, mimeType, originalName
  if (profileImage && typeof profileImage === 'object' && profileImage.data) {
    const mimeType = profileImage.mimeType || 'image/jpeg';
    const base64Data = profileImage.data;
    return `data:${mimeType};base64,${base64Data}`;
  }

  // Ensure profileImage is a string before processing
  if (profileImage && typeof profileImage === 'string') {
    // Backend now returns base64 images as complete data URIs
    // Check if it's already a complete data URL
    if (profileImage.startsWith('data:')) {
      return profileImage;
    }

    // Convert Google Drive share URLs to direct view URLs
    if (profileImage.includes('drive.google.com')) {
      const fileId = profileImage.split('id=')[1];
      if (fileId) {
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h400`;
      }
    }

    // Check if it's just a base64 string (no data URI prefix)
    // Base64 regex pattern - allows common base64 characters
    const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;
    if (base64Pattern.test(profileImage) && profileImage.length > 100) {
      // Assume it's a JPEG base64 string and convert to data URL
      return `data:image/jpeg;base64,${profileImage}`;
    }

    // Assume profileImage is already a valid URL
    return profileImage;
  }

  // Return default image based on gender
  return getDefaultProfileImage(gender);
}