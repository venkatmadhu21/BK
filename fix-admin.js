const fs = require('fs');
const filepath = 'c:\\Users\\USER\\Desktop\\Bal-krishna Nivas\\client\\src\\pages\\AdminDashboard.jsx';
let content = fs.readFileSync(filepath, 'utf8');
const search = 'payload = excludeUnchangedNestedFields(payload, originalData);';
const replace = 'if (modalType !== "family-members") {\n            payload = excludeUnchangedNestedFields(payload, originalData);\n          }';
if (content.includes(search)) {
  content = content.replace(search, replace);
  fs.writeFileSync(filepath, content, 'utf8');
  console.log('Successfully updated AdminDashboard.jsx');
} else {
  console.log('Search string not found');
}
