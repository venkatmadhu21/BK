import re

file_path = r'c:\Users\USER\Desktop\Bal-krishna Nivas\client\src\pages\AdminDashboard.jsx'

with open(file_path, 'r', encoding='utf8') as f:
    content = f.read()

# Pattern to find the loadDashboardData function
pattern = r'const \[statsRes\] = await Promise\.all\(\[\s+api\.get\(\'/api/admin/dashboard\'\)\s+\]\);\s+setStats\(statsRes\.data\.stats\);'

replacement = '''const [statsRes, familyRes] = await Promise.all([
        api.get('/api/admin/dashboard'),
        api.get('/api/admin/family-members')
      ]);
      setStats(statsRes.data.stats);
      setFamilyMembers(familyRes.data);'''

new_content = re.sub(pattern, replacement, content)

if new_content != content:
    with open(file_path, 'w', encoding='utf8') as f:
        f.write(new_content)
    print('File updated successfully')
else:
    print('No match found')
