const mongoose = require('mongoose');
require('dotenv').config();

async function migrateMember25() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/bal-krishna-nivas';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');

    // Get member 25 from familymembers collection
    const familyMember25 = await mongoose.connection.db.collection('familymembers').findOne({ serNo: 25 });
    
    if (!familyMember25) {
      console.log('Member 25 not found in familymembers collection');
      return;
    }

    console.log('Found member 25 in familymembers:', familyMember25.name);

    // Check if member 25 already exists in members collection
    const existingMember = await mongoose.connection.db.collection('members').findOne({ serNo: 25 });
    
    if (existingMember) {
      console.log('Member 25 already exists in members collection');
      return;
    }

    // Create the new member document for the members collection
    const newMember = {
      firstName: familyMember25.name.split(' ')[0] || 'Umesh',
      middleName: familyMember25.name.split(' ')[1] || 'B',
      lastName: familyMember25.name.split(' ')[2] || 'Gogte',
      vansh: familyMember25.vansh || '',
      gender: familyMember25.gender,
      serNo: familyMember25.serNo,
      sonDaughterCount: familyMember25.sonDaughterCount || 0,
      fatherSerNo: familyMember25.fatherSerNo || null,
      motherSerNo: familyMember25.motherSerNo || null,
      spouseSerNo: familyMember25.spouse ? familyMember25.spouse.serNo : null,
      childrenSerNos: familyMember25.childrenSerNos || [],
      level: familyMember25.level,
      dob: null,
      dod: null,
      profileImage: '',
      Bio: '',
      isAlive: true,
      maritalInfo: {
        married: familyMember25.spouse ? true : false,
        marriageDate: null,
        divorced: false,
        widowed: false,
        remarried: false
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert the new member
    const result = await mongoose.connection.db.collection('members').insertOne(newMember);
    console.log('Successfully migrated member 25 to members collection:', result.insertedId);

    // Also check if we need to migrate the spouse (serNo 26)
    if (familyMember25.spouse && familyMember25.spouse.serNo) {
      const spouseSerNo = familyMember25.spouse.serNo;
      const existingSpouse = await mongoose.connection.db.collection('members').findOne({ serNo: spouseSerNo });
      
      if (!existingSpouse) {
        const familySpouse = await mongoose.connection.db.collection('familymembers').findOne({ serNo: spouseSerNo });
        
        if (familySpouse) {
          const newSpouse = {
            firstName: familySpouse.name.split(' ')[0] || 'Wife',
            middleName: familySpouse.name.split(' ')[1] || 'Of',
            lastName: familySpouse.name.split(' ')[2] || 'Umesh',
            vansh: familySpouse.vansh || '',
            gender: familySpouse.gender,
            serNo: familySpouse.serNo,
            sonDaughterCount: familySpouse.sonDaughterCount || 0,
            fatherSerNo: familySpouse.fatherSerNo || null,
            motherSerNo: familySpouse.motherSerNo || null,
            spouseSerNo: 25, // Link back to member 25
            childrenSerNos: familySpouse.childrenSerNos || [],
            level: familySpouse.level,
            dob: null,
            dod: null,
            profileImage: '',
            Bio: '',
            isAlive: true,
            maritalInfo: {
              married: true,
              marriageDate: null,
              divorced: false,
              widowed: false,
              remarried: false
            },
            createdAt: new Date(),
            updatedAt: new Date()
          };

          const spouseResult = await mongoose.connection.db.collection('members').insertOne(newSpouse);
          console.log(`Successfully migrated spouse (serNo ${spouseSerNo}) to members collection:`, spouseResult.insertedId);
        }
      }
    }

    await mongoose.disconnect();
    console.log('Migration completed successfully!');

  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

migrateMember25();