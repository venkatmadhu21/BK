const axios = require('axios');

async function testInvalidSerNo() {
  console.log('Testing invalid serNo handling...\n');

  const testCases = [
    'ApiTestPage',
    'undefined',
    'null',
    'abc',
    '0',
    '-1',
    '1.5'
  ];

  for (const testCase of testCases) {
    try {
      console.log(`Testing serNo: "${testCase}"`);
      const response = await axios.get(`http://localhost:5000/api/family/member-new/${testCase}`);
      console.log(`  ❌ Should have failed but got status: ${response.status}`);
    } catch (error) {
      if (error.response) {
        console.log(`  ✅ Status: ${error.response.status}, Message: ${error.response.data?.message || 'No message'}`);
      } else {
        console.log(`  ❌ Network error: ${error.message}`);
      }
    }
    console.log('');
  }

  // Test a valid serNo
  try {
    console.log('Testing valid serNo: "1"');
    const response = await axios.get('http://localhost:5000/api/family/member-new/1');
    console.log(`  ✅ Status: ${response.status}, Member: ${response.data.firstName} ${response.data.lastName}`);
  } catch (error) {
    console.log(`  ❌ Error: ${error.response?.status || error.message}`);
  }
}

testInvalidSerNo().catch(console.error);