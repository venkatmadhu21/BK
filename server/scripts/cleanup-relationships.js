const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/bal-krishna-nivas';
    console.log(`Attempting to connect to MongoDB at: ${mongoURI}`);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB Connected Successfully');
    
    // Get all members
    const membersCollection = mongoose.connection.db.collection('members');
    const members = await membersCollection.find().toArray();
    const existingSerNos = new Set(members.map(m => m.serNo));
    
    console.log(`Found ${members.length} members with SerNos: ${Array.from(existingSerNos).sort((a, b) => a - b).join(', ')}`);
    
    // Get all relationships
    const relationshipsCollection = mongoose.connection.db.collection('relationships');
    const relationships = await relationshipsCollection.find().toArray();
    
    console.log(`Found ${relationships.length} total relationships`);
    
    // Find invalid relationships (where either fromSerNo or toSerNo doesn't exist)
    const invalidRelationships = relationships.filter(rel => 
      !existingSerNos.has(rel.fromSerNo) || !existingSerNos.has(rel.toSerNo)
    );
    
    console.log(`Found ${invalidRelationships.length} invalid relationships:`);
    invalidRelationships.forEach(rel => {
      const fromExists = existingSerNos.has(rel.fromSerNo) ? '✓' : '✗';
      const toExists = existingSerNos.has(rel.toSerNo) ? '✓' : '✗';
      console.log(`  ${fromExists} ${rel.fromSerNo} -> ${toExists} ${rel.toSerNo}: ${rel.relation}`);
    });
    
    if (invalidRelationships.length > 0) {
      console.log(`\nRemoving ${invalidRelationships.length} invalid relationships...`);
      const invalidIds = invalidRelationships.map(rel => rel._id);
      const deleteResult = await relationshipsCollection.deleteMany({
        _id: { $in: invalidIds }
      });
      console.log(`Deleted ${deleteResult.deletedCount} invalid relationships`);
    }

    // Additional fix: remove incorrect spouse relationships and clear spouseSerNo for specific IDs
    const badPairs = [
      { a: 15, b: 16 }, // siblings mistakenly marked spouses
    ];

    let removed = 0;
    for (const { a, b } of badPairs) {
      const del = await relationshipsCollection.deleteMany({
        $or: [
          { fromSerNo: a, toSerNo: b, relation: { $in: ['Spouse', 'Husband', 'Wife'] } },
          { fromSerNo: b, toSerNo: a, relation: { $in: ['Spouse', 'Husband', 'Wife'] } }
        ]
      });
      removed += del.deletedCount || 0;
      // Clear spouseSerNo on both members
      await membersCollection.updateMany(
        { serNo: { $in: [a, b] } },
        { $set: { spouseSerNo: null, 'maritalInfo.married': false } }
      );
    }

    // Remove 19 ↔ 20 spouse if present; 19 should have no spouse
    const del1920 = await relationshipsCollection.deleteMany({
      $or: [
        { fromSerNo: 19, toSerNo: 20, relation: { $in: ['Spouse', 'Husband', 'Wife'] } },
        { fromSerNo: 20, toSerNo: 19, relation: { $in: ['Spouse', 'Husband', 'Wife'] } }
      ]
    });
    removed += del1920.deletedCount || 0;
    await membersCollection.updateOne(
      { serNo: 19 },
      { $set: { spouseSerNo: null, 'maritalInfo.married': false } }
    );
    // Don't force 20 if it doesn't exist; still clear if present
    await membersCollection.updateOne(
      { serNo: 20 },
      { $set: { spouseSerNo: null, 'maritalInfo.married': false } }
    );

    console.log(`Removed ${removed} incorrect spouse relationships for IDs 15,16 and 19,20`);
    
    // Verify the cleanup
    const remainingRelationships = await relationshipsCollection.find().toArray();
    console.log(`\nAfter cleanup: ${remainingRelationships.length} relationships remain`);
    
    // Show some sample valid relationships
    console.log('\nSample valid relationships:');
    remainingRelationships.slice(0, 10).forEach(rel => {
      console.log(`  ${rel.fromSerNo} -> ${rel.toSerNo}: ${rel.relation}`);
    });
    
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.error('Full error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

// Run the function
connectDB();