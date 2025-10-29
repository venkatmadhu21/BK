/**
 * Script to fix duplicate serNo/sNo issues in Member collection
 * Run with: node server/scripts/fix-duplicate-serno.js
 * 
 * CAUTION: This script modifies the database. Backup first!
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Member = require('../models/Member');

async function fixDuplicates() {
  try {
    console.log('🔧 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);

    console.log('\n🔍 Analyzing Member collection...\n');

    // Get all members sorted by creation date
    const members = await Member.find({}).sort({ createdAt: 1 });
    console.log(`📌 Total members: ${members.length}\n`);

    // Assign sequential serNo and sNo
    console.log('🔄 Reassigning serNo and sNo values...\n');

    let fixedCount = 0;
    let errors = [];

    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      const newSerNo = i + 1;
      const newSNo = i + 1;

      try {
        // Check if this member's serNo or sNo is different
        if (member.serNo !== newSerNo || member.sNo !== newSNo) {
          const oldSerNo = member.serNo;
          const oldSNo = member.sNo;
          const name = member.personalDetails?.firstName || 'Unknown';

          // Update the member
          await Member.findByIdAndUpdate(
            member._id,
            { serNo: newSerNo, sNo: newSNo },
            { new: true }
          );

          console.log(
            `✅ Member "${name}": serNo ${oldSerNo}→${newSerNo}, sNo ${oldSNo}→${newSNo}`
          );
          fixedCount++;
        }
      } catch (error) {
        errors.push({
          memberId: member._id,
          name: member.personalDetails?.firstName || 'Unknown',
          error: error.message
        });
        console.error(
          `❌ Error updating member: ${error.message}`
        );
      }
    }

    console.log(`\n✨ Process Complete!`);
    console.log(`📊 Fixed: ${fixedCount} members`);
    console.log(`⚠️  Errors: ${errors.length}`);

    if (errors.length > 0) {
      console.log('\n❌ Failed updates:');
      errors.forEach(err => {
        console.log(`   - ${err.name}: ${err.error}`);
      });
    }

    // Verify the fix
    console.log('\n🔍 Verifying fixes...\n');
    const updatedMembers = await Member.find({}).sort({ serNo: 1 });
    
    let isValid = true;
    updatedMembers.forEach((member, index) => {
      const expectedNo = index + 1;
      if (member.serNo !== expectedNo || member.sNo !== expectedNo) {
        console.log(`⚠️  Mismatch at position ${index + 1}: serNo=${member.serNo}, sNo=${member.sNo}`);
        isValid = false;
      }
    });

    if (isValid) {
      console.log('✅ All members have sequential serNo and sNo values!');
      console.log(`📈 Range: 1 to ${updatedMembers.length}`);
    } else {
      console.log('⚠️  Some mismatches remain. Manual review recommended.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

async function promptUser() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(
      '⚠️  WARNING: This will reassign all serNo and sNo values. Backup your database first!\nProceed? (yes/no): ',
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
      }
    );
  });
}

async function main() {
  console.log('🛠️  Serial Number Fixer\n');
  const proceed = await promptUser();

  if (proceed) {
    await fixDuplicates();
  } else {
    console.log('\n❌ Operation cancelled.');
  }

  process.exit(0);
}

main();