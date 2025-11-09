const mongoose = require('mongoose');
const path = require('path');
console.log('MONGO_URI before dotenv:', process.env.MONGO_URI);
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env'), override: true });

console.log('Loaded MONGO_URI from env:', process.env.MONGO_URI);

// Import the Member model
const Member = require('../models/Member');
const User = require('../models/User');
const LegacyLogin = require('../models/LegacyLogin');
const LegacyLoginCap = require('../models/LegacyLoginCap');

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
    
    // Log the database name to confirm we're connected to the right database
    const dbName = mongoose.connection.db.databaseName;
    console.log(`Connected to database: ${dbName}`);
    
    // Log the collections to confirm the familymembers collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Check if there are any family members in the database
    const count = await Member.countDocuments();
    console.log(`Number of family members in the database: ${count}`);

    const userCount = await User.countDocuments();
    console.log(`Number of users in the database: ${userCount}`);

    const legacyLoginCount = await LegacyLogin.countDocuments();
    console.log(`Legacy login records in login collection: ${legacyLoginCount}`);

    const legacyLoginCapCount = await LegacyLoginCap.countDocuments();
    console.log(`Legacy login records in Login collection: ${legacyLoginCapCount}`);
    
    const users = await User.find().limit(5);
    console.log('Sample users:', users.map(u => ({ email: u.email, username: u.username, isAdmin: u.isAdmin, isActive: u.isActive })));

    const legacySample = await LegacyLogin.find().limit(5);
    console.log('Sample legacy login (login collection):', legacySample.map(l => ({ email: l.email, username: l.username, isActive: l.isActive })));

    const legacyCapSample = await LegacyLoginCap.find().limit(5);
    console.log('Sample legacy login (Login collection):', legacyCapSample.map(l => ({ email: l.email, username: l.username, isActive: l.isActive })));
    
    if (count > 0) {
      // Get a sample of family members
      const sampleMembers = await Member.find().limit(5);
      console.log('Sample family members:');
      sampleMembers.forEach(member => {
        console.log(`- ${member.name} (SerNo: ${member.serNo}, Gender: ${member.gender}, Level: ${member.level})`);
      });
      
      // Check the root member (serNo: 1)
      const rootMember = await Member.findOne({ serNo: 1 });
      if (rootMember) {
        console.log('\nRoot member:');
        console.log(`- ${rootMember.firstName} ${rootMember.lastName} (SerNo: ${rootMember.serNo}, Gender: ${rootMember.gender})`);
      } else {
        console.log('\nRoot member (serNo: 1) not found!');
      }
    } else {
      console.log('No family members found in the database. Please run the seed script.');
    }
    
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.error('Full error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the function
connectDB();