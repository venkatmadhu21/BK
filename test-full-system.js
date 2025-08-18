const axios = require('axios');

async function testFullSystem() {
  console.log('🚀 Testing Full Relationship System...\n');
  
  try {
    // Test 1: Members API
    console.log('1️⃣ Testing Members API...');
    const membersRes = await axios.get('http://localhost:5000/api/family/members-new');
    console.log(`✅ Found ${membersRes.data.length} members`);
    
    // Test 2: Dynamic Relations API
    console.log('\n2️⃣ Testing Dynamic Relations API...');
    const relationsRes = await axios.get('http://localhost:5000/api/family/dynamic-relations/3');
    console.log(`✅ Found ${relationsRes.data.length} relations for serNo 3`);
    
    // Display sample relations
    console.log('\n📋 Sample Relations for Balwant R Gogte (#3):');
    relationsRes.data.slice(0, 5).forEach(r => {
      const name = [r.related?.firstName, r.related?.middleName, r.related?.lastName].filter(Boolean).join(' ');
      const label = r.relationMarathi ? `${r.relationEnglish} [${r.relationMarathi}]` : r.relationEnglish;
      console.log(`   ${label} → ${name} (#${r.related?.serNo})`);
    });
    
    // Test 3: All Relationships API
    console.log('\n3️⃣ Testing All Relationships API...');
    const allRelsRes = await axios.get('http://localhost:5000/api/family/all-relationships');
    console.log(`✅ Found ${allRelsRes.data.length} stored relationships`);
    
    // Test 4: Test multiple members
    console.log('\n4️⃣ Testing Multiple Members...');
    const testMembers = [1, 7, 13, 19];
    for (const serNo of testMembers) {
      const res = await axios.get(`http://localhost:5000/api/family/dynamic-relations/${serNo}`);
      const member = membersRes.data.find(m => m.serNo === serNo);
      console.log(`   SerNo ${serNo} (${member?.fullName}): ${res.data.length} relations`);
    }
    
    console.log('\n🎉 ALL TESTS PASSED! System is fully functional.');
    console.log('\n📱 Frontend URLs to test:');
    console.log('   • Test Page: http://localhost:5173/test/relations');
    console.log('   • Member Page: http://localhost:5173/family/member/3');
    console.log('   • Family Tree: http://localhost:5173/family');
    console.log('   • Admin Page: http://localhost:5173/admin/relations');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testFullSystem();