const axios = require('axios');

async function testEnhancedRelations(serNo = 3) {
  try {
    console.log(`\n=== Testing Enhanced Relations for serNo ${serNo} ===`);
    
    const url = `http://localhost:5000/api/family/dynamic-relations/${serNo}`;
    console.log('GET', url);
    
    const { data } = await axios.get(url);
    console.log(`\nFound ${data.length} relations for serNo ${serNo}:`);
    console.log('=' .repeat(80));
    
    // Group relations by type for better display
    const grouped = {};
    for (const r of data) {
      const category = getRelationCategory(r.relationEnglish);
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(r);
    }
    
    // Display by category
    const categories = ['Direct Family', 'Extended Family', 'In-Laws', 'Grandparents/Grandchildren', 'Other'];
    for (const category of categories) {
      if (grouped[category] && grouped[category].length > 0) {
        console.log(`\n${category}:`);
        console.log('-'.repeat(40));
        for (const r of grouped[category]) {
          const name = [r.related.firstName, r.related.middleName, r.related.lastName].filter(Boolean).join(' ');
          const label = r.relationMarathi ? 
            `${r.relationEnglish} [${r.relationMarathi}]` : 
            r.relationEnglish;
          console.log(`  ${label.padEnd(35)} → ${name} (#${r.related.serNo})`);
        }
      }
    }
    
    console.log(`\nTotal Relations: ${data.length}`);
    
  } catch (err) {
    if (err.response) {
      console.error('Error status:', err.response.status, err.response.data);
    } else {
      console.error('Request error:', err.message);
    }
  }
}

function getRelationCategory(relation) {
  if (['Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister', 'Husband', 'Wife'].includes(relation)) {
    return 'Direct Family';
  }
  if (relation.includes('Grandfather') || relation.includes('Grandmother') || relation.includes('Grandson') || relation.includes('Granddaughter')) {
    return 'Grandparents/Grandchildren';
  }
  if (relation.includes('Uncle') || relation.includes('Aunt') || relation.includes('Cousin') || relation.includes('Nephew') || relation.includes('Niece')) {
    return 'Extended Family';
  }
  if (relation.includes('in-law')) {
    return 'In-Laws';
  }
  return 'Other';
}

// Test multiple members
async function testMultiple() {
  const testSerNos = [1, 2, 3, 5, 7];
  for (const serNo of testSerNos) {
    await testEnhancedRelations(serNo);
    console.log('\n' + '='.repeat(100));
  }
}

const serNo = parseInt(process.argv[2] || '3', 10);
if (process.argv[2] === 'all') {
  testMultiple();
} else {
  testEnhancedRelations(serNo);
}