
const express = require('express');
const Member = require('../models/Member');
const router = express.Router();

// Use the exact data structure from the MongoDB database
// This data structure matches what's in the bal-krishna-nivas database, familymembers collection
const familyData = [
  // Level 1 - Root
  {
    name: "Ramkrishna Gogte",
    vansh: "Gogte",
    gender: "Male",
    serNo: 1,
    sonDaughterCount: 2,
    spouse: { name: "Saraswati Gogte", serNo: 2 },
    level: 1,
    childrenSerNos: [3, 5],
    biography: "Founder of the Gogte family lineage in Bal-Krishna Nivas.",
    dateOfBirth: new Date("1900-01-15")
  },
  {
    name: "Saraswati Gogte",
    vansh: "Gogte",
    gender: "Female",
    serNo: 2,
    sonDaughterCount: 2,
    spouse: { name: "Ramkrishna Gogte", serNo: 1 },
    level: 1,
    childrenSerNos: [3, 5],
    dateOfBirth: new Date("1905-03-20")
  },
  
  // Level 2 - Children of Ramkrishna
  {
    name: "Balkrishna R Gogte",
    vansh: "Gogte",
    gender: "Male",
    serNo: 3,
    sonDaughterCount: 3,
    spouse: { name: "Laxmi B Gogte", serNo: 4 },
    fatherSerNo: 1,
    motherSerNo: 2,
    level: 2,
    childrenSerNos: [7, 9, 11],
    biography: "Eldest son of Ramkrishna Gogte, established the eastern branch of the family.",
    dateOfBirth: new Date("1925-06-10")
  },
  {
    name: "Laxmi B Gogte",
    vansh: "Gogte",
    gender: "Female",
    serNo: 4,
    sonDaughterCount: 3,
    spouse: { name: "Balkrishna R Gogte", serNo: 3 },
    level: 2,
    childrenSerNos: [7, 9, 11],
    dateOfBirth: new Date("1928-09-05")
  },
  {
    name: "Madhav R Gogte",
    vansh: "Gogte",
    gender: "Male",
    serNo: 5,
    sonDaughterCount: 2,
    spouse: { name: "Sushila M Gogte", serNo: 6 },
    fatherSerNo: 1,
    motherSerNo: 2,
    level: 2,
    childrenSerNos: [13, 15],
    biography: "Younger son of Ramkrishna Gogte, established the western branch of the family.",
    dateOfBirth: new Date("1930-11-22")
  },
  {
    name: "Sushila M Gogte",
    vansh: "Gogte",
    gender: "Female",
    serNo: 6,
    sonDaughterCount: 2,
    spouse: { name: "Madhav R Gogte", serNo: 5 },
    level: 2,
    childrenSerNos: [13, 15],
    dateOfBirth: new Date("1932-04-15")
  },
  
  // Level 3 - Grandchildren (Balkrishna's children)
  {
    name: "Vishnu B Gogte",
    vansh: "Gogte",
    gender: "Male",
    serNo: 7,
    sonDaughterCount: 2,
    spouse: { name: "Shanta V Gogte", serNo: 8 },
    fatherSerNo: 3,
    motherSerNo: 4,
    level: 3,
    childrenSerNos: [17, 19],
    occupation: "Doctor",
    dateOfBirth: new Date("1950-02-18")
  },
  {
    name: "Shanta V Gogte",
    vansh: "Gogte",
    gender: "Female",
    serNo: 8,
    sonDaughterCount: 2,
    spouse: { name: "Vishnu B Gogte", serNo: 7 },
    level: 3,
    childrenSerNos: [17, 19],
    dateOfBirth: new Date("1953-07-30")
  },
  {
    name: "Narayan B Gogte",
    vansh: "Gogte",
    gender: "Male",
    serNo: 9,
    sonDaughterCount: 2,
    spouse: { name: "Radha N Gogte", serNo: 10 },
    fatherSerNo: 3,
    motherSerNo: 4,
    level: 3,
    childrenSerNos: [21, 23],
    occupation: "Engineer",
    dateOfBirth: new Date("1952-05-12")
  },
  {
    name: "Radha N Gogte",
    vansh: "Gogte",
    gender: "Female",
    serNo: 10,
    sonDaughterCount: 2,
    spouse: { name: "Narayan B Gogte", serNo: 9 },
    level: 3,
    childrenSerNos: [21, 23],
    dateOfBirth: new Date("1955-10-08")
  },
  {
    name: "Govind B Gogte",
    vansh: "Gogte",
    gender: "Male",
    serNo: 11,
    sonDaughterCount: 2,
    spouse: { name: "Savitri G Gogte", serNo: 12 },
    fatherSerNo: 3,
    motherSerNo: 4,
    level: 3,
    childrenSerNos: [25, 27],
    occupation: "Businessman",
    dateOfBirth: new Date("1955-12-03")
  },
  {
    name: "Savitri G Gogte",
    vansh: "Gogte",
    gender: "Female",
    serNo: 12,
    sonDaughterCount: 2,
    spouse: { name: "Govind B Gogte", serNo: 11 },
    level: 3,
    childrenSerNos: [25, 27],
    dateOfBirth: new Date("1958-03-25")
  },
  
  // Level 3 - Grandchildren (Madhav's children)
  {
    name: "Bhaskar M Gogte",
    vansh: "Gogte",
    gender: "Male",
    serNo: 13,
    sonDaughterCount: 2,
    spouse: { name: "Anjali B Gogte", serNo: 14 },
    fatherSerNo: 5,
    motherSerNo: 6,
    level: 3,
    childrenSerNos: [29, 31],
    occupation: "Professor",
    dateOfBirth: new Date("1954-08-17")
  },
  {
    name: "Anjali B Gogte",
    vansh: "Gogte",
    gender: "Female",
    serNo: 14,
    sonDaughterCount: 2,
    spouse: { name: "Bhaskar M Gogte", serNo: 13 },
    level: 3,
    childrenSerNos: [29, 31],
    dateOfBirth: new Date("1957-01-22")
  },
  {
    name: "Dattatreya M Gogte",
    vansh: "Gogte",
    gender: "Male",
    serNo: 15,
    sonDaughterCount: 2,
    fatherSerNo: 5,
    motherSerNo: 6,
    level: 3,
    childrenSerNos: [33, 35],
    occupation: "Government Officer",
    dateOfBirth: new Date("1956-11-09")
  },
  {
    name: "Malati D Gogte",
    vansh: "Gogte",
    gender: "Female",
    serNo: 16,
    sonDaughterCount: 2,
    level: 3,
    childrenSerNos: [33, 35],
    dateOfBirth: new Date("1959-06-14")
  },
  
  // Level 4 - Great-grandchildren (Vishnu's children)
  {
    name: "Rajesh V Gogte",
    vansh: "Gogte",
    gender: "Male",
    serNo: 17,
    sonDaughterCount: 1,
    spouse: { name: "Priya R Gogte", serNo: 18 },
    fatherSerNo: 7,
    motherSerNo: 8,
    level: 4,
    childrenSerNos: [37],
    occupation: "Software Engineer",
    dateOfBirth: new Date("1975-04-28")
  },
  {
    name: "Priya R Gogte",
    vansh: "Gogte",
    gender: "Female",
    serNo: 18,
    sonDaughterCount: 1,
    spouse: { name: "Rajesh V Gogte", serNo: 17 },
    level: 4,
    childrenSerNos: [37],
    occupation: "Teacher",
    dateOfBirth: new Date("1978-09-12")
  },
  {
    name: "Sunita V Gogte",
    vansh: "Gogte",
    gender: "Female",
    serNo: 19,
    sonDaughterCount: 0,
    fatherSerNo: 7,
    motherSerNo: 8,
    level: 4,
    occupation: "Doctor",
    dateOfBirth: new Date("1977-12-05")
  },
  
  // Level 4 - Great-grandchildren (Narayan's children)
  {
    name: "Suresh N Gogte",
    vansh: "Gogte",
    gender: "Male",
    serNo: 21,
    sonDaughterCount: 2,
    spouse: { name: "Deepa S Gogte", serNo: 22 },
    fatherSerNo: 9,
    motherSerNo: 10,
    level: 4,
    childrenSerNos: [39, 40],
    occupation: "Architect",
    dateOfBirth: new Date("1976-07-19")
  },
  {
    name: "Deepa S Gogte",
    vansh: "Gogte",
    gender: "Female",
    serNo: 22,
    sonDaughterCount: 2,
    spouse: { name: "Suresh N Gogte", serNo: 21 },
    level: 4,
    childrenSerNos: [39, 40],
    occupation: "Homemaker",
    dateOfBirth: new Date("1979-03-08")
  },
  {
    name: "Anita N Gogte",
    vansh: "Gogte",
    gender: "Female",
    serNo: 23,
    sonDaughterCount: 0,
    fatherSerNo: 9,
    motherSerNo: 10,
    level: 4,
    occupation: "Lawyer",
    dateOfBirth: new Date("1978-10-30")
  },
  
  // Level 4 - Great-grandchildren (Govind's children)
  {
    name: "Prakash G Gogte",
    vansh: "Gogte",
    gender: "Male",
    serNo: 25,
    sonDaughterCount: 0,
    fatherSerNo: 11,
    motherSerNo: 12,
    level: 4,
    occupation: "Businessman",
    dateOfBirth: new Date("1980-02-14")
  },
  {
    name: "Umesh G Gogte",
    vansh: "Gogte",
    gender: "Male",
    serNo: 27,
    sonDaughterCount: 3,
    spouse: { name: "Vaishali U Gogte", serNo: 28 },
    fatherSerNo: 11,
    motherSerNo: 12,
    level: 4,
    childrenSerNos: [41, 43, 45],
    occupation: "Manager",
    dateOfBirth: new Date("1982-05-27")
  },
  {
    name: "Vaishali U Gogte",
    vansh: "Gogte",
    gender: "Female",
    serNo: 28,
    sonDaughterCount: 3,
    spouse: { name: "Umesh G Gogte", serNo: 27 },
    level: 4,
    childrenSerNos: [41, 43, 45],
    occupation: "Teacher",
    dateOfBirth: new Date("1985-11-03")
  },
  
  // Level 4 - Great-grandchildren (Bhaskar's children)
  {
    name: "Vinod B Gogte",
    vansh: "Gogte",
    gender: "Male",
    serNo: 29,
    sonDaughterCount: 0,
    fatherSerNo: 13,
    motherSerNo: 14,
    level: 4,
    occupation: "Professor",
    dateOfBirth: new Date("1979-08-09")
  },
  {
    name: "Meena B Gogte",
    vansh: "Gogte",
    gender: "Female",
    serNo: 31,
    sonDaughterCount: 0,
    fatherSerNo: 13,
    motherSerNo: 14,
    level: 4,
    occupation: "Scientist",
    dateOfBirth: new Date("1981-12-17")
  },
  
  // Level 4 - Great-grandchildren (Dattatreya's children)
  {
    name: "Sanjay D Gogte",
    vansh: "Gogte",
    gender: "Male",
    serNo: 33,
    sonDaughterCount: 0,
    fatherSerNo: 15,
    motherSerNo: 16,
    level: 4,
    occupation: "Civil Servant",
    dateOfBirth: new Date("1980-06-22")
  },
  {
    name: "Vijay D Gogte",
    vansh: "Gogte",
    gender: "Male",
    serNo: 35,
    sonDaughterCount: 0,
    fatherSerNo: 15,
    motherSerNo: 16,
    level: 4,
    occupation: "Engineer",
    dateOfBirth: new Date("1982-09-14")
  },
  
  // Level 5 - Great-great-grandchildren
  {
    name: "Aditya R Gogte",
    vansh: "Gogte",
    gender: "Male",
    serNo: 37,
    sonDaughterCount: 0,
    fatherSerNo: 17,
    motherSerNo: 18,
    level: 5,
    occupation: "Student",
    dateOfBirth: new Date("2000-03-15")
  },
  {
    name: "Neha S Gogte",
    vansh: "Gogte",
    gender: "Female",
    serNo: 39,
    sonDaughterCount: 0,
    fatherSerNo: 21,
    motherSerNo: 22,
    level: 5,
    occupation: "Student",
    dateOfBirth: new Date("2002-07-08")
  },
  {
    name: "Nikhil S Gogte",
    vansh: "Gogte",
    gender: "Male",
    serNo: 40,
    sonDaughterCount: 0,
    fatherSerNo: 21,
    motherSerNo: 22,
    level: 5,
    occupation: "Student",
    dateOfBirth: new Date("2005-11-23")
  },
  {
    name: "Rahul U Gogte",
    vansh: "Gogte",
    gender: "Male",
    serNo: 41,
    sonDaughterCount: 0,
    fatherSerNo: 27,
    motherSerNo: 28,
    level: 5,
    occupation: "Student",
    dateOfBirth: new Date("2003-04-12")
  },
  {
    name: "Rohit U Gogte",
    vansh: "Gogte",
    gender: "Male",
    serNo: 43,
    sonDaughterCount: 0,
    fatherSerNo: 27,
    motherSerNo: 28,
    level: 5,
    occupation: "Student",
    dateOfBirth: new Date("2005-08-30")
  },
  {
    name: "Riya U Gogte",
    vansh: "Gogte",
    gender: "Female",
    serNo: 45,
    sonDaughterCount: 0,
    fatherSerNo: 27,
    motherSerNo: 28,
    level: 5,
    occupation: "Student",
    dateOfBirth: new Date("2008-01-17")
  }
];

// @route   GET api/seed
// @desc    Seed the database with sample family data
// @access  Public (for development only)
router.get('/', async (req, res) => {
  try {
    // Clear existing data
    await Member.deleteMany({});
    console.log('Cleared existing family members');

    // Insert new data
    await Member.insertMany(familyData);
    console.log(`Added ${familyData.length} family members to the database`);

    res.json({ message: `Database seeded with ${familyData.length} family members` });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;