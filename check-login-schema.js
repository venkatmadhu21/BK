const mongoose = require('mongoose');
require('dotenv').config();

async function checkSchema() {
  try {
    console.log('Connecting...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bal-krishna-nivas');
    
    const db = mongoose.connection.db;
    
    console.log('\n=== Login Collection ===');
    const loginCol = db.collection('login');
    const loginCount = await loginCol.countDocuments();
    console.log('Total documents:', loginCount);
    
    if (loginCount > 0) {
      const sample = await loginCol.findOne();
      console.log('Sample document keys:', Object.keys(sample));
      console.log('Email field:', sample.email ? '✅ EXISTS' : '❌ MISSING');
      console.log('Sample record:', JSON.stringify(sample, null, 2));
    }
    
    console.log('\n=== Login (Capital L) Collection ===');
    const loginCapCol = db.collection('Login');
    const loginCapCount = await loginCapCol.countDocuments();
    console.log('Total documents:', loginCapCount);
    
    if (loginCapCount > 0) {
      const sample = await loginCapCol.findOne();
      console.log('Sample document keys:', Object.keys(sample));
      console.log('Email field:', sample.email ? '✅ EXISTS' : '❌ MISSING');
      console.log('Sample record:', JSON.stringify(sample, null, 2));
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkSchema();
