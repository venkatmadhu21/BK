const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const User = require('../models/User');

async function run() {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/bal-krishna-nivas';
  console.log('Connecting to', mongoURI);
  await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

  const users = [
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'Admin@12345',
      gender: 'Male',
      role: 'admin',
      isAdmin: true
    },
    {
      firstName: 'Data',
      lastName: 'Operator',
      email: 'dataentry@example.com',
      password: 'Data@12345',
      gender: 'Male',
      role: 'dataentry',
      isAdmin: false
    }
  ];

  for (const u of users) {
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      console.log(`User already exists: ${u.email}`);
      continue;
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(u.password, salt);
    const doc = new User({ ...u, password: hashed });
    await doc.save();
    console.log(`Seeded user: ${u.email} (role=${u.role})`);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch(err => { console.error(err); process.exit(1); });