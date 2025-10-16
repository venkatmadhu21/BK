const mongoose = require('mongoose');
const Member = require('../models/Member');

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/bal-krishna-nivas';
    console.log('Connecting to MongoDB at:', mongoURI);
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const analyzeData = async () => {
  try {
    await connectDB();
    
    const allMembers = await Member.find().sort({ serNo: 1 });
    console.log(`\nTotal family members: ${allMembers.length}`);
    
    // Create a map of existing serNos
    const existingSerNos = new Set(allMembers.map(m => m.serNo));
    console.log('Existing SerNos:', Array.from(existingSerNos).sort((a, b) => a - b));
    
    // Check for missing spouses
    console.log('\n=== SPOUSE ANALYSIS ===');
    const missingSpouses = [];
    const spouseIssues = [];
    
    for (const member of allMembers) {
      if (member.spouse && member.spouse.serNo) {
        if (!existingSerNos.has(member.spouse.serNo)) {
          missingSpouses.push({
            member: `${member.name} (${member.serNo})`,
            missingSpouse: `${member.spouse.name} (${member.spouse.serNo})`
          });
        } else {
          // Check if spouse name matches
          const spouseRecord = allMembers.find(m => m.serNo === member.spouse.serNo);
          if (spouseRecord && spouseRecord.name !== member.spouse.name) {
            spouseIssues.push({
              member: `${member.name} (${member.serNo})`,
              expectedSpouse: member.spouse.name,
              actualSpouse: spouseRecord.name,
              spouseSerNo: member.spouse.serNo
            });
          }
        }
      }
    }
    
    if (missingSpouses.length > 0) {
      console.log('Missing spouse records:');
      missingSpouses.forEach(issue => {
        console.log(`  - ${issue.member} references missing spouse: ${issue.missingSpouse}`);
      });
    }
    
    if (spouseIssues.length > 0) {
      console.log('Spouse name mismatches:');
      spouseIssues.forEach(issue => {
        console.log(`  - ${issue.member} expects spouse "${issue.expectedSpouse}" but found "${issue.actualSpouse}" (${issue.spouseSerNo})`);
      });
    }
    
    // Check for missing children
    console.log('\n=== CHILDREN ANALYSIS ===');
    const missingChildren = [];
    
    for (const member of allMembers) {
      if (member.childrenSerNos && member.childrenSerNos.length > 0) {
        const missingChildSerNos = member.childrenSerNos.filter(childSerNo => !existingSerNos.has(childSerNo));
        if (missingChildSerNos.length > 0) {
          missingChildren.push({
            parent: `${member.name} (${member.serNo})`,
            missingChildren: missingChildSerNos
          });
        }
      }
    }
    
    if (missingChildren.length > 0) {
      console.log('Missing children records:');
      missingChildren.forEach(issue => {
        console.log(`  - ${issue.parent} references missing children: ${issue.missingChildren.join(', ')}`);
      });
    }
    
    // Check parent-child relationships
    console.log('\n=== PARENT-CHILD RELATIONSHIP ANALYSIS ===');
    const relationshipIssues = [];
    
    for (const member of allMembers) {
      // Check if parents exist
      if (member.fatherSerNo && !existingSerNos.has(member.fatherSerNo)) {
        relationshipIssues.push(`${member.name} (${member.serNo}) references missing father: ${member.fatherSerNo}`);
      }
      if (member.motherSerNo && !existingSerNos.has(member.motherSerNo)) {
        relationshipIssues.push(`${member.name} (${member.serNo}) references missing mother: ${member.motherSerNo}`);
      }
      
      // Check if this member is listed in their parents' children arrays
      if (member.fatherSerNo) {
        const father = allMembers.find(m => m.serNo === member.fatherSerNo);
        if (father && (!father.childrenSerNos || !father.childrenSerNos.includes(member.serNo))) {
          relationshipIssues.push(`${member.name} (${member.serNo}) not listed in father's children: ${father.name} (${father.serNo})`);
        }
      }
    }
    
    if (relationshipIssues.length > 0) {
      console.log('Relationship issues:');
      relationshipIssues.forEach(issue => {
        console.log(`  - ${issue}`);
      });
    }
    
    // Show family tree structure
    console.log('\n=== FAMILY TREE STRUCTURE ===');
    const rootMembers = allMembers.filter(m => !m.fatherSerNo && !m.motherSerNo);
    console.log(`Root members (${rootMembers.length}):`);
    
    const printFamily = (member, indent = 0) => {
      const prefix = '  '.repeat(indent);
      const spouseInfo = member.spouse ? ` & ${member.spouse.name}` : '';
      console.log(`${prefix}- ${member.name} (${member.serNo})${spouseInfo} [Level ${member.level}]`);
      
      if (member.childrenSerNos && member.childrenSerNos.length > 0) {
        const children = allMembers.filter(m => member.childrenSerNos.includes(m.serNo));
        children.forEach(child => printFamily(child, indent + 1));
      }
    };
    
    rootMembers.forEach(root => printFamily(root));
    
    console.log('\n=== SUMMARY ===');
    console.log(`Total members: ${allMembers.length}`);
    console.log(`Missing spouses: ${missingSpouses.length}`);
    console.log(`Spouse name issues: ${spouseIssues.length}`);
    console.log(`Missing children: ${missingChildren.length}`);
    console.log(`Relationship issues: ${relationshipIssues.length}`);
    
  } catch (error) {
    console.error('Error analyzing data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

analyzeData();