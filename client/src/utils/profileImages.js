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
  if (profileImage) {
    // Convert Google Drive share URLs to direct view URLs
    if (profileImage.includes('drive.google.com/open?id=')) {
      const fileId = profileImage.split('id=')[1];
      // Use Google Drive thumbnail API for better compatibility
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h400`;
    }

    // Check if it's already a data URL
    if (profileImage.startsWith('data:')) {
      return profileImage;
    }

    // Check if it's a base64 string (contains only base64 characters)
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