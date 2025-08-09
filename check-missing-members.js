const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/family';

async function checkMissingMembers() {
  try {
    console.log('Checking if members 9 and 11 exist...\n');

    // Check if member 9 exists
    try {
      const member9Response = await axios.get(`${BASE_URL}/member-new/9`);
      console.log(`Member 9 exists: ${member9Response.data.fullName} (SerNo: ${member9Response.data.serNo})`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('Member 9 does NOT exist in members collection');
      } else {
        console.log('Error checking member 9:', error.message);
      }
    }

    // Check if member 11 exists
    try {
      const member11Response = await axios.get(`${BASE_URL}/member-new/11`);
      console.log(`Member 11 exists: ${member11Response.data.fullName} (SerNo: ${member11Response.data.serNo})`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('Member 11 does NOT exist in members collection');
      } else {
        console.log('Error checking member 11:', error.message);
      }
    }

    // Let's check what serNos actually exist in the members collection
    console.log('\nAll members in collection:');
    const allMembersResponse = await axios.get(`${BASE_URL}/members-new`);
    const allMembers = allMembersResponse.data;
    console.log(`Total members: ${allMembers.length}`);
    
    const serNos = allMembers.map(m => m.serNo).sort((a, b) => a - b);
    console.log(`SerNos: ${serNos.join(', ')}`);
    
    // Check which serNos are missing from the expected range
    const maxSerNo = Math.max(...serNos);
    const missingSerNos = [];
    for (let i = 1; i <= maxSerNo; i++) {
      if (!serNos.includes(i)) {
        missingSerNos.push(i);
      }
    }
    
    if (missingSerNos.length > 0) {
      console.log(`Missing SerNos: ${missingSerNos.join(', ')}`);
    } else {
      console.log('No missing SerNos in the range');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkMissingMembers();