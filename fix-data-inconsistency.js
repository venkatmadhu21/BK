const mongoose = require('mongoose');
const FamilyMember = require('./server/models/FamilyMember');
const Member = require('./server/models/Member');
require('dotenv').config();

async function fixDataInconsistency() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bal-krishna-nivas');
    console.log('Connected to MongoDB');

    // Get all members from familymembers collection
    const familyMembers = await FamilyMember.find({}).sort({ serNo: 1 });
    console.log(`Found ${familyMembers.length} members in familymembers collection`);

    // Get all members from members collection
    const members = await Member.find({}).sort({ serNo: 1 });
    console.log(`Found ${members.length} members in members collection`);

    // Find missing members in the members collection
    const memberSerNos = new Set(members.map(m => m.serNo));
    const missingMembers = familyMembers.filter(fm => !memberSerNos.has(fm.serNo));

    console.log('\nMissing members in the members collection:');
    missingMembers.forEach(member => {
      console.log(`- serNo ${member.serNo}: ${member.name}`);
    });

    if (missingMembers.length > 0) {
      console.log('\nWould you like to:');
      console.log('1. Migrate missing members from familymembers to members collection');
      console.log('2. Remove references to missing members from familymembers collection');
      console.log('3. Just show the analysis (no changes)');
      
      // For now, just show the analysis
      console.log('\nAnalysis complete. No changes made.');
      console.log('To fix the 404 errors, you need to either:');
      console.log('- Add the missing members to the members collection, OR');
      console.log('- Update frontend components to use consistent data sources');
    }

    // Check for inconsistent spouse references
    console.log('\nChecking for spouse reference inconsistencies...');
    for (const familyMember of familyMembers) {
      if (familyMember.spouse && familyMember.spouse.serNo) {
        const spouseExists = memberSerNos.has(familyMember.spouse.serNo);
        if (!spouseExists) {
          console.log(`⚠️  Member ${familyMember.serNo} (${familyMember.name}) references spouse serNo ${familyMember.spouse.serNo} which doesn't exist in members collection`);
        }
      }
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixDataInconsistency();