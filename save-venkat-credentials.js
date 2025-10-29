const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

const LegacyLogin = require('./server/models/LegacyLogin');

async function saveVenkatCredentials() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bal-krishna-nivas');
    console.log('✅ Connected to MongoDB\n');

    // Check if credentials already exist
    const existing = await LegacyLogin.findOne({ username: 'venkat_12' });
    
    if (existing) {
      console.log('⚠️  Credentials for venkat_12 already exist in database:');
      console.log(`   Email: ${existing.email}`);
      console.log(`   Username: ${existing.username}`);
      console.log(`   SerNo: ${existing.serNo}`);
      console.log(`   Password: ${existing.password}`);
    } else {
      console.log('📝 Creating credentials for venkat_12...\n');
      
      const credentials = {
        email: 'venkat@example.com',
        username: 'venkat_12',
        password: '^X4h7d4mreIQ', // plaintext for legacy system
        serNo: 12,
        serno: 12,
        firstName: 'Venkat',
        lastName: 'Kumar',
        isActive: true
      };

      const legacyLogin = await LegacyLogin.create(credentials);
      
      console.log('✅ Credentials saved successfully!\n');
      console.log('📋 Saved Details:');
      console.log(`   Email: ${legacyLogin.email}`);
      console.log(`   Username: ${legacyLogin.username}`);
      console.log(`   Password: ${legacyLogin.password}`);
      console.log(`   SerNo: ${legacyLogin.serNo}`);
      console.log(`   First Name: ${legacyLogin.firstName}`);
      console.log(`   Last Name: ${legacyLogin.lastName}`);
      console.log(`   Is Active: ${legacyLogin.isActive}\n`);
      
      console.log('🔑 Login Credentials:');
      console.log(`   Username: venkat_12`);
      console.log(`   Password: ^X4h7d4mreIQ\n`);
      
      console.log('✨ You can now login with these credentials!');
    }

    await mongoose.connection.close();
    console.log('\n✅ Done! Connection closed.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

saveVenkatCredentials();