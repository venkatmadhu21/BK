const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

// Direct connection without model
async function saveVenkatCredentials() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bal-krishna-nivas', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    });
    console.log('✅ Connected to MongoDB\n');

    const db = conn.connection.db;
    const loginCollection = db.collection('login');

    // Check if credentials already exist
    const existing = await loginCollection.findOne({ username: 'venkat_12' });
    
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
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await loginCollection.insertOne(credentials);
      
      console.log('✅ Credentials saved successfully!\n');
      console.log('📋 Saved Details:');
      console.log(`   ID: ${result.insertedId}`);
      console.log(`   Email: ${credentials.email}`);
      console.log(`   Username: ${credentials.username}`);
      console.log(`   Password: ${credentials.password}`);
      console.log(`   SerNo: ${credentials.serNo}`);
      console.log(`   First Name: ${credentials.firstName}`);
      console.log(`   Last Name: ${credentials.lastName}`);
      console.log(`   Is Active: ${credentials.isActive}\n`);
      
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