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
    
    // Check members collection
    const membersCollection = mongoose.connection.db.collection('members');
    const membersCount = await membersCollection.countDocuments();
    console.log(`\nMembers collection count: ${membersCount}`);
    
    if (membersCount > 0) {
      const sampleMembers = await membersCollection.find().limit(5).toArray();
      console.log('\nSample members:');
      sampleMembers.forEach(member => {
        console.log(`- ID: ${member._id}, Data:`, JSON.stringify(member, null, 2));
      });
    }
    
    // Check relationships collection
    const relationshipsCollection = mongoose.connection.db.collection('relationships');
    const relationshipsCount = await relationshipsCollection.countDocuments();
    console.log(`\nRelationships collection count: ${relationshipsCount}`);
    
    if (relationshipsCount > 0) {
      const sampleRelationships = await relationshipsCollection.find().limit(10).toArray();
      console.log('\nSample relationships:');
      sampleRelationships.forEach(rel => {
        console.log(`- ID: ${rel._id}, Data:`, JSON.stringify(rel, null, 2));
      });
    }
    
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