const mongoose = require('mongoose');
require('dotenv').config();

async function inspectRelationRules() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Try different collection names
    const collections = ['relationrules', 'relationRules', 'relation_rules'];
    
    for (const collName of collections) {
      try {
        const coll = mongoose.connection.db.collection(collName);
        const count = await coll.countDocuments();
        console.log(`\n=== Collection: ${collName} (${count} documents) ===`);
        
        if (count > 0) {
          const docs = await coll.find({}).limit(20).toArray();
          console.log('Sample documents:');
          docs.forEach((doc, idx) => {
            console.log(`${idx + 1}:`, JSON.stringify(doc, null, 2));
          });
          
          // Show unique fields
          const allFields = new Set();
          docs.forEach(doc => {
            Object.keys(doc).forEach(key => allFields.add(key));
          });
          console.log('All fields found:', Array.from(allFields));
        }
      } catch (e) {
        console.log(`Collection ${collName} not found or error:`, e.message);
      }
    }

    // Also check what collections exist
    const collections_list = await mongoose.connection.db.listCollections().toArray();
    console.log('\n=== All collections in database ===');
    collections_list.forEach(coll => {
      console.log(`- ${coll.name}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

inspectRelationRules();