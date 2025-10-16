const express = require('express');

const Member = require('../models/Member');
const Relationship = require('../models/Relationship');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { buildMembersIndex, buildRelationRulesMap, getRelationsForSerNo } = require('../utils/relationEngine');

const router = express.Router();

// @route   GET api/family
// @desc    Get all family members (migrated to use Members collection)
// @access  Public (temporarily for testing)
router.get('/', async (req, res) => {
  try {
    const members = await Member.find()
      .sort({ level: 1, serNo: 1 });
    
    res.json(members);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/family/member/:serNo
// @desc    Get family member by serial number (migrated to use Members collection)
// @access  Public (temporarily for testing)
router.get('/member/:serNo', async (req, res) => {
  try {
    const serNo = parseInt(req.params.serNo);
    const member = await Member.findOne({ serNo });

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/family/member/:serNo/children
// @desc    Get all children of a family member (migrated to use Members collection and Relationships)
// @access  Public (temporarily for testing)
router.get('/member/:serNo/children', async (req, res) => {
  try {
    const serNo = parseInt(req.params.serNo);
    
    // Find all relationships where this member is a parent (Son/Daughter relationships FROM parent TO children)
    const childRelationships = await Relationship.find({
      fromSerNo: serNo,
      relation: { $in: ['Son', 'Daughter'] }
    });
    
    // Get unique child serNos
    const childSerNos = [...new Set(childRelationships.map(rel => rel.toSerNo))];
    
    // Get the actual member data for children
    const children = await Member.find({ 
      serNo: { $in: childSerNos } 
    }).sort({ serNo: 1 });

    res.json(children);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/family/member/:serNo/parents
// @desc    Get parents of a family member (migrated to use Members collection and Relationships)
// @access  Public (temporarily for testing)
router.get('/member/:serNo/parents', async (req, res) => {
  try {
    const serNo = parseInt(req.params.serNo);
    
    // Find parent relationships (Father/Mother relationships FROM children TO parents)
    const parentRelationships = await Relationship.find({
      fromSerNo: serNo,
      relation: { $in: ['Father', 'Mother'] }
    });
    
    let father = null;
    let mother = null;
    
    for (const rel of parentRelationships) {
      if (rel.relation === 'Father') {
        father = await Member.findOne({ serNo: rel.toSerNo });
      } else if (rel.relation === 'Mother') {
        mother = await Member.findOne({ serNo: rel.toSerNo });
      }
    }

    const parents = { father, mother };
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
    
    const rootMember = await Member.findOne({ serNo });

    if (!rootMember) {
      console.log(`Family member with serNo ${serNo} not found`);
      return res.status(404).json({ message: 'Family member not found' });
    }
    
    const memberName = rootMember.fullName || `${rootMember.firstName} ${rootMember.lastName}`.trim();
    console.log(`Found root member: ${memberName} (${rootMember.serNo})`);

    // Recursive function to build the family tree using relationships
    async function buildFamilyTree(member) {
      // Find children relationships for this member
      const childRelationships = await Relationship.find({
        fromSerNo: member.serNo,
        relation: { $in: ['Son', 'Daughter'] }
      });
      
      if (childRelationships.length === 0) {
        console.log(`Member ${memberName} (${member.serNo}) has no children`);
        return [];
      }
      
      const childSerNos = childRelationships.map(rel => rel.toSerNo);
      console.log(`Finding children for ${memberName} (${member.serNo}): ${childSerNos.join(', ')}`);
      
      const children = await Member.find({ 
        serNo: { $in: childSerNos } 
      }).sort({ serNo: 1 });
      
      console.log(`Found ${children.length} children for ${memberName} (${member.serNo})`);

      const childrenWithDescendants = [];
      for (const child of children) {
        const childName = child.fullName || `${child.firstName} ${child.lastName}`.trim();
        console.log(`Processing child: ${childName} (${child.serNo})`);
        const childWithDescendants = child.toObject();
        // Add name field for backward compatibility
        childWithDescendants.name = childName;
        childWithDescendants.children = await buildFamilyTree(child);
        childrenWithDescendants.push(childWithDescendants);
      }

      return childrenWithDescendants;
    }

    const rootWithDescendants = rootMember.toObject();
    // Add name field for backward compatibility
    rootWithDescendants.name = memberName;
    rootWithDescendants.children = await buildFamilyTree(rootMember);
    
    console.log(`Returning family tree with root: ${memberName} (${rootWithDescendants.serNo})`);
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

    const familyMembers = await Member.find(query)
      .sort({ level: 1, serNo: 1 });

    res.json(familyMembers);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});



// @route   POST api/family
// @desc    Add family member
// @access  Public (temporarily for testing)
router.post('/', [
  body('firstName', 'First name is required').notEmpty(),
  body('lastName', 'Last name is required').notEmpty(),
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
      firstName,
      middleName,
      lastName,
      name, // For backward compatibility
      vansh,
      gender,
      serNo,
      sonDaughterCount,
      spouseSerNo,
      fatherSerNo,
      motherSerNo,
      childrenSerNos,
      level,
      dob,
      dod,
      dateOfBirth, // For backward compatibility
      dateOfDeath, // For backward compatibility
      profileImage,
      profilePicture, // For backward compatibility
      Bio,
      biography, // For backward compatibility
      isAlive,
      maritalInfo
    } = req.body;

    // Check if serNo already exists
    const existingMember = await Member.findOne({ serNo });
    if (existingMember) {
      return res.status(400).json({ message: 'Serial number already exists' });
    }

    // Handle name parsing for backward compatibility
    let finalFirstName = firstName;
    let finalLastName = lastName;
    let finalMiddleName = middleName || '';

    if (!firstName && name) {
      // Parse the old 'name' field
      const nameParts = name.trim().split(' ');
      finalFirstName = nameParts[0] || '';
      finalLastName = nameParts[nameParts.length - 1] || '';
      if (nameParts.length > 2) {
        finalMiddleName = nameParts.slice(1, -1).join(' ');
      }
    }

    const member = new Member({
      firstName: finalFirstName,
      middleName: finalMiddleName,
      lastName: finalLastName,
      vansh,
      gender,
      serNo,
      sonDaughterCount: sonDaughterCount || 0,
      spouseSerNo,
      fatherSerNo,
      motherSerNo,
      childrenSerNos: childrenSerNos || [],
      level,
      dob: dob || dateOfBirth,
      dod: dod || dateOfDeath,
      profileImage: profileImage || profilePicture || '',
      Bio: Bio || biography || '',
      isAlive: isAlive !== undefined ? isAlive : (dod || dateOfDeath ? false : true),
      maritalInfo: maritalInfo || {
        married: !!spouseSerNo,
        marriageDate: null,
        divorced: false,
        widowed: false,
        remarried: false
      }
    });

    await member.save();

    // Create relationships in the Relationship collection
    if (fatherSerNo) {
      // Create father-child relationship
      await new Relationship({
        fromSerNo: fatherSerNo,
        toSerNo: serNo,
        relation: gender === 'Male' ? 'Son' : 'Daughter'
      }).save();
      
      // Create child-father relationship
      await new Relationship({
        fromSerNo: serNo,
        toSerNo: fatherSerNo,
        relation: 'Father'
      }).save();
    }

    if (motherSerNo) {
      // Create mother-child relationship
      await new Relationship({
        fromSerNo: motherSerNo,
        toSerNo: serNo,
        relation: gender === 'Male' ? 'Son' : 'Daughter'
      }).save();
      
      // Create child-mother relationship
      await new Relationship({
        fromSerNo: serNo,
        toSerNo: motherSerNo,
        relation: 'Mother'
      }).save();
    }

    if (spouseSerNo) {
      // Create spouse relationships (bidirectional)
      await new Relationship({
        fromSerNo: serNo,
        toSerNo: spouseSerNo,
        relation: 'Spouse'
      }).save();
      
      await new Relationship({
        fromSerNo: spouseSerNo,
        toSerNo: serNo,
        relation: 'Spouse'
      }).save();
    }

    res.json(member);
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
    
    // Handle backward compatibility for name field
    const updateData = { ...req.body };
    if (updateData.name && !updateData.firstName && !updateData.lastName) {
      const nameParts = updateData.name.trim().split(' ');
      updateData.firstName = nameParts[0] || '';
      updateData.lastName = nameParts[nameParts.length - 1] || '';
      if (nameParts.length > 2) {
        updateData.middleName = nameParts.slice(1, -1).join(' ');
      }
      delete updateData.name;
    }
    
    // Handle backward compatibility for date fields
    if (updateData.dateOfBirth) {
      updateData.dob = updateData.dateOfBirth;
      delete updateData.dateOfBirth;
    }
    if (updateData.dateOfDeath) {
      updateData.dod = updateData.dateOfDeath;
      delete updateData.dateOfDeath;
    }
    
    // Handle backward compatibility for profile picture
    if (updateData.profilePicture) {
      updateData.profileImage = updateData.profilePicture;
      delete updateData.profilePicture;
    }
    
    // Handle backward compatibility for biography
    if (updateData.biography) {
      updateData.Bio = updateData.biography;
      delete updateData.biography;
    }

    const member = await Member.findOneAndUpdate(
      { serNo },
      { $set: updateData },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    res.json(member);
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
    const member = await Member.findOne({ serNo });

    if (!member) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    // Delete all relationships involving this member
    await Relationship.deleteMany({
      $or: [
        { fromSerNo: serNo },
        { toSerNo: serNo }
      ]
    });

    // Delete the member
    await Member.findOneAndDelete({ serNo });

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
    
    // Find all relationships where this member is a parent (Son/Daughter relationships FROM parent TO children)
    const childRelationships = await Relationship.find({
      fromSerNo: serNo,
      relation: { $in: ['Son', 'Daughter'] }
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
    
    // Find parent relationships (Father/Mother relationships FROM children TO parents)
    const parentRelationships = await Relationship.find({
      fromSerNo: serNo,
      relation: { $in: ['Father', 'Mother'] }
    });
    
    console.log(`Found ${parentRelationships.length} parent relationships for serNo ${serNo}`);
    
    let father = null;
    let mother = null;
    
    for (const rel of parentRelationships) {
      if (rel.relation === 'Father') {
        father = await Member.findOne({ serNo: rel.toSerNo });
      } else if (rel.relation === 'Mother') {
        mother = await Member.findOne({ serNo: rel.toSerNo });
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
    const depthParam = parseInt(req.query.depth || '6', 10);
    const MAX_DEPTH = 10;
    const targetDepth = Number.isFinite(depthParam) ? Math.min(Math.max(depthParam, 1), MAX_DEPTH) : 6;
    console.log(`Fetching family tree for serNo: ${serNo} using new collections (depth=${targetDepth})`);

    const rootMember = await Member.findOne({ serNo });

    if (!rootMember) {
      console.log(`Member with serNo ${serNo} not found`);
      return res.status(404).json({ message: 'Member not found' });
    }

    console.log(`Found root member: ${rootMember.fullName} (${rootMember.serNo})`);

    // Helper to normalize relation strings
    const relIn = (values) => ({ $in: values });
    const SON_DAUGHTER = ['Son', 'Daughter', 'son', 'daughter'];
    const FATHER_MOTHER = ['Father', 'Mother', 'father', 'mother'];
    const SPOUSE = ['husband', 'wife', 'Husband', 'Wife'];

    async function getSpouseFor(serNo) {
      // 1) Prefer explicit spouseSerNo on member
      const self = await Member.findOne({ serNo }).lean();
      if (self && Number.isFinite(self.spouseSerNo)) {
        const spouse = await Member.findOne({ serNo: self.spouseSerNo }).lean();
        if (spouse) {
          return {
            serNo: spouse.serNo,
            fullName: spouse.fullName || `${spouse.firstName || ''} ${spouse.lastName || ''}`.trim(),
            gender: spouse.gender || 'Unknown',
            profileImage: spouse.profileImage || '',
            vansh: spouse.vansh || '',
          };
        }
      }

      // 2) Fall back to relationship documents; prefer reciprocated links
      const rels = await Relationship.find({
        $or: [
          { fromSerNo: serNo, relation: relIn(SPOUSE) },
          { toSerNo: serNo, relation: relIn(SPOUSE) },
        ],
      }).lean();
      if (!rels || !rels.length) return null;

      // Collect candidates and prefer ones that reciprocate
      const candidates = rels.map(r => (r.fromSerNo === serNo ? r.toSerNo : r.fromSerNo)).filter(n => Number.isFinite(n));
      const uniqueCandidates = [...new Set(candidates)];
      let chosen = null;
      for (const other of uniqueCandidates) {
        const reverse = await Relationship.findOne({
          $or: [
            { fromSerNo: other, toSerNo: serNo, relation: relIn(SPOUSE) },
            { toSerNo: other, fromSerNo: serNo, relation: relIn(SPOUSE) },
          ],
        }).lean();
        if (reverse) { chosen = other; break; }
      }
      if (!chosen) { chosen = uniqueCandidates[0]; }

      const spouse = await Member.findOne({ serNo: chosen }).lean();
      if (!spouse) return null;
      return {
        serNo: spouse.serNo,
        fullName: spouse.fullName || `${spouse.firstName || ''} ${spouse.lastName || ''}`.trim(),
        gender: spouse.gender || 'Unknown',
        profileImage: spouse.profileImage || '',
        vansh: spouse.vansh || '',
      };
    }

    // Recursive function to build the family tree using relationships
    async function buildFamilyTreeNew(member, visited = new Set(), currentDepth = 1) {
      // Cycle protection
      if (visited.has(member.serNo)) {
        console.warn(`Cycle detected at serNo ${member.serNo}; skipping further expansion.`);
        return [];
      }
      visited.add(member.serNo);

      // Depth limiting
      if (currentDepth >= targetDepth) {
        return [];
      }

      // Collect child serNos from relationship encodings
      const [relsFromAsChild, relsToAsParent] = await Promise.all([
        // Parent -> child as Son/Daughter
        Relationship.find({ fromSerNo: member.serNo, relation: relIn(SON_DAUGHTER) }),
        // Child -> parent as Father/Mother; invert to get children
        Relationship.find({ toSerNo: member.serNo, relation: relIn(FATHER_MOTHER) })
      ]);

      const childSerNos = new Set();
      relsFromAsChild.forEach(r => childSerNos.add(r.toSerNo));
      relsToAsParent.forEach(r => childSerNos.add(r.fromSerNo));

      // Fallback: use embedded childrenSerNos from member document (tempmem)
      if (Array.isArray(member.childrenSerNos)) {
        member.childrenSerNos.forEach(sn => childSerNos.add(sn));
      }

      // Filter out invalid and already-visited serNos
      const serNoList = [...childSerNos]
        .filter((n) => typeof n === 'number' && !Number.isNaN(n))
        .filter((n) => !visited.has(n));

      if (serNoList.length === 0) {
        return [];
      }

      // Fetch child member documents
      const children = await Member.find({ serNo: { $in: serNoList } }).sort({ serNo: 1 });
      console.log(`Member ${member.serNo} (${member.fullName}) -> ${serNoList.length} child serNos; fetched ${children.length} children`);

      const childrenWithDescendants = [];
      for (const child of children) {
        const childWithDescendants = child.toObject();
        // Attach spouse to each child for side-by-side rendering
        childWithDescendants.spouse = await getSpouseFor(childWithDescendants.serNo);
        // Pass the same visited set to avoid duplicates across branches; increment depth
        childWithDescendants.children = await buildFamilyTreeNew(child, visited, currentDepth + 1);
        childrenWithDescendants.push(childWithDescendants);
      }

      return childrenWithDescendants;
    }

    const rootWithDescendants = rootMember.toObject();
    // Attach spouse to root
    rootWithDescendants.spouse = await getSpouseFor(rootWithDescendants.serNo);
    rootWithDescendants.children = await buildFamilyTreeNew(rootMember, new Set(), 1);

    console.log(`Returning tree-new root: ${rootWithDescendants.fullName} (#${rootWithDescendants.serNo}) depth=${targetDepth} children=${rootWithDescendants.children.length}`);

    res.json(rootWithDescendants);
  } catch (error) {
    console.error('Error building family tree:', error);
    res.status(500).send('Server error');
  }
});

  // Couple-centric hierarchy for frontend rendering
  router.get('/tree-couples/:serNo', async (req, res) => {
    try {
      const serNo = parseInt(req.params.serNo);
      const depthParam = parseInt(req.query.depth || '6', 10);
      const MAX_DEPTH = 10;
      const targetDepth = Number.isFinite(depthParam) ? Math.min(Math.max(depthParam, 1), MAX_DEPTH) : 6;
      const SPOUSE = ['husband', 'wife', 'Husband', 'Wife', 'Spouse', 'spouse'];

      const allMembers = await Member.find().lean();
      const byId = new Map(allMembers.map(m => [m.serNo, m]));

      function normalizeName(m) {
        return m.fullName || `${m.firstName || ''} ${m.middleName || ''} ${m.lastName || ''}`.replace(/\s+/g, ' ').trim();
      }

      async function resolveSpouseFor(id) {
        const self = byId.get(id);
        if (!self) return null;
        if (Number.isFinite(self.spouseSerNo) && byId.has(self.spouseSerNo)) {
          return byId.get(self.spouseSerNo);
        }
        // fallback to relationships
        const rel = await Relationship.findOne({ fromSerNo: id, relation: { $in: SPOUSE } })
          || await Relationship.findOne({ toSerNo: id, relation: { $in: SPOUSE } });
        if (!rel) return null;
        const other = rel.fromSerNo === id ? rel.toSerNo : rel.fromSerNo;
        return byId.get(other) || null;
      }

      async function build(id, visited = new Set(), depth = 1) {
        if (!Number.isFinite(id) || !byId.has(id) || visited.has(id) || depth > targetDepth) return null;
        visited.add(id);

        const person = byId.get(id);
        const spouse = await resolveSpouseFor(id);
        if (spouse) visited.add(spouse.serNo);

        // collect children from both partners
        const childIds = new Set();
        if (Array.isArray(person.childrenSerNos)) person.childrenSerNos.forEach(n => childIds.add(n));
        if (spouse && Array.isArray(spouse.childrenSerNos)) spouse.childrenSerNos.forEach(n => childIds.add(n));
        const orderedChildIds = [...childIds]
          .filter(n => Number.isFinite(n) && byId.has(n))
          .sort((a, b) => a - b);

        const children = [];
        for (const cid of orderedChildIds) {
          const childNode = await build(cid, visited, depth + 1);
          if (childNode) children.push(childNode);
        }

        return {
          serNo: person.serNo,
          fullName: normalizeName(person),
          gender: person.gender || 'Unknown',
          profileImage: person.profileImage || '',
          vansh: person.vansh || '',
          spouse: spouse ? {
            serNo: spouse.serNo,
            fullName: normalizeName(spouse),
            gender: spouse.gender || 'Unknown',
            profileImage: spouse.profileImage || '',
            vansh: spouse.vansh || '',
          } : null,
          children,
        };
      }

      if (!Number.isFinite(serNo) || !byId.has(serNo)) {
        return res.status(404).json({ message: 'Root member not found' });
      }

      const tree = await build(serNo, new Set(), 1);
      return res.json(tree || {});
    } catch (e) {
      console.error('Error in /tree-couples/:serNo', e?.message, e?.stack);
      return res.status(500).json({ message: 'Server error', error: e.message });
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

// @route   GET api/family/dynamic-relations/:serNo
// @desc    Compute dynamic relations in JS (no precomputed relationships needed)
// @access  Public
router.get('/dynamic-relations/:serNo', async (req, res) => {
  try {
    const serNo = parseInt(req.params.serNo);
    if (!serNo || isNaN(serNo) || serNo <= 0) {
      return res.status(400).json({ message: 'Invalid serNo parameter' });
    }

    // Load all members once and build index
    const members = await Member.find().lean();
    const membersById = buildMembersIndex(members);

    // Load relationRules for English -> Marathi mapping
    let relationRulesMap = new Map();
    try {
      const coll = mongoose.connection.db.collection('relationrules');
      const docs = await coll.find({}).toArray();
      relationRulesMap = buildRelationRulesMap(docs);
    } catch (e) {
      console.warn('relationrules collection not found or not accessible. Proceeding without Marathi mapping.');
    }

    const results = getRelationsForSerNo(serNo, membersById, relationRulesMap);

    return res.json(results);
  } catch (error) {
    console.error('Error in /dynamic-relations/:serNo:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST api/family/generate-relations
// @desc    Generate and persist relationships for all members or one (uses relationRules for Marathi)
// @access  Public (can secure later)
router.post('/generate-relations', async (req, res) => {
  try {
    const serNoParam = req.query.serNo;
    const forSingle = serNoParam !== undefined;
    const targetSerNo = forSingle ? parseInt(serNoParam) : null;
    if (forSingle && (isNaN(targetSerNo) || targetSerNo <= 0)) {
      return res.status(400).json({ message: 'Invalid serNo query parameter' });
    }

    // Load members
    const members = await Member.find(forSingle ? { serNo: targetSerNo } : {}).lean();
    if (!members.length) {
      return res.status(404).json({ message: 'No members found for generation' });
    }

    // Build index with all members (to let relations resolve across the whole set)
    const allMembers = await Member.find().lean();
    const membersById = buildMembersIndex(allMembers);

    // Load relationRules for English -> Marathi mapping
    let relationRulesMap = new Map();
    try {
      const coll = mongoose.connection.db.collection('relationrules');
      const docs = await coll.find({}).toArray();
      relationRulesMap = buildRelationRulesMap(docs);
    } catch (e) {
      console.warn('relationrules collection not found or not accessible. Proceeding without Marathi mapping.');
    }

    let totalGenerated = 0;
    const perMemberCounts = [];

    for (const person of members) {
      const rels = getRelationsForSerNo(person.serNo, membersById, relationRulesMap);
      // Prepare docs to insert
      const docs = rels
        .map(r => ({
          fromSerNo: person.serNo,
          toSerNo: r.related?.serNo,
          relation: r.relationEnglish, // store English label
          relationMarathi: r.relationMarathi || '',
        }))
        .filter(d => Number.isFinite(d.toSerNo));

      // Clean existing generated relations for this member
      await Relationship.deleteMany({ fromSerNo: person.serNo });

      if (docs.length) {
        await Relationship.insertMany(docs, { ordered: false });
        totalGenerated += docs.length;
      }
      perMemberCounts.push({ serNo: person.serNo, count: docs.length });
    }

    return res.json({
      message: 'Relationships generated successfully',
      mode: forSingle ? 'single' : 'all',
      totalGenerated,
      details: perMemberCounts,
    });
  } catch (error) {
    console.error('Error in POST /generate-relations:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET api/family/relationships-expanded/:serNo
// @desc    Read relationships from DB and expand with related member data
// @access  Public
router.get('/relationships-expanded/:serNo', async (req, res) => {
  try {
    const serNo = parseInt(req.params.serNo);
    if (!serNo || isNaN(serNo) || serNo <= 0) {
      return res.status(400).json({ message: 'Invalid serNo parameter' });
    }

    const rels = await Relationship.find({ fromSerNo: serNo }).lean();
    if (!rels.length) {
      return res.json([]);
    }

    const ids = [...new Set(rels.map(r => r.toSerNo))];
    const members = await Member.find({ serNo: { $in: ids } }).lean();
    const byId = new Map(members.map(m => [m.serNo, m]));

    const expanded = rels.map(r => ({
      relationEnglish: r.relation,
      relationMarathi: r.relationMarathi || '',
      related: byId.get(r.toSerNo) || { serNo: r.toSerNo },
    }));

    return res.json(expanded);
  } catch (error) {
    console.error('Error in GET /relationships-expanded/:serNo:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET api/family/complete-tree
// @desc    Get complete family tree with all members organized by levels
// @access  Public
router.get('/complete-tree', async (req, res) => {
  try {
    console.log('Fetching complete family tree with all members (legacy endpoint)');

    const allMembers = await Member.find().sort({ level: 1, serNo: 1 }).lean();
    const allRelationships = await Relationship.find().lean();

    const membersByLevel = allMembers.reduce((acc, member) => {
      const level = member.level || 1;
      if (!acc[level]) acc[level] = [];
      acc[level].push(member);
      return acc;
    }, {});

    const membersWithChildren = allMembers.map(member => {
      const childRelationships = allRelationships.filter(rel =>
        rel.fromSerNo === member.serNo &&
        ['Son', 'Daughter'].includes(rel.relation)
      );

      const childSerNos = childRelationships.map(rel => rel.toSerNo);
      const children = allMembers.filter(m => childSerNos.includes(m.serNo));

      return {
        ...member,
        children,
        childCount: children.length
      };
    });

    const result = {
      totalMembers: allMembers.length,
      totalRelationships: allRelationships.length,
      levels: Object.keys(membersByLevel).sort((a, b) => parseInt(a, 10) - parseInt(b, 10)),
      membersByLevel,
      membersWithChildren,
      allMembers
    };

    console.log(`Returning legacy complete tree with ${result.levels.length} levels`);
    res.json(result);
  } catch (error) {
    console.error('Error fetching complete family tree:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;