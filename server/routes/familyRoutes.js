const express = require("express");
const mongoose = require("mongoose");
const { addFamilyMember, getAllFamilyMembers, searchParents } = require("../models/familyController");
const { upload, parseNestedFields } = require("../middleware/upload");
const Members = require("../models/mem");
const {
  buildMembersIndex,
  buildRelationRulesMap,
  getRelationsForSerNo,
} = require("../utils/relationEngine");

const router = express.Router();

// Helper function to transform member data from Members collection
const transformMemberData = (member) => {
  if (!member) return null;
  
  return {
    _id: member._id,
    serNo: member.serNo,
    vansh: member.vansh,
    level: member.level,
    fatherSerNo: member.fatherSerNo,
    motherSerNo: member.motherSerNo,
    spouseSerNo: member.spouseSerNo,
    childrenSerNos: member.childrenSerNos,
    isapproved: member.isapproved,
    // Personal details
    firstName: member.personalDetails?.firstName || '',
    middleName: member.personalDetails?.middleName || '',
    lastName: member.personalDetails?.lastName || '',
    fullName: `${member.personalDetails?.firstName || ''} ${member.personalDetails?.middleName || ''} ${member.personalDetails?.lastName || ''}`.trim(),
    gender: member.personalDetails?.gender || '',
    dateOfBirth: member.personalDetails?.dateOfBirth,
    dob: member.personalDetails?.dateOfBirth,
    email: member.personalDetails?.email || '',
    mobileNumber: member.personalDetails?.mobileNumber || '',
    country: member.personalDetails?.country || '',
    state: member.personalDetails?.state || '',
    city: member.personalDetails?.city || '',
    district: member.personalDetails?.district || '',
    colonyStreet: member.personalDetails?.colonyStreet || '',
    flatPlotNumber: member.personalDetails?.flatPlotNumber || '',
    pinCode: member.personalDetails?.pinCode || '',
    area: member.personalDetails?.area || '',
    aboutYourself: member.personalDetails?.aboutYourself || '',
    profession: member.personalDetails?.profession || '',
    qualifications: member.personalDetails?.qualifications || '',
    // Profile image as base64 (with mime type)
    profileImage: member.personalDetails?.profileImage?.data ? 
      `data:${member.personalDetails.profileImage.mimeType || 'image/jpeg'};base64,${member.personalDetails.profileImage.data}` 
      : null,
    // Married status for display
    isAlive: member.personalDetails?.isAlive === 'yes',
    dateOfDeath: member.personalDetails?.dateOfDeath,
    dod: member.personalDetails?.dateOfDeath,
    everMarried: member.personalDetails?.everMarried === 'yes',
    // Marital details
    divorcedDetails: member.divorcedDetails,
    marriedDetails: member.marriedDetails,
    remarriedDetails: member.remarriedDetails,
    widowedDetails: member.widowedDetails,
    parentsInformation: member.parentsInformation,
    createdAt: member.createdAt,
    updatedAt: member.updatedAt
  };
};

const uploadFields = upload.fields([
  { name: "personalDetails.profileImage", maxCount: 1 },
  { name: "divorcedDetails.spouseProfileImage", maxCount: 1 },
  { name: "marriedDetails.spouseProfileImage", maxCount: 1 },
  { name: "remarriedDetails.spouseProfileImage", maxCount: 1 },
  { name: "widowedDetails.spouseProfileImage", maxCount: 1 },
  { name: "parentsInformation.fatherProfileImage", maxCount: 1 },
  { name: "parentsInformation.motherProfileImage", maxCount: 1 },
]);

// Log all POST requests to /add
router.post(
  "/add",
  (req, res, next) => {
    console.log("📥 POST /api/family/add - Request received");
    next();
  },
  uploadFields,
  parseNestedFields,
  addFamilyMember
);

router.get("/all", getAllFamilyMembers);
router.get("/members", getAllFamilyMembers);  // Alias for /all to support frontend calls
router.get("/search", searchParents);

// ========================================
// NEW ROUTES USING MEMBERS COLLECTION
// ========================================

