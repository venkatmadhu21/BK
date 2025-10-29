const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function dropUniqueIndexes() {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/bal-krishna-nivas';
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected\n');

    const db = mongoose.connection.db;

    // Drop indexes from 'login' collection
    try {
      const loginCollection = db.collection('login');
      const loginIndexes = await loginCollection.getIndexes();
      console.log('📋 Indexes on "login" collection:');
      Object.keys(loginIndexes).forEach(idx => console.log(`   ${idx}`));

      for (const indexName of Object.keys(loginIndexes)) {
        if (indexName !== '_id_') {
          try {
            await loginCollection.dropIndex(indexName);
            console.log(`✅ Dropped index: ${indexName}`);
          } catch (err) {
            console.log(`ℹ️ Could not drop ${indexName}: ${err.message}`);
          }
        }
      }
    } catch (err) {
      console.error('Error with login collection:', err.message);
    }

    // Drop indexes from 'Login' collection (capital L)
    try {
      const LoginCollection = db.collection('Login');
      const LoginIndexes = await LoginCollection.getIndexes();
      console.log('\n📋 Indexes on "Login" collection:');
      Object.keys(LoginIndexes).forEach(idx => console.log(`   ${idx}`));

      for (const indexName of Object.keys(LoginIndexes)) {
        if (indexName !== '_id_') {
          try {
            await LoginCollection.dropIndex(indexName);
            console.log(`✅ Dropped index: ${indexName}`);
          } catch (err) {
            console.log(`ℹ️ Could not drop ${indexName}: ${err.message}`);
          }
        }
      }
    } catch (err) {
      console.error('Error with Login collection:', err.message);
    }

    console.log('\n✅ All unique indexes removed! Multiple same emails allowed now.');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

dropUniqueIndexes();
