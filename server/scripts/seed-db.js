const mongoose = require('mongoose');
const Member = require('../models/Member');
require('dotenv').config({ path: '../.env' });

// Import the family data from the seed route
const familyData = require('../routes/seed-data');

// Connect to MongoDB and seed the database
const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/bal-krishna-nivas';
    console.log(`Attempting to connect to MongoDB at: ${mongoURI}`);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB Connected Successfully');
    
    // Clear existing data
    await Member.deleteMany({});
    console.log('Cleared existing family members');

    // Insert new data
    await Member.insertMany(familyData);
    console.log(`Added ${familyData.length} family members to the database`);
    
    // Verify the data was inserted
    const count = await Member.countDocuments();
    console.log(`Number of family members in the database: ${count}`);
    
  } catch (error) {
    console.error('Error seeding database:', error.message);
    console.error('Full error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the function
seedDB();