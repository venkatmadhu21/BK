const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/family';

async function checkSpecificRelationships() {
  try {
    console.log('Checking specific relationships...\n');

    // Check all father relationships
    const allRelsResponse = await axios.get(`${BASE_URL}/all-relationships`);
    const allRels = allRelsResponse.data;
    
    console.log('All father relationships:');
    const fatherRels = allRels.filter(r => r.relation === 'father');
    fatherRels.forEach(rel => {
      console.log(`${rel.fromSerNo} -> ${rel.toSerNo}: ${rel.relation}`);
    });
    
    console.log('\nFather relationships for member 3:');
    const member3FatherRels = fatherRels.filter(r => r.fromSerNo === 3);
    console.log(`Found ${member3FatherRels.length} father relationships for member 3`);
    member3FatherRels.forEach(rel => {
      console.log(`${rel.fromSerNo} -> ${rel.toSerNo}: ${rel.relation}`);
    });
    
    console.log('\nFather relationships for member 5:');
    const member5FatherRels = fatherRels.filter(r => r.fromSerNo === 5);
    console.log(`Found ${member5FatherRels.length} father relationships for member 5`);
    member5FatherRels.forEach(rel => {
      console.log(`${rel.fromSerNo} -> ${rel.toSerNo}: ${rel.relation}`);
    });
    
    console.log('\nFather relationships for member 7:');
    const member7FatherRels = fatherRels.filter(r => r.fromSerNo === 7);
    console.log(`Found ${member7FatherRels.length} father relationships for member 7`);
    member7FatherRels.forEach(rel => {
      console.log(`${rel.fromSerNo} -> ${rel.toSerNo}: ${rel.relation}`);
    });

    // Let's also check what the individual children endpoints return
    console.log('\n=== Individual Children Endpoints ===');
    
    console.log('\nMember 3 children via endpoint:');
    const children3Response = await axios.get(`${BASE_URL}/member-new/3/children`);
    console.log(`Found ${children3Response.data.length} children for member 3`);
    children3Response.data.forEach(child => {
      console.log(`- ${child.fullName} (SerNo: ${child.serNo})`);
    });
    
    console.log('\nMember 5 children via endpoint:');
    const children5Response = await axios.get(`${BASE_URL}/member-new/5/children`);
    console.log(`Found ${children5Response.data.length} children for member 5`);
    children5Response.data.forEach(child => {
      console.log(`- ${child.fullName} (SerNo: ${child.serNo})`);
    });

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

checkSpecificRelationships();