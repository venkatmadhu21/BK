const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/family';

async function testNewAPI() {
  try {
    console.log('Testing new API endpoints...\n');

    // Test 1: Get all members from new collection
    console.log('1. Testing /members-new endpoint:');
    const membersResponse = await axios.get(`${BASE_URL}/members-new`);
    console.log(`Found ${membersResponse.data.length} members`);
    if (membersResponse.data.length > 0) {
      const sample = membersResponse.data[0];
      console.log(`Sample member: ${sample.fullName || sample.firstName + ' ' + sample.lastName} (SerNo: ${sample.serNo})`);
    }
    console.log('');

    // Test 2: Get specific member
    console.log('2. Testing /member-new/1 endpoint:');
    const memberResponse = await axios.get(`${BASE_URL}/member-new/1`);
    const member = memberResponse.data;
    console.log(`Member: ${member.fullName || member.firstName + ' ' + member.lastName} (SerNo: ${member.serNo})`);
    console.log(`Gender: ${member.gender}, Level: ${member.level}`);
    console.log('');

    // Test 3: Get relationships for member 1
    console.log('3. Testing /relationships/1 endpoint:');
    const relationshipsResponse = await axios.get(`${BASE_URL}/relationships/1`);
    console.log(`Found ${relationshipsResponse.data.length} relationships for member 1`);
    relationshipsResponse.data.slice(0, 3).forEach(rel => {
      console.log(`- ${rel.fromSerNo} -> ${rel.toSerNo}: ${rel.relation} (${rel.relationMarathi})`);
    });
    console.log('');

    // Test 4: Get children of member 1
    console.log('4. Testing /member-new/1/children endpoint:');
    const childrenResponse = await axios.get(`${BASE_URL}/member-new/1/children`);
    console.log(`Found ${childrenResponse.data.length} children for member 1`);
    childrenResponse.data.forEach(child => {
      console.log(`- ${child.fullName || child.firstName + ' ' + child.lastName} (SerNo: ${child.serNo})`);
    });
    console.log('');

    // Test 5: Get parents of member 3
    console.log('5. Testing /member-new/3/parents endpoint:');
    const parentsResponse = await axios.get(`${BASE_URL}/member-new/3/parents`);
    const parents = parentsResponse.data;
    console.log(`Parents of member 3:`);
    if (parents.father) {
      console.log(`- Father: ${parents.father.fullName || parents.father.firstName + ' ' + parents.father.lastName} (SerNo: ${parents.father.serNo})`);
    }
    if (parents.mother) {
      console.log(`- Mother: ${parents.mother.fullName || parents.mother.firstName + ' ' + parents.mother.lastName} (SerNo: ${parents.mother.serNo})`);
    }
    console.log('');

    // Test 6: Get family tree starting from member 1
    console.log('6. Testing /tree-new/1 endpoint:');
    const treeResponse = await axios.get(`${BASE_URL}/tree-new/1`);
    const tree = treeResponse.data;
    console.log(`Family tree root: ${tree.fullName || tree.firstName + ' ' + tree.lastName} (SerNo: ${tree.serNo})`);
    console.log(`Root has ${tree.children.length} immediate children`);
    if (tree.children.length > 0) {
      tree.children.forEach(child => {
        console.log(`- Child: ${child.fullName || child.firstName + ' ' + child.lastName} (SerNo: ${child.serNo}), has ${child.children.length} children`);
      });
    }
    console.log('');

    // Test 7: Get all relationship types
    console.log('7. Testing /relationship-types endpoint:');
    const typesResponse = await axios.get(`${BASE_URL}/relationship-types`);
    console.log(`Relationship types: ${typesResponse.data.join(', ')}`);
    console.log('');

    console.log('All tests completed successfully! ✅');

  } catch (error) {
    console.error('Error testing API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testNewAPI();