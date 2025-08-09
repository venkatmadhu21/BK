const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/family';

async function testTreeDebug() {
  try {
    console.log('Testing tree endpoint with debug logging...\n');

    // Test family tree starting from member 1
    const treeResponse = await axios.get(`${BASE_URL}/tree-new/1`);
    const tree = treeResponse.data;
    console.log(`\n=== FINAL RESULT ===`);
    console.log(`Family tree root: ${tree.fullName} (SerNo: ${tree.serNo})`);
    console.log(`Root has ${tree.children.length} immediate children`);
    
    if (tree.children.length > 0) {
      tree.children.forEach(child => {
        console.log(`- Child: ${child.fullName} (SerNo: ${child.serNo}), has ${child.children.length} children`);
        if (child.children.length > 0) {
          child.children.forEach(grandchild => {
            console.log(`  - Grandchild: ${grandchild.fullName} (SerNo: ${grandchild.serNo}), has ${grandchild.children.length} children`);
          });
        }
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testTreeDebug();