const fs = require('fs');
const path = require('path');

try {
  const filePath = path.join(__dirname, 'client/src/pages/AdminDashboard.jsx');
  let content = fs.readFileSync(filePath, 'utf8');

  // Look for the specific pattern
  const pattern = /const \[statsRes\] = await Promise\.all\(\[\s+api\.get\('\/api\/admin\/dashboard'\)\s+\]\);\s+setStats\(statsRes\.data\.stats\);/;
  
  if (pattern.test(content)) {
    const updatedContent = content.replace(
      pattern,
      `const [statsRes, familyRes] = await Promise.all([
        api.get('/api/admin/dashboard'),
        api.get('/api/admin/family-members')
      ]);
      setStats(statsRes.data.stats);
      setFamilyMembers(familyRes.data);`
    );
    
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    fs.writeFileSync(path.join(__dirname, 'fix_result.txt'), 'SUCCESS: File updated');
  } else {
    // Try with exact spacing
    const lines = content.split('\n');
    const targetIndex = lines.findIndex(line => line.includes('const [statsRes] = await Promise.all'));
    if (targetIndex !== -1) {
      fs.writeFileSync(path.join(__dirname, 'fix_result.txt'), `Found at line ${targetIndex + 1}, exact content:\n${lines.slice(targetIndex, targetIndex + 8).join('\n')}`);
    } else {
      fs.writeFileSync(path.join(__dirname, 'fix_result.txt'), 'Pattern not found');
    }
  }
} catch (err) {
  fs.writeFileSync(path.join(__dirname, 'fix_result.txt'), `ERROR: ${err.message}`);
}