// @route   GET api/family/member-new/:serNo
// @desc    Get member by serial number from Members collection
// @access  Public
router.get("/member-new/:serNo", async (req, res) => {
  try {
    console.log("GET /member-new/:serNo - serNo param:", req.params.serNo);
    
    const serNoParam = req.params.serNo;
    const serNo = parseInt(serNoParam);
    
    // Check if serNo parameter is valid
    if (!serNoParam || serNoParam === "undefined" || serNoParam === "null" || isNaN(serNo) || serNo <= 0) {
      console.error("Invalid serNo parameter:", serNoParam, "parsed to:", serNo);
      return res.status(400).json({ message: "Invalid serNo parameter" });
    }
    
    console.log("Looking for member with serNo:", serNo);
    // Fetch from Members collection (new collection with full profile data)
    const member = await Members.findOne({ serNo });

    if (!member) {
      console.log("Member not found with serNo:", serNo);
      return res.status(404).json({ message: "Member not found" });
    }

    const memberName = member.personalDetails?.firstName || member.firstName;
    console.log("Found member:", memberName);
    
    // Transform and return the member data
    const transformedMember = transformMemberData(member);
    res.json(transformedMember);
  } catch (error) {
    console.error("Error in /member-new/:serNo:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET api/family/member-new/:serNo/children
// @desc    Get all children of a member from Members collection
// @access  Public
router.get("/member-new/:serNo/children", async (req, res) => {
  try {
    console.log("GET /member-new/:serNo/children - serNo param:", req.params.serNo);
    
    const serNoParam = req.params.serNo;
    
    // Check if serNo parameter is valid before parsing
    if (!serNoParam || serNoParam === "undefined" || serNoParam === "null") {
      console.error("Invalid serNo parameter:", serNoParam);
      return res.status(400).json({ message: "Invalid serNo parameter" });
    }
    
    const serNo = parseInt(serNoParam);
    
    if (isNaN(serNo) || serNo <= 0) {
      console.error("Invalid serNo parameter after parsing:", serNoParam, "->", serNo);
      return res.status(400).json({ message: "Invalid serNo parameter" });
    }
    
    // First get the parent member to access childrenSerNos directly
    const parentMember = await Members.findOne({ serNo });
    
    if (!parentMember) {
      console.log("Parent member not found with serNo:", serNo);
      return res.json([]);
    }
    
    // Get child serNos from the parent's childrenSerNos field
    const childSerNos = parentMember.childrenSerNos || [];
    console.log(`Found ${childSerNos.length} children for serNo ${serNo}`);
    
    if (childSerNos.length === 0) {
      return res.json([]);
    }
    
    // Get the actual member data for children from Members collection
    const children = await Members.find({ 
      serNo: { $in: childSerNos } 
    }).sort({ serNo: 1 });

    console.log(`Retrieved ${children.length} child members for serNo ${serNo}`);
    
    // Transform the children data
    const transformedChildren = children.map(transformMemberData);
    res.json(transformedChildren);
  } catch (error) {
    console.error("Error in /member-new/:serNo/children:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET api/family/member-new/:serNo/parents
// @desc    Get parents of a member from Members collection
// @access  Public
router.get("/member-new/:serNo/parents", async (req, res) => {
  try {
    console.log("GET /member-new/:serNo/parents - serNo param:", req.params.serNo);
    
    const serNoParam = req.params.serNo;
    
    // Check if serNo parameter is valid before parsing
    if (!serNoParam || serNoParam === "undefined" || serNoParam === "null") {
      console.error("Invalid serNo parameter:", serNoParam);
      return res.status(400).json({ message: "Invalid serNo parameter" });
    }
    
    const serNo = parseInt(serNoParam);
    
    if (isNaN(serNo) || serNo <= 0) {
      console.error("Invalid serNo parameter after parsing:", serNoParam, "->", serNo);
      return res.status(400).json({ message: "Invalid serNo parameter" });
    }
    
    // Get the child member to access parent serNos directly
    const childMember = await Members.findOne({ serNo });
    
    if (!childMember) {
      console.log("Child member not found with serNo:", serNo);
      return res.json({ father: null, mother: null });
    }
    
    let father = null;
    let mother = null;
    
    // Fetch father if fatherSerNo exists
    if (childMember.fatherSerNo) {
      father = await Members.findOne({ serNo: childMember.fatherSerNo });
      console.log(`Found father for serNo ${serNo}:`, father?.personalDetails?.firstName || father?.firstName);
    }
    
    // Fetch mother if motherSerNo exists
    if (childMember.motherSerNo) {
      mother = await Members.findOne({ serNo: childMember.motherSerNo });
      console.log(`Found mother for serNo ${serNo}:`, mother?.personalDetails?.firstName || mother?.firstName);
    }

    const parents = { 
      father: father ? transformMemberData(father) : null, 
      mother: mother ? transformMemberData(mother) : null 
    };
    
    console.log(`Returning parents for serNo ${serNo}`);
    res.json(parents);
  } catch (error) {
    console.error("Error in /member-new/:serNo/parents:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET api/family/dynamic-relations/:serNo
// @desc    Compute dynamic relations in JS (no precomputed relationships needed)
// @access  Public
router.get("/dynamic-relations/:serNo", async (req, res) => {
  try {
    const serNo = parseInt(req.params.serNo, 10);
    if (!Number.isFinite(serNo) || serNo <= 0) {
      return res.status(400).json({ message: "Invalid serNo parameter" });
    }

    // Load all members once and build index
    const members = await Members.find().lean();
    const membersById = buildMembersIndex(members);

    // Load relationRules for English -> Marathi mapping
    let relationRulesMap = new Map();
    try {
      const coll = mongoose.connection.db.collection("relationrules");
      const docs = await coll.find({}).toArray();
      relationRulesMap = buildRelationRulesMap(docs);
    } catch (error) {
      console.warn(
        "relationrules collection not found or not accessible. Proceeding without Marathi mapping.",
      );
    }

    const results = getRelationsForSerNo(serNo, membersById, relationRulesMap);

    // Transform the related member data to flatten it (for frontend compatibility)
    const transformedResults = results.map((relation) => ({
      ...relation,
      related: transformMemberData(relation.related)
    }));

    return res.json(transformedResults);
  } catch (error) {
    console.error("Error in /dynamic-relations/:serNo:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET api/family/tree-fmem/:serNo
// @desc    Get full descendant tree with spouse data from Members collection
// @access  Public
router.get("/tree-fmem/:serNo", async (req, res) => {
  try {
    const serNo = parseInt(req.params.serNo);
    console.log(`Fetching family tree for serNo: ${serNo} using Members collection`);

    const rootMember = await Members.findOne({ serNo }).lean();

    if (!rootMember) {
      console.log(`Member with serNo ${serNo} not found`);
      return res.status(404).json({ message: "Member not found" });
    }

    const rootName = rootMember.personalDetails?.firstName || '';
    console.log(`Found root member: ${rootName} (${rootMember.serNo})`);

    async function buildFamilyTree(member, depth = 1, maxDepth = 10) {
      if (depth > maxDepth) return null;

      const childSerNos = member.childrenSerNos || [];
      
      const firstName = member.personalDetails?.firstName || '';
      const middleName = member.personalDetails?.middleName || '';
      const lastName = member.personalDetails?.lastName || '';
      const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ').trim();

      // Fetch spouse if spouseSerNo exists
      let spouse = null;
      if (member.spouseSerNo) {
        spouse = await Members.findOne({ serNo: member.spouseSerNo }).lean();
        if (spouse) {
          const spouseFN = spouse.personalDetails?.firstName || '';
          const spouseMN = spouse.personalDetails?.middleName || '';
          const spouseLN = spouse.personalDetails?.lastName || '';
          spouse.fullName = [spouseFN, spouseMN, spouseLN].filter(Boolean).join(' ').trim();
          spouse.profileImage = spouse.personalDetails?.profileImage;
          spouse.gender = spouse.personalDetails?.gender || '';
        }
      }

      const treeNode = {
        serNo: member.serNo,
        firstName,
        middleName,
        lastName,
        name: fullName,
        fullName,
        gender: member.personalDetails?.gender || '',
        level: member.level,
        vansh: member.vansh,
        spouseSerNo: member.spouseSerNo,
        spouse: spouse,
        fatherSerNo: member.fatherSerNo,
        motherSerNo: member.motherSerNo,
        childrenSerNos: childSerNos,
        isApproved: member.isapproved,
        profileImage: member.personalDetails?.profileImage,
        children: []
      };

      if (childSerNos.length === 0) {
        return treeNode;
      }

      const children = await Members.find({ serNo: { $in: childSerNos } }).lean();
      
      const childrenWithDescendants = [];
      for (const child of children) {
        const childTree = await buildFamilyTree(child, depth + 1, maxDepth);
        if (childTree) {
          childrenWithDescendants.push(childTree);
        }
      }

      treeNode.children = childrenWithDescendants;
      return treeNode;
    }

    const tree = await buildFamilyTree(rootMember);
    
    console.log(`Returning family tree with root: ${rootName} (${tree.serNo})`);
    res.json(tree);
  } catch (error) {
    console.error('Error building family tree:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;