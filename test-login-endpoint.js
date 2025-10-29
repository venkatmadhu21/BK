const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login endpoint...\n');
    
    const testCases = [
      { 
        name: 'Test 1: Admin with email',
        data: { email: 'admin123@gmail.com', password: '1234567890' }
      },
      { 
        name: 'Test 2: Admin with username',
        data: { username: 'admin_1', password: 'admin1234' }
      },
      { 
        name: 'Test 3: Username without password',
        data: { username: 'test_user' }
      },
      { 
        name: 'Test 4: Empty form data',
        data: {}
      }
    ];
    
    for (const testCase of testCases) {
      console.log(`\n${testCase.name}`);
      console.log('Request data:', JSON.stringify(testCase.data, null, 2));
      
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', testCase.data, {
          headers: { 'Content-Type': 'application/json' }
        });
        console.log('✅ Success (200):', response.data);
      } catch (error) {
        const status = error.response?.status || 'No response';
        const errorData = error.response?.data || error.message;
        console.log(`❌ Error (${status}):`, JSON.stringify(errorData, null, 2));
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  }
}

testLogin();
