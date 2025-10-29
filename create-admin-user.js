const mongoose = require('mongoose');
const path = require('path');
const bcryptjs = require('bcryptjs');
require('dotenv').config({ path: path.resolve(__dirname, 'server/.env') });

const User = require('./server/models/User');
const LegacyLogin = require('./server/models/LegacyLogin');

async function createAdminUser() {
  try {
    console.log('🔐 Creating Admin User...\n');
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected\n');

    // Check if admin already exists
    let admin = await User.findOne({ username: 'admin_1' });

    if (admin) {
      console.log('ℹ️  Admin user already exists');
      console.log(`   - Username: ${admin.username}`);
      console.log(`   - Email: ${admin.email}`);
      console.log(`   - IsAdmin: ${admin.isAdmin}`);
    } else {
      console.log('📝 Creating new admin user...');
      
      // Hash password
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash('admin1234', salt);

      // Create admin user
      admin = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin123@gmail.com',
        username: 'admin_1',
        password: hashedPassword,
        gender: 'Male',
        role: 'admin',
        isAdmin: true,
        isActive: true
      });

      await admin.save();
      console.log('✅ Admin user created successfully');
      console.log(`   - Username: ${admin.username}`);
      console.log(`   - Email: ${admin.email}`);
      console.log(`   - Password: admin1234 (hashed)`);
      console.log(`   - Role: ${admin.role}`);
      console.log(`   - IsAdmin: ${admin.isAdmin}\n`);
    }

    // Also create in legacy login table for compatibility
    console.log('📝 Creating legacy login record...');
    let legacyAdmin = await LegacyLogin.findOne({ username: 'admin_1' });

    if (legacyAdmin) {
      console.log('ℹ️  Legacy login record already exists');
    } else {
      legacyAdmin = await LegacyLogin.create({
        email: 'admin123@gmail.com',
        username: 'admin_1',
        password: 'admin1234', // plaintext for legacy
        serNo: 1,
        serno: 1,
        firstName: 'Admin',
        lastName: 'User',
        isActive: true
      });
      console.log('✅ Legacy login record created');
      console.log(`   - Email: ${legacyAdmin.email}`);
      console.log(`   - Username: ${legacyAdmin.username}`);
      console.log(`   - Password: admin1234 (plaintext)\n`);
    }

    console.log('═══════════════════════════════════════');
    console.log('🎉 Admin Setup Complete!');
    console.log('═══════════════════════════════════════');
    console.log('Login Credentials:');
    console.log('  Username: admin_1');
    console.log('  Password: admin1234');
    console.log('═══════════════════════════════════════\n');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdminUser();