const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client/src/pages/AdminDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Original section around line 296:');
const lines = content.split('\n');
lines.slice(295, 310).forEach((line, idx) => {
  console.log(`${296 + idx}: ${line}`);
});

// Replace with more flexible matching
const updatedContent = content.replace(
  /const \[statsRes\] = await Promise\.all\(\[\s*api\.get\('\/api\/admin\/dashboard'\)\s*\]\);\s*setStats\(statsRes\.data\.stats\);/,
  `const [statsRes, familyRes] = await Promise.all([
        api.get('/api/admin/dashboard'),
        api.get('/api/admin/family-members')
      ]);
      setStats(statsRes.data.stats);
      setFamilyMembers(familyRes.data);`
);

if (updatedContent !== content) {
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log('\nFile updated successfully!');
} else {
  console.log('\nNo changes made - pattern not found');
}
