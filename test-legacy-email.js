const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const LegacyLogin = require('./server/models/LegacyLogin');
const LegacyLoginCap = require('./server/models/LegacyLoginCap');

async function testLegacyEmail() {
  try {
    console.log('🔍 Testing Email Field in Login Collections\n');
    
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/bal-krishna-nivas';
    console.log('📡 Connecting to:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    const testEmail = `test-legacy-${Date.now()}@example.com`;
    
    console.log('📝 Creating test record in LegacyLogin with data:');
    console.log('  Email:', testEmail);
    console.log('  Username: testuser_legacy');
    console.log('  Password: testpass123');
    console.log('\n');

    const credentials = {
      email: testEmail,
      username: 'testuser_legacy',
      password: 'testpass123',
      firstName: 'Test',
      lastName: 'Legacy',
      isActive: true
    };

    const savedRecord = await LegacyLogin.create(credentials);
    
    console.log('✅ Record saved! Check database:\n');
    console.log('Saved object:');
    console.log(JSON.stringify(savedRecord.toObject(), null, 2));
    console.log('\n');

    const foundRecord = await LegacyLogin.findById(savedRecord._id);
    console.log('✅ Retrieved from DB:\n');
    console.log(JSON.stringify(foundRecord.toObject(), null, 2));
    console.log('\n');

    if (foundRecord.email) {
      console.log('✅✅✅ EMAIL FIELD IS SAVED CORRECTLY!');
      console.log('Email:', foundRecord.email);
    } else {
      console.log('❌ EMAIL FIELD IS MISSING OR NULL!');
    }

    console.log('\n📊 Checking all records in LegacyLogin collection:');
    const allRecords = await LegacyLogin.find({});
    console.log('Total records:', allRecords.length);
    
    if (allRecords.length > 0) {
      console.log('\nFirst 3 records:');
      allRecords.slice(0, 3).forEach((rec, idx) => {
        console.log(`\n  Record ${idx + 1}:`);
        console.log(`    Email: ${rec.email || '[MISSING]'}`);
        console.log(`    Username: ${rec.username || '[MISSING]'}`);
        console.log(`    Password: ${rec.password || '[MISSING]'}`);
      });
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    await mongoose.connection.close();
    process.exit(1);
  }
}

testLegacyEmail();
