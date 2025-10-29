const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const User = require('./server/models/User');
const LegacyLogin = require('./server/models/LegacyLogin');

async function fixCredentials() {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/bal-krishna-nivas';
    console.log('🔗 Connecting...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected\n');

    // Drop the old unique index on email
    try {
      const collection = mongoose.connection.collection('login');
      const indexes = await collection.getIndexes();
      console.log('📋 Current indexes:', Object.keys(indexes));
      
      // Drop email_1 unique index if it exists
      if (indexes.email_1) {
        await collection.dropIndex('email_1');
        console.log('🗑️ Dropped old email_1 unique index\n');
      }
    } catch (indexErr) {
      console.log('ℹ️ Index cleanup note:', indexErr.message);
    }

    // Now save all credentials
    const users = await User.find({});
    console.log(`📊 Processing ${users.length} users...\n`);

    let saved = 0;
    for (const user of users) {
      try {
        const result = await LegacyLogin.updateOne(
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
    console.log(`\n✅ Done! Saved: ${saved} | Total in login table: ${total}`);
    
    // Show samples
    const samples = await LegacyLogin.find().limit(2).lean();
    if (samples.length > 0) {
      console.log('\n📝 Sample records saved:');
      samples.forEach(s => {
        console.log(`   ${s.email} | username: ${s.username}`);
      });
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

fixCredentials();
