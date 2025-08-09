const axios = require('axios');

async function debugFrontendIssue() {
  console.log('=== Debugging Frontend Issue ===\n');

  // Test 1: Check if backend server is running
  try {
    console.log('1. Testing backend server...');
    const response = await axios.get('http://localhost:5000/api/family/member-new/1');
    console.log('✅ Backend server is running');
    console.log(`   Member data: ${response.data.firstName} ${response.data.lastName}`);
  } catch (error) {
    console.log('❌ Backend server is not running or not accessible');
    console.log(`   Error: ${error.message}`);
    return;
  }

  // Test 2: Check all new API endpoints
  const endpoints = [
    '/api/family/members-new',
    '/api/family/member-new/1',
    '/api/family/member-new/1/parents',
    '/api/family/member-new/1/children',
    '/api/family/tree-new/1',
    '/api/family/all-relationships'
  ];

  console.log('\n2. Testing all new API endpoints...');
  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`http://localhost:5000${endpoint}`);
      console.log(`✅ ${endpoint} - Status: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.response?.status || error.message}`);
    }
  }

  // Test 3: Check for invalid serNo handling
  console.log('\n3. Testing invalid serNo handling...');
  try {
    await axios.get('http://localhost:5000/api/family/member-new/undefined');
    console.log('❌ Server should have returned an error for undefined serNo');
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Server correctly handles invalid serNo with 400 error');
    } else {
      console.log(`❌ Server returned unexpected error: ${error.response?.status || error.message}`);
    }
  }

  // Test 4: Check for non-existent member
  console.log('\n4. Testing non-existent member handling...');
  try {
    await axios.get('http://localhost:5000/api/family/member-new/999');
    console.log('❌ Server should have returned 404 for non-existent member');
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('✅ Server correctly handles non-existent member with 404 error');
    } else {
      console.log(`❌ Server returned unexpected error: ${error.response?.status || error.message}`);
    }
  }

  console.log('\n=== Debug Complete ===');
  console.log('\nIf all backend tests pass, the issue is likely in the frontend:');
  console.log('1. Check browser console for JavaScript errors');
  console.log('2. Verify React Router is correctly parsing URL parameters');
  console.log('3. Check if the serNo parameter is being passed correctly');
  console.log('4. Ensure the React development server is running on port 3000');
}

debugFrontendIssue().catch(console.error);