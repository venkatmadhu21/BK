const express = require('express');
const FamilyMember = require('../models/FamilyMember');
const Member = require('../models/Member');
const Relationship = require('../models/Relationship');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @route   GET api/family
// @desc    Get all family members
// @access  Public (temporarily for testing)
router.get('/', async (req, res) => {
  try {
    const familyMembers = await FamilyMember.find()
      .sort({ level: 1, serNo: 1 });
    
    res.json(familyMembers);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/family/member/:serNo
// @desc    Get family member by serial number
// @access  Public (temporarily for testing)
router.get('/member/:serNo', async (req, res) => {
  try {
    const serNo = parseInt(req.params.serNo);
    const familyMember = await FamilyMember.findOne({ serNo });

    if (!familyMember) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    res.json(familyMember);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/family/member/:serNo/children
// @desc    Get all children of a family member
// @access  Public (temporarily for testing)
router.get('/member/:serNo/children', async (req, res) => {
  try {
    const serNo = parseInt(req.params.serNo);
    const familyMember = await FamilyMember.findOne({ serNo });

    if (!familyMember) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    const children = await FamilyMember.find({ 
      serNo: { $in: familyMember.childrenSerNos } 
    });

    res.json(children);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/family/member/:serNo/parents
// @desc    Get parents of a family member
// @access  Public (temporarily for testing)
router.get('/member/:serNo/parents', async (req, res) => {
  try {
    const serNo = parseInt(req.params.serNo);
    const familyMember = await FamilyMember.findOne({ serNo });

    if (!familyMember) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    const father = await FamilyMember.findOne({ serNo: familyMember.fatherSerNo });
    const mother = await FamilyMember.findOne({ serNo: familyMember.motherSerNo });

    const parents = {
      father: father || null,
      mother: mother || null
    };

    res.json(parents);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/family/tree/:serNo
// @desc    Get full descendant tree of a family member
// @access  Public (temporarily for testing)
router.get('/tree/:serNo', async (req, res) => {
  try {
    const serNo = parseInt(req.params.serNo);
    console.log(`Fetching family tree for serNo: ${serNo}`);
    
    const rootMember = await FamilyMember.findOne({ serNo });

    if (!rootMember) {
      console.log(`Family member with serNo ${serNo} not found`);
      return res.status(404).json({ message: 'Family member not found' });
    }
    
    console.log(`Found root member: ${rootMember.name} (${rootMember.serNo})`);
    console.log(`Children SerNos: ${rootMember.childrenSerNos.join(', ')}`);

    // Recursive function to build the family tree
    async function buildFamilyTree(member) {
      if (!member.childrenSerNos || member.childrenSerNos.length === 0) {
        console.log(`Member ${member.name} (${member.serNo}) has no children`);
        return [];
      }
      
      console.log(`Finding children for ${member.name} (${member.serNo}): ${member.childrenSerNos.join(', ')}`);
      
      const children = await FamilyMember.find({ 
        serNo: { $in: member.childrenSerNos } 
      }).sort({ serNo: 1 });
      
      console.log(`Found ${children.length} children for ${member.name} (${member.serNo})`);

      const childrenWithDescendants = [];
      for (const child of children) {
        console.log(`Processing child: ${child.name} (${child.serNo})`);
        const childWithDescendants = child.toObject();
        childWithDescendants.children = await buildFamilyTree(child);
        childrenWithDescendants.push(childWithDescendants);
      }

      return childrenWithDescendants;
    }

    const rootWithDescendants = rootMember.toObject();
    rootWithDescendants.children = await buildFamilyTree(rootMember);
    
    console.log(`Returning family tree with root: ${rootWithDescendants.name} (${rootWithDescendants.serNo})`);
    console.log(`Root has ${rootWithDescendants.children.length} immediate children`);

    res.json(rootWithDescendants);
  } catch (error) {
    console.error('Error building family tree:', error);
    res.status(500).send('Server error');
  }
});

// @route   GET api/family/members
// @desc    Get family members by level
// @access  Public (temporarily for testing)
router.get('/members', async (req, res) => {
  try {
    const { level } = req.query;
    
    let query = {};
    if (level) {
      query.level = parseInt(level);
    }
    
    const familyMembers = await FamilyMember.find(query)
      .sort({ serNo: 1 });
    
    res.json(familyMembers);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/family/raw-data
// @desc    Get all family members with their raw data structure
// @access  Public (temporarily for testing)
router.get('/raw-data', async (req, res) => {
  try {
    console.log('Fetching raw family data from database');
    
    const familyMembers = await FamilyMember.find()
      .sort({ serNo: 1 });
    
    console.log(`Found ${familyMembers.length} family members`);
    
    // Log a sample of the data
    if (familyMembers.length > 0) {
      const sample = familyMembers[0].toObject();
      console.log('Sample data structure:', JSON.stringify(sample, null, 2));
    }
    
    res.json(familyMembers);
  } catch (error) {
    console.error('Error fetching raw data:', error);
    res.status(500).send('Server error');
  }
});

// @route   POST api/family
// @desc    Add family member
// @access  Public (temporarily for testing)
router.post('/', [
  body('name', 'Name is required').notEmpty(),
  body('gender', 'Gender is required').isIn(['Male', 'Female']),
  body('serNo', 'Serial number is required').isNumeric(),
  body('level', 'Level is required').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name,
      vansh,
      gender,
      serNo,
      sonDaughterCount,
      spouse,
      fatherSerNo,
      motherSerNo,
      childrenSerNos,
      level,
      dateOfBirth,
      dateOfDeath,
      profilePicture,
      occupation,
      biography,
      achievements,
      address
    } = req.body;

    // Check if serNo already exists
    const existingMember = await FamilyMember.findOne({ serNo });
    if (existingMember) {
      return res.status(400).json({ message: 'Serial number already exists' });
    }

    const familyMember = new FamilyMember({
      name,
      vansh,
      gender,
      serNo,
      sonDaughterCount: sonDaughterCount || 0,
      spouse,
      fatherSerNo,
      motherSerNo,
      childrenSerNos: childrenSerNos || [],
      level,
      dateOfBirth,
      dateOfDeath,
      profilePicture,
      occupation,
      biography,
      achievements,
      address
    });

    await familyMember.save();

    // Update parent's children array if parents exist
    if (fatherSerNo) {
      await FamilyMember.findOneAndUpdate(
        { serNo: fatherSerNo },
        { $addToSet: { childrenSerNos: serNo } }
      );
    }
    if (motherSerNo) {
      await FamilyMember.findOneAndUpdate(
        { serNo: motherSerNo },
        { $addToSet: { childrenSerNos: serNo } }
      );
    }

    res.json(familyMember);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/family/member/:serNo
// @desc    Update family member
// @access  Public (temporarily for testing)
router.put('/member/:serNo', async (req, res) => {
  try {
    const serNo = parseInt(req.params.serNo);
    const familyMember = await FamilyMember.findOneAndUpdate(
      { serNo },
      { $set: req.body },
      { new: true }
    );

    if (!familyMember) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    res.json(familyMember);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/family/member/:serNo
// @desc    Delete family member
// @access  Public (temporarily for testing)
router.delete('/member/:serNo', async (req, res) => {
  try {
    const serNo = parseInt(req.params.serNo);
    const familyMember = await FamilyMember.findOne({ serNo });

    if (!familyMember) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    // Remove from parent's children array
    if (familyMember.fatherSerNo) {
      await FamilyMember.findOneAndUpdate(
        { serNo: familyMember.fatherSerNo },
        { $pull: { childrenSerNos: serNo } }
      );
    }
    if (familyMember.motherSerNo) {
      await FamilyMember.findOneAndUpdate(
        { serNo: familyMember.motherSerNo },
        { $pull: { childrenSerNos: serNo } }
      );
    }

    await FamilyMember.findOneAndDelete({ serNo });

    res.json({ message: 'Family member deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// ========================================
// NEW ROUTES USING MEMBERS AND RELATIONSHIPS COLLECTIONS
// ========================================

// @route   GET api/family/members-new
// @desc    Get all members from the new members collection
// @access  Public
router.get('/members-new', async (req, res) => {
  try {
    const members = await Member.find()
      .sort({ level: 1, serNo: 1 });
    
    res.json(members);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/family/member-new/:serNo
// @desc    Get member by serial number from new collection
// @access  Public
router.get('/member-new/:serNo', async (req, res) => {
  try {
    console.log('GET /member-new/:serNo - serNo param:', req.params.serNo);
    
    const serNoParam = req.params.serNo;
    const serNo = parseInt(serNoParam);
    
    // Check if serNo parameter is valid
    if (!serNoParam || serNoParam === 'undefined' || serNoParam === 'null' || isNaN(serNo) || serNo <= 0) {
      console.error('Invalid serNo parameter:', serNoParam, 'parsed to:', serNo);
      return res.status(400).json({ message: 'Invalid serNo parameter' });
    }
    
    console.log('Looking for member with serNo:', serNo);
    const member = await Member.findOne({ serNo });

    if (!member) {
      console.log('Member not found with serNo:', serNo);
      return res.status(404).json({ message: 'Member not found' });
    }

    console.log('Found member:', member.fullName || member.firstName);
    res.json(member);
  } catch (error) {
    console.error('Error in /member-new/:serNo:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET api/family/relationships/:serNo
// @desc    Get all relationships for a member
// @access  Public
router.get('/relationships/:serNo', async (req, res) => {
  try {
    const serNo = parseInt(req.params.serNo);
    const relationships = await Relationship.findRelationshipsFor(serNo);
    
    res.json(relationships);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/family/member-new/:serNo/children
// @desc    Get all children of a member using relationships
// @access  Public
router.get('/member-new/:serNo/children', async (req, res) => {
  try {
    console.log('GET /member-new/:serNo/children - serNo param:', req.params.serNo);
    
    const serNoParam = req.params.serNo;
    
    // Check if serNo parameter is valid before parsing
    if (!serNoParam || serNoParam === 'undefined' || serNoParam === 'null') {
      console.error('Invalid serNo parameter:', serNoParam);
      return res.status(400).json({ message: 'Invalid serNo parameter' });
    }
    
    const serNo = parseInt(serNoParam);
    
    if (isNaN(serNo) || serNo <= 0) {
      console.error('Invalid serNo parameter after parsing:', serNoParam, '->', serNo);
      return res.status(400).json({ message: 'Invalid serNo parameter' });
    }
    
    // Find all relationships where this member is a father
    const childRelationships = await Relationship.find({
      fromSerNo: serNo,
      relation: 'father'
    });
    
    console.log(`Found ${childRelationships.length} child relationships for serNo ${serNo}`);
    
    // Get unique child serNos
    const childSerNos = [...new Set(childRelationships.map(rel => rel.toSerNo))];
    
    // Get the actual member data for children
    const children = await Member.find({ 
      serNo: { $in: childSerNos } 
    }).sort({ serNo: 1 });

    console.log(`Found ${children.length} children for serNo ${serNo}`);
    res.json(children);
  } catch (error) {
    console.error('Error in /member-new/:serNo/children:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET api/family/member-new/:serNo/parents
// @desc    Get parents of a member using relationships
// @access  Public
router.get('/member-new/:serNo/parents', async (req, res) => {
  try {
    console.log('GET /member-new/:serNo/parents - serNo param:', req.params.serNo);
    
    const serNoParam = req.params.serNo;
    
    // Check if serNo parameter is valid before parsing
    if (!serNoParam || serNoParam === 'undefined' || serNoParam === 'null') {
      console.error('Invalid serNo parameter:', serNoParam);
      return res.status(400).json({ message: 'Invalid serNo parameter' });
    }
    
    const serNo = parseInt(serNoParam);
    
    if (isNaN(serNo) || serNo <= 0) {
      console.error('Invalid serNo parameter after parsing:', serNoParam, '->', serNo);
      return res.status(400).json({ message: 'Invalid serNo parameter' });
    }
    
    // Find parent relationships
    const parentRelationships = await Relationship.find({
      toSerNo: serNo,
      relation: { $in: ['father', 'mother'] }
    });
    
    console.log(`Found ${parentRelationships.length} parent relationships for serNo ${serNo}`);
    
    let father = null;
    let mother = null;
    
    for (const rel of parentRelationships) {
      if (rel.relation === 'father') {
        father = await Member.findOne({ serNo: rel.fromSerNo });
      } else if (rel.relation === 'mother') {
        mother = await Member.findOne({ serNo: rel.fromSerNo });
      }
    }

    const parents = { father, mother };
    console.log(`Found parents for serNo ${serNo}:`, { 
      father: father?.fullName || father?.firstName, 
      mother: mother?.fullName || mother?.firstName 
    });
    res.json(parents);
  } catch (error) {
    console.error('Error in /member-new/:serNo/parents:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET api/family/member-new/:serNo/spouse
// @desc    Get spouse of a member using relationships
// @access  Public
router.get('/member-new/:serNo/spouse', async (req, res) => {
  try {
    const serNo = parseInt(req.params.serNo);
    
    // Find spouse relationship
    const spouseRelationship = await Relationship.findSpouse(serNo);
    
    let spouse = null;
    if (spouseRelationship) {
      spouse = await Member.findOne({ serNo: spouseRelationship.toSerNo });
    }

    res.json(spouse);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/family/tree-new/:serNo
// @desc    Get full descendant tree using new collections
// @access  Public
router.get('/tree-new/:serNo', async (req, res) => {
  try {
    const serNo = parseInt(req.params.serNo);
    console.log(`Fetching family tree for serNo: ${serNo} using new collections`);
    
    const rootMember = await Member.findOne({ serNo });

    if (!rootMember) {
      console.log(`Member with serNo ${serNo} not found`);
      return res.status(404).json({ message: 'Member not found' });
    }
    
    console.log(`Found root member: ${rootMember.fullName} (${rootMember.serNo})`);

    // Recursive function to build the family tree using relationships
    async function buildFamilyTreeNew(member) {
      // Find all children using relationships - look for where this member is a father
      const childRelationships = await Relationship.find({
        fromSerNo: member.serNo,
        relation: 'father'
      });
      
      // Get unique child serNos
      const childSerNos = [...new Set(childRelationships.map(rel => rel.toSerNo))];
      
      if (childSerNos.length === 0) {
        return [];
      }
      
      // Get the actual member data for children
      const children = await Member.find({ 
        serNo: { $in: childSerNos } 
      }).sort({ serNo: 1 });

      const childrenWithDescendants = [];
      for (const child of children) {
        const childWithDescendants = child.toObject();
        childWithDescendants.children = await buildFamilyTreeNew(child);
        childrenWithDescendants.push(childWithDescendants);
      }

      return childrenWithDescendants;
    }

    const rootWithDescendants = rootMember.toObject();
    rootWithDescendants.children = await buildFamilyTreeNew(rootMember);
    
    console.log(`Returning family tree with root: ${rootWithDescendants.fullName} (${rootWithDescendants.serNo})`);
    console.log(`Root has ${rootWithDescendants.children.length} immediate children`);

    res.json(rootWithDescendants);
  } catch (error) {
    console.error('Error building family tree:', error);
    res.status(500).send('Server error');
  }
});

// @route   GET api/family/members-by-level-new
// @desc    Get members by level from new collection
// @access  Public
router.get('/members-by-level-new', async (req, res) => {
  try {
    const { level } = req.query;
    
    let query = {};
    if (level) {
      query.level = parseInt(level);
    }
    
    const members = await Member.find(query)
      .sort({ serNo: 1 });
    
    res.json(members);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/family/raw-data-new
// @desc    Get all members with their raw data structure from new collection
// @access  Public
router.get('/raw-data-new', async (req, res) => {
  try {
    console.log('Fetching raw family data from new members collection');
    
    const members = await Member.find()
      .sort({ serNo: 1 });
    
    console.log(`Found ${members.length} members`);
    
    // Log a sample of the data
    if (members.length > 0) {
      const sample = members[0].toObject();
      console.log('Sample data structure:', JSON.stringify(sample, null, 2));
    }
    
    res.json(members);
  } catch (error) {
    console.error('Error fetching raw data:', error);
    res.status(500).send('Server error');
  }
});

// @route   GET api/family/all-relationships
// @desc    Get all relationships
// @access  Public
router.get('/all-relationships', async (req, res) => {
  try {
    const relationships = await Relationship.find()
      .sort({ fromSerNo: 1, toSerNo: 1 });
    
    res.json(relationships);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/family/relationship-types
// @desc    Get all unique relationship types
// @access  Public
router.get('/relationship-types', async (req, res) => {
  try {
    const relationshipTypes = await Relationship.distinct('relation');
    res.json(relationshipTypes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;