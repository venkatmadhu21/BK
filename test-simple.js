const mongoose = require('mongoose');

async function test() {
  try {
    console.log('Starting test...');
    await mongoose.connect('mongodb://localhost:27017/bal-krishna-nivas', { 
      serverSelectionTimeoutMS: 5000 
    });
    
    console.log('Connected!');
    
    const LegacyLogin = require('./server/models/LegacyLogin');
    
    const testEmail = 'test' + Date.now() + '@example.com';
    console.log('\nSaving record with email:', testEmail);
    
    const record = await LegacyLogin.create({
      email: testEmail,
      username: 'testuser',
      password: 'pass123'
    });
    
    console.log('Created record ID:', record._id);
    console.log('Record email field:', record.email);
    console.log('Email is empty?', !record.email);
    
    const found = await LegacyLogin.findById(record._id);
    console.log('\nRetrieved record email:', found.email);
    console.log('Email is empty?', !found.email);
    
    if (found.email) {
      console.log('\n✅ EMAIL SAVED CORRECTLY');
    } else {
      console.log('\n❌ EMAIL NOT SAVED');
      console.log('Full record:', JSON.stringify(found, null, 2));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

test();
