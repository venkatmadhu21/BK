const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/family';

async function debugRelationships() {
  try {
    console.log('Debugging relationships...\n');

    // Check member 3's children
    console.log('Checking member 3 (Balwant R Gogte) children:');
    const member3Response = await axios.get(`${BASE_URL}/member-new/3`);
    const member3 = member3Response.data;
    console.log(`Member 3: ${member3.fullName}, childrenSerNos: ${member3.childrenSerNos}`);
    
    // Check relationships where member 3 is a parent
    const rel3Response = await axios.get(`${BASE_URL}/relationships/3`);
    const rel3 = rel3Response.data.filter(r => r.fromSerNo === 3 && (r.relation === 'father' || r.relation === 'mother'));
    console.log(`Parent relationships for member 3:`, rel3.map(r => `${r.fromSerNo} -> ${r.toSerNo}: ${r.relation}`));
    
    // Check member 5's children
    console.log('\nChecking member 5 (Ganesh R Gogte) children:');
    const member5Response = await axios.get(`${BASE_URL}/member-new/5`);
    const member5 = member5Response.data;
    console.log(`Member 5: ${member5.fullName}, childrenSerNos: ${member5.childrenSerNos}`);
    
    // Check relationships where member 5 is a parent
    const rel5Response = await axios.get(`${BASE_URL}/relationships/5`);
    const rel5 = rel5Response.data.filter(r => r.fromSerNo === 5 && (r.relation === 'father' || r.relation === 'mother'));
    console.log(`Parent relationships for member 5:`, rel5.map(r => `${r.fromSerNo} -> ${r.toSerNo}: ${r.relation}`));
    
    // Check all father relationships
    console.log('\nAll father relationships:');
    const allRelsResponse = await axios.get(`${BASE_URL}/all-relationships`);
    const fatherRels = allRelsResponse.data.filter(r => r.relation === 'father').slice(0, 10);
    fatherRels.forEach(r => {
      console.log(`${r.fromSerNo} -> ${r.toSerNo}: ${r.relation}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugRelationships();