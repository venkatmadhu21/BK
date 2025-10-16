const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../.env' });

// Import the Member model
const Member = require('../models/Member');

// Connect to MongoDB and extract the data
const extractData = async () => {
  try {
    const mongoURI = 'mongodb://localhost:27017/bal-krishna-nivas';
    console.log(`Connecting to MongoDB at: ${mongoURI}`);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB Connected Successfully');
    
    // Check if there are any family members in the database
    const count = await Member.countDocuments();
    console.log(`Number of family members in the database: ${count}`);
    
    if (count > 0) {
      // Get all family members
      const allMembers = await Member.find().lean();
      console.log(`Retrieved ${allMembers.length} family members from the database`);
      
      // Convert to a format suitable for JavaScript
      const formattedData = JSON.stringify(allMembers, null, 2)
        .replace(/"_id":/g, '// "_id":')
        .replace(/"__v":/g, '// "__v":')
        .replace(/"createdAt":/g, '// "createdAt":')
        .replace(/"updatedAt":/g, '// "updatedAt":');
      
      // Write to a file
      const outputPath = path.join(__dirname, 'extracted-family-data.js');
      fs.writeFileSync(
        outputPath,
        `// Extracted from MongoDB database: bal-krishna-nivas, collection: members\n` +
        `// Connection String: mongodb://localhost:27017/bal-krishna-nivas\n` +
        `// Extracted on: ${new Date().toISOString()}\n\n` +
        `const familyData = ${formattedData};\n\n` +
        `module.exports = familyData;`
      );
      
      console.log(`Data extracted and saved to: ${outputPath}`);
      
      // Print a sample of the data
      console.log('\nSample of extracted data:');
      allMembers.slice(0, 3).forEach(member => {
        console.log(`- ${member.name} (SerNo: ${member.serNo}, Gender: ${member.gender}, Level: ${member.level})`);
      });
    } else {
      console.log('No family members found in the database.');
    }
    
  } catch (error) {
    console.error('Error extracting data:', error.message);
    console.error('Full error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the function
extractData();