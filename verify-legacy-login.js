const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'server/.env') });

const LegacyLogin = require('./server/models/LegacyLogin');
const LegacyLoginCap = require('./server/models/LegacyLoginCap');

async function verifyLegacyLogin() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📋 Checking legacy login collection (lowercase "login")...');
    const loginRecords = await LegacyLogin.find({});
    console.log(`Found ${loginRecords.length} records in 'login' collection:\n`);
    
    if (loginRecords.length > 0) {
      loginRecords.forEach((record, index) => {
        console.log(`[${index + 1}] Login Record:`);
        console.log(`  - Email: ${record.email}`);
        console.log(`  - Username: ${record.username || '❌ MISSING'}`);
        console.log(`  - First Name: ${record.firstName || '❌ MISSING'}`);
        console.log(`  - Last Name: ${record.lastName || '❌ MISSING'}`);
        console.log(`  - Serial No (serNo): ${record.serNo || '❌ MISSING'}`);
        console.log(`  - Serial No (serno): ${record.serno || '❌ MISSING'}`);
        console.log(`  - Password: ${record.password ? '✅ Present (plaintext)' : '❌ MISSING'}`);
        console.log(`  - Active: ${record.isActive}`);
        console.log(`  - Created: ${record.createdAt || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No records found in login collection');
    }

    console.log('📋 Checking legacy login collection (capital "Login")...');
    const LoginRecords = await LegacyLoginCap.find({});
    console.log(`Found ${LoginRecords.length} records in 'Login' collection:\n`);
    
    if (LoginRecords.length > 0) {
      LoginRecords.forEach((record, index) => {
        console.log(`[${index + 1}] Login Record:`);
        console.log(`  - Email: ${record.email}`);
        console.log(`  - Username: ${record.username || '❌ MISSING'}`);
        console.log(`  - First Name: ${record.firstName || '❌ MISSING'}`);
        console.log(`  - Last Name: ${record.lastName || '❌ MISSING'}`);
        console.log(`  - Serial No (serNo): ${record.serNo || '❌ MISSING'}`);
        console.log(`  - Serial No (serno): ${record.serno || '❌ MISSING'}`);
        console.log(`  - Password: ${record.password ? '✅ Present (plaintext)' : '❌ MISSING'}`);
        console.log(`  - Active: ${record.isActive}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No records found in Login collection');
    }

    console.log('\n✅ Verification complete!');
    console.log('All required fields for login: email, username, password, serNo/serno, firstName, lastName, isActive');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyLegacyLogin();