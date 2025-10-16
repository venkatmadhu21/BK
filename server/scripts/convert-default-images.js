const fs = require('fs');
const path = require('path');

// Function to convert image to base64
function imageToBase64(filePath) {
  try {
    const imageBuffer = fs.readFileSync(filePath);
    const base64 = imageBuffer.toString('base64');
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error(`Error converting ${filePath}:`, error.message);
    return null;
  }
}

// Read existing photos_base64.json
const photosPath = path.join(__dirname, '..', 'photos_base64.json');
let photosData = {};

try {
  const existingData = fs.readFileSync(photosPath, 'utf8');
  photosData = JSON.parse(existingData);
} catch (error) {
  console.log('No existing photos_base64.json found, creating new one');
}

// Directory containing default profile images
const profilesDir = path.join(__dirname, '..', '..', 'client', 'public', 'images', 'profiles');

// Read all files in the profiles directory
const files = fs.readdirSync(profilesDir);

console.log('Converting default profile images to base64...');

// Process each image file
files.forEach(file => {
  const filePath = path.join(profilesDir, file);
  const stat = fs.statSync(filePath);

  if (stat.isFile() && /\.(jpg|jpeg|png)$/i.test(file)) {
    console.log(`Converting ${file}...`);
    const base64Data = imageToBase64(filePath);
    if (base64Data) {
      photosData[file] = base64Data;
    }
  }
});

// Write updated data back to file
fs.writeFileSync(photosPath, JSON.stringify(photosData, null, 2));
console.log(`Updated photos_base64.json with ${Object.keys(photosData).length} images`);