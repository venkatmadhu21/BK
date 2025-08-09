const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/family';

async function testIndividualChildren() {
  try {
    console.log('Testing individual children endpoints...\n');

    // Test member 3's children
    console.log('Member 3 children:');
    const children3Response = await axios.get(`${BASE_URL}/member-new/3/children`);
    console.log(`Found ${children3Response.data.length} children for member 3`);
    children3Response.data.forEach(child => {
      console.log(`- ${child.fullName} (SerNo: ${child.serNo})`);
    });
    console.log('');

    // Test member 5's children
    console.log('Member 5 children:');
    const children5Response = await axios.get(`${BASE_URL}/member-new/5/children`);
    console.log(`Found ${children5Response.data.length} children for member 5`);
    children5Response.data.forEach(child => {
      console.log(`- ${child.fullName} (SerNo: ${child.serNo})`);
    });
    console.log('');

    // Test member 7's children
    console.log('Member 7 children:');
    const children7Response = await axios.get(`${BASE_URL}/member-new/7/children`);
    console.log(`Found ${children7Response.data.length} children for member 7`);
    children7Response.data.forEach(child => {
      console.log(`- ${child.fullName} (SerNo: ${child.serNo})`);
    });
    console.log('');

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testIndividualChildren();