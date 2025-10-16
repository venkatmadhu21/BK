const mongoose = require('mongoose');
require('dotenv').config();

// Import the Member model
const Member = require('./models/Member');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bal-krishna-nivas', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => {
  console.error('Database connection error:', err.message);
  process.exit(1);
});

// Helper function to generate profile picture URL based on gender and serNo
const getProfilePicture = (gender, serNo) => {
  // Use a deterministic approach to assign profile pictures
  // This ensures the same person always gets the same picture
  const maleCount = 8; // Number of male profile pictures available
  const femaleCount = 8; // Number of female profile pictures available
  
  if (gender === 'Male') {
    const index = (serNo % maleCount) + 1; // 1-8
    return `/images/profiles/male${index}.jpg`;
  } else {
    const index = (serNo % femaleCount) + 1; // 1-8
    return `/images/profiles/female${index}.jpg`;
  }
};

// Sample family data
const familyData = [
  {
    name: "Ramkrishna Gogte",
    vansh: "01RK",
    gender: "Male",
    serNo: 1,
    sonDaughterCount: 2,
    spouse: { name: "Wife Of Ramkrishna Gogte", serNo: 2 },
    level: 1,
    childrenSerNos: [3, 5],
    profilePicture: getProfilePicture('Male', 1)
  },
  {
    name: "Wife Of Ramkrishna Gogte",
    vansh: "01RK",
    gender: "Female",
    serNo: 2,
    sonDaughterCount: 2,
    spouse: { name: "Ramkrishna Gogte", serNo: 1 },
    level: 1,
    childrenSerNos: [3, 5],
    profilePicture: getProfilePicture('Female', 2)
  },
  {
    name: "Balkrishna R Gogte",
    vansh: "02BK",
    gender: "Male",
    serNo: 3,
    sonDaughterCount: 3,
    spouse: { name: "Wife Of Balkrishna R Gogte", serNo: 4 },
    fatherSerNo: 1,
    motherSerNo: 2,
    level: 2,
    childrenSerNos: [7, 9, 11]
  },
  {
    name: "Wife Of Balkrishna R Gogte",
    vansh: "02BK",
    gender: "Female",
    serNo: 4,
    sonDaughterCount: 3,
    spouse: { name: "Balkrishna R Gogte", serNo: 3 },
    level: 2,
    childrenSerNos: [7, 9, 11]
  },
  {
    name: "Madhav R Gogte",
    vansh: "03MG",
    gender: "Male",
    serNo: 5,
    sonDaughterCount: 2,
    spouse: { name: "Wife Of Madhav R Gogte", serNo: 6 },
    fatherSerNo: 1,
    motherSerNo: 2,
    level: 2,
    childrenSerNos: [13, 15]
  },
  {
    name: "Wife Of Madhav R Gogte",
    vansh: "03MG",
    gender: "Female",
    serNo: 6,
    sonDaughterCount: 2,
    spouse: { name: "Madhav R Gogte", serNo: 5 },
    level: 2,
    childrenSerNos: [13, 15]
  },
  {
    name: "Vishnu B Gogte",
    vansh: "04VB",
    gender: "Male",
    serNo: 7,
    sonDaughterCount: 2,
    spouse: { name: "Wife Of Vishnu B Gogte", serNo: 8 },
    fatherSerNo: 3,
    motherSerNo: 4,
    level: 3,
    childrenSerNos: [17, 19]
  },
  {
    name: "Wife Of Vishnu B Gogte",
    vansh: "04VB",
    gender: "Female",
    serNo: 8,
    sonDaughterCount: 2,
    spouse: { name: "Vishnu B Gogte", serNo: 7 },
    level: 3,
    childrenSerNos: [17, 19]
  },
  {
    name: "Narayan B Gogte",
    vansh: "05NB",
    gender: "Male",
    serNo: 9,
    sonDaughterCount: 2,
    spouse: { name: "Wife Of Narayan B Gogte", serNo: 10 },
    fatherSerNo: 3,
    motherSerNo: 4,
    level: 3,
    childrenSerNos: [21, 23]
  },
  {
    name: "Wife Of Narayan B Gogte",
    vansh: "05NB",
    gender: "Female",
    serNo: 10,
    sonDaughterCount: 2,
    spouse: { name: "Narayan B Gogte", serNo: 9 },
    level: 3,
    childrenSerNos: [21, 23]
  },
  {
    name: "Govind B Gogte",
    vansh: "06GB",
    gender: "Male",
    serNo: 11,
    sonDaughterCount: 2,
    spouse: { name: "Wife Of Govind B Gogte", serNo: 12 },
    fatherSerNo: 3,
    motherSerNo: 4,
    level: 3,
    childrenSerNos: [25, 27]
  },
  {
    name: "Wife Of Govind B Gogte",
    vansh: "06GB",
    gender: "Female",
    serNo: 12,
    sonDaughterCount: 2,
    spouse: { name: "Govind B Gogte", serNo: 11 },
    level: 3,
    childrenSerNos: [25, 27]
  },
  {
    name: "Bhaskar M Gogte",
    vansh: "07BM",
    gender: "Male",
    serNo: 13,
    sonDaughterCount: 2,
    spouse: { name: "Wife Of Bhaskar M Gogte", serNo: 14 },
    fatherSerNo: 5,
    motherSerNo: 6,
    level: 3,
    childrenSerNos: [29, 31]
  },
  {
    name: "Wife Of Bhaskar M Gogte",
    vansh: "07BM",
    gender: "Female",
    serNo: 14,
    sonDaughterCount: 2,
    spouse: { name: "Bhaskar M Gogte", serNo: 13 },
    level: 3,
    childrenSerNos: [29, 31]
  },
  {
    name: "Dattatreya M Gogte",
    vansh: "08DM",
    gender: "Male",
    serNo: 15,
    sonDaughterCount: 2,
    fatherSerNo: 5,
    motherSerNo: 6,
    level: 3,
    childrenSerNos: [33, 35]
  },
  {
    name: "Wife Of Dattatreya M Gogte",
    vansh: "08DM",
    gender: "Female",
    serNo: 16,
    sonDaughterCount: 2,
    level: 3,
    childrenSerNos: [33, 35]
  },
  {
    name: "Umesh B Gogte",
    vansh: "06MW",
    gender: "Male",
    serNo: 27,
    sonDaughterCount: 3,
    spouse: { name: "Wife Of Umesh B Gogte", serNo: 26 },
    fatherSerNo: 13,
    motherSerNo: 14,
    level: 4,
    childrenSerNos: [41, 43, 45]
  },
  {
    name: "Wife Of Umesh B Gogte",
    vansh: "06MW",
    gender: "Female",
    serNo: 26,
    sonDaughterCount: 3,
    spouse: { name: "Umesh B Gogte", serNo: 27 },
    level: 4,
    childrenSerNos: [41, 43, 45]
  },
  {
    name: "Rahul U Gogte",
    vansh: "06MW",
    gender: "Male",
    serNo: 41,
    sonDaughterCount: 0,
    fatherSerNo: 27,
    motherSerNo: 26,
    level: 5
  },
  {
    name: "Rohit U Gogte",
    vansh: "06MW",
    gender: "Male",
    serNo: 43,
    sonDaughterCount: 0,
    fatherSerNo: 27,
    motherSerNo: 26,
    level: 5
  },
  {
    name: "Riya U Gogte",
    vansh: "06MW",
    gender: "Female",
    serNo: 45,
    sonDaughterCount: 0,
    fatherSerNo: 27,
    motherSerNo: 26,
    level: 5
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Member.deleteMany({});
    console.log('Cleared existing family members');

    // Add profile pictures to all family members
    const enhancedFamilyData = familyData.map(member => {
      if (!member.profilePicture) {
        member.profilePicture = getProfilePicture(member.gender, member.serNo);
      }
      return member;
    });

    // Insert new data
    await Member.insertMany(enhancedFamilyData);
    console.log(`Added ${enhancedFamilyData.length} family members to the database`);

    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();