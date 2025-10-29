const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const User = require('./server/models/User');
const LegacyLogin = require('./server/models/LegacyLogin');

async function migrate() {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/bal-krishna-nivas';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('Connected!\n');

    const users = await User.find({});
    console.log(`Found ${users.length} users. Saving credentials...\n`);

    let saved = 0;
    for (const user of users) {
      try {
        await LegacyLogin.updateOne(
          { email: user.email.toLowerCase() },
          { $set: {
            email: user.email.toLowerCase(),
            username: user.username || `${user.firstName.toLowerCase()}_${user._id.toString().slice(-6)}`,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            isActive: user.isActive !== false
          }},
          { upsert: true }
        );
        saved++;
        console.log(`✅ ${user.email}`);
      } catch (err) {
        console.error(`❌ ${user.email}: ${err.message}`);
      }
    }

    const total = await LegacyLogin.countDocuments();
    console.log(`\n✅ Complete! Saved ${saved} credentials. Total in database: ${total}`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

migrate();
