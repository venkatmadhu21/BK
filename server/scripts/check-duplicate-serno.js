/**
 * Script to check for and fix duplicate serNo/sNo issues in Member collection
 * Run with: node server/scripts/check-duplicate-serno.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Member = require('../models/Member');

async function checkDuplicates() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);

    console.log('\n📊 Checking for duplicate serNo and sNo values...\n');

    // Find all members
    const members = await Member.find({}).sort({ serNo: 1, sNo: 1 });
    console.log(`📌 Total members in database: ${members.length}\n`);

    // Check for serNo duplicates
    const serNoMap = {};
    const sNoMap = {};
    const duplicateSerNo = [];
    const duplicateSNo = [];
    const nullSerNo = [];
    const nullSNo = [];

    members.forEach(member => {
      const serNo = member.serNo;
      const sNo = member.sNo;
      const name = member.personalDetails?.firstName || 'Unknown';

      // Check serNo
      if (serNo === null || serNo === undefined) {
        nullSerNo.push({ id: member._id, name });
      } else {
        if (serNoMap[serNo]) {
          serNoMap[serNo].push({ id: member._id, name });
          if (!duplicateSerNo.includes(serNo)) duplicateSerNo.push(serNo);
        } else {
          serNoMap[serNo] = [{ id: member._id, name }];
        }
      }

      // Check sNo
      if (sNo === null || sNo === undefined) {
        nullSNo.push({ id: member._id, name });
      } else {
        if (sNoMap[sNo]) {
          sNoMap[sNo].push({ id: member._id, name });
          if (!duplicateSNo.includes(sNo)) duplicateSNo.push(sNo);
        } else {
          sNoMap[sNo] = [{ id: member._id, name }];
        }
      }
    });

    // Report findings
    console.log('📋 FINDINGS:\n');

    if (duplicateSerNo.length > 0) {
      console.log(`❌ DUPLICATE serNo VALUES FOUND (${duplicateSerNo.length}):`);
      duplicateSerNo.forEach(serNo => {
        console.log(`   serNo: ${serNo}`);
        serNoMap[serNo].forEach(member => {
          console.log(`     - ${member.name} (ID: ${member.id})`);
        });
      });
      console.log();
    } else {
      console.log('✅ No duplicate serNo values found\n');
    }

    if (duplicateSNo.length > 0) {
      console.log(`❌ DUPLICATE sNo VALUES FOUND (${duplicateSNo.length}):`);
      duplicateSNo.forEach(sNo => {
        console.log(`   sNo: ${sNo}`);
        sNoMap[sNo].forEach(member => {
          console.log(`     - ${member.name} (ID: ${member.id})`);
        });
      });
      console.log();
    } else {
      console.log('✅ No duplicate sNo values found\n');
    }

    if (nullSerNo.length > 0) {
      console.log(`⚠️  MEMBERS WITH NULL serNo (${nullSerNo.length}):`);
      nullSerNo.forEach(member => {
        console.log(`   - ${member.name} (ID: ${member.id})`);
      });
      console.log();
    }

    if (nullSNo.length > 0) {
      console.log(`⚠️  MEMBERS WITH NULL sNo (${nullSNo.length}):`);
      nullSNo.forEach(member => {
        console.log(`   - ${member.name} (ID: ${member.id})`);
      });
      console.log();
    }

    // Show max values
    const maxSerNo = Math.max(...members.filter(m => m.serNo).map(m => m.serNo), 0);
    const maxSNo = Math.max(...members.filter(m => m.sNo).map(m => m.sNo), 0);

    console.log(`📈 CURRENT MAX VALUES:`);
    console.log(`   Max serNo: ${maxSerNo}`);
    console.log(`   Max sNo: ${maxSNo}`);
    console.log(`   Next available: ${Math.max(maxSerNo, maxSNo) + 1}\n`);

    // Show sample data
    console.log('📝 SAMPLE MEMBERS:');
    members.slice(0, 5).forEach(member => {
      const name = member.personalDetails?.firstName || 'Unknown';
      console.log(`   serNo: ${member.serNo}, sNo: ${member.sNo}, Name: ${name}`);
    });

    if (duplicateSerNo.length === 0 && duplicateSNo.length === 0 && nullSerNo.length === 0 && nullSNo.length === 0) {
      console.log('\n✨ Database is clean - no duplicates or null values found!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

checkDuplicates();