const express = require("express");
const mongoose = require("mongoose");
const { addFamilyMember, getAllFamilyMembers, searchParents } = require("../models/familyController");
const { upload, parseNestedFields } = require("../middleware/upload");
const Members = require("../models/mem");
const Relationship = require("../models/Relationship");
const {
  buildMembersIndex,
  buildRelationRulesMap,
  getRelationsForSerNo,
} = require("../utils/relationEngine");

const router = express.Router();

const relationCache = new Map();
const treeCache = new Map();
const CACHE_TTL_MS = 60000;
const MEMBER_SUMMARY_FIELDS = "serNo vansh level fatherSerNo motherSerNo spouseSerNo childrenSerNos isapproved personalDetails.firstName personalDetails.middleName personalDetails.lastName personalDetails.gender personalDetails.dateOfBirth personalDetails.dateOfDeath personalDetails.isAlive";
const MEMBER_TREE_FIELDS = `${MEMBER_SUMMARY_FIELDS} personalDetails.profileImage`;
const normalizeSerNo = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.trunc(n) : null;
};
const normalizeSerNoArray = (values) => (Array.isArray(values) ? values.map(normalizeSerNo).filter((n) => n !== null) : []);
const BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/;
const toBase64FromArray = (values) => {
  if (!values || !values.length) return "";
  const buffer = Buffer.from(values);
  return buffer.toString("base64");
};
const normalizeStringSource = (input) => (typeof input === "string" ? input.trim() : "");
const serializeProfileImage = (image) => {
  if (!image) return null;
  if (typeof image === "string") {
    const trimmed = normalizeStringSource(image);
    if (!trimmed) return null;
    if (trimmed.startsWith("data:")) return trimmed;
    const compact = trimmed.replace(/\s+/g, "");
    if (BASE64_PATTERN.test(compact) && compact.length > 100) {
      return `data:image/jpeg;base64,${compact}`;
    }
    return trimmed;
  }
  if (Array.isArray(image) || ArrayBuffer.isView(image)) {
    const base64 = toBase64FromArray(Array.isArray(image) ? image : Array.from(image));
    return base64 ? `data:image/jpeg;base64,${base64}` : null;
  }
  if (typeof image === "object") {
    const mimeType = image.mimeType || image.contentType || "image/jpeg";
    const url = normalizeStringSource(
      image.url || image.secure_url || image.secureUrl || image.Location || image.location || image.path || image.href || image.link
    );
    if (url) {
      if (url.startsWith("data:")) return url;
      return url;
    }
    const raw = image.data || image.base64 || image.value || image.source;
    if (typeof raw === "string") {
      const trimmed = normalizeStringSource(raw);
      if (!trimmed) return null;
      if (trimmed.startsWith("data:")) return trimmed;
      const compact = trimmed.replace(/\s+/g, "");
      if (BASE64_PATTERN.test(compact) && compact.length > 100) {
        return `data:${mimeType};base64,${compact}`;
      }
      return trimmed;
    }
    if (Array.isArray(raw) || ArrayBuffer.isView(raw)) {
      const base64 = toBase64FromArray(Array.isArray(raw) ? raw : Array.from(raw));
      return base64 ? `data:${mimeType};base64,${base64}` : null;
    }
  }
  return null;
};

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
    profileImage: serializeProfileImage(member.personalDetails?.profileImage),
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

router.get("/", getAllFamilyMembers);
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
    const member = await Members.findOne({ serNo }).lean();

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
    const parentMember = await Members.findOne({ serNo }).lean();
    
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
    }).sort({ serNo: 1 }).lean();

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
    const childMember = await Members.findOne({ serNo }).lean();
    
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

    const cacheKey = String(serNo);
    const now = Date.now();
    const cached = relationCache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return res.json(cached.data);
    }

    const members = await Members.find({}, MEMBER_SUMMARY_FIELDS).lean();
    const membersById = buildMembersIndex(members);

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

    const transformedResults = results.map((relation) => ({
      ...relation,
      related: transformMemberData(relation.related)
    }));

    relationCache.set(cacheKey, { timestamp: now, data: transformedResults });

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
    const serNo = parseInt(req.params.serNo, 10);
    if (!Number.isFinite(serNo) || serNo <= 0) {
      return res.status(400).json({ message: "Invalid serNo parameter" });
    }
    console.log(`Fetching family tree for serNo: ${serNo} using Members collection`);

    const cacheKey = String(serNo);
    const now = Date.now();
    const cached = treeCache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return res.json(cached.data);
    }

    const rootMember = await Members.findOne({ serNo }).select(MEMBER_TREE_FIELDS).lean();

    if (!rootMember) {
      console.log(`Member with serNo ${serNo} not found`);
      return res.status(404).json({ message: "Member not found" });
    }

    const membersBySerNo = new Map();
    membersBySerNo.set(rootMember.serNo, rootMember);

    const queue = [rootMember.serNo];
    const visited = new Set([rootMember.serNo]);

    while (queue.length) {
      const currentId = queue.shift();
      const current = membersBySerNo.get(currentId);
      if (!current) {
        continue;
      }
      const childIds = normalizeSerNoArray(current.childrenSerNos);
      const spouseId = normalizeSerNo(current.spouseSerNo);
      const relatedIds = spouseId !== null ? [...childIds, spouseId] : [...childIds];
      const missingIds = relatedIds.filter((id) => !membersBySerNo.has(id));
      if (missingIds.length) {
        const docs = await Members.find({ serNo: { $in: missingIds } }).select(MEMBER_TREE_FIELDS).lean();
        for (const doc of docs) {
          if (doc?.serNo !== undefined) {
            membersBySerNo.set(doc.serNo, doc);
          }
        }
      }
      for (const childId of childIds) {
        if (!visited.has(childId) && membersBySerNo.has(childId)) {
          visited.add(childId);
          queue.push(childId);
        }
      }
    }

    const maxDepth = 10;
    const buildNode = (memberDoc, depth = 1) => {
      if (!memberDoc || depth > maxDepth) {
        return null;
      }
      const firstName = memberDoc.personalDetails?.firstName || "";
      const middleName = memberDoc.personalDetails?.middleName || "";
      const lastName = memberDoc.personalDetails?.lastName || "";
      const fullNameParts = [firstName, middleName, lastName].filter(Boolean);
      const fullName = fullNameParts.join(" ").trim();
      const childIds = normalizeSerNoArray(memberDoc.childrenSerNos);
      const children = childIds
        .map((id) => buildNode(membersBySerNo.get(id), depth + 1))
        .filter(Boolean);
      const spouseId = normalizeSerNo(memberDoc.spouseSerNo);
      const spouseDoc = spouseId !== null ? membersBySerNo.get(spouseId) : null;
      let spouse = null;
      if (spouseDoc) {
        const spouseFirst = spouseDoc.personalDetails?.firstName || "";
        const spouseMiddle = spouseDoc.personalDetails?.middleName || "";
        const spouseLast = spouseDoc.personalDetails?.lastName || "";
        const spouseFull = [spouseFirst, spouseMiddle, spouseLast].filter(Boolean).join(" ").trim();
        spouse = {
          serNo: spouseDoc.serNo,
          firstName: spouseFirst,
          middleName: spouseMiddle,
          lastName: spouseLast,
          fullName: spouseFull,
          gender: spouseDoc.personalDetails?.gender || "",
          level: spouseDoc.level,
          vansh: spouseDoc.vansh,
          profileImage: serializeProfileImage(spouseDoc.personalDetails?.profileImage)
        };
      }
      return {
        serNo: memberDoc.serNo,
        firstName,
        middleName,
        lastName,
        name: fullName,
        fullName,
        gender: memberDoc.personalDetails?.gender || "",
        level: memberDoc.level,
        vansh: memberDoc.vansh,
        spouseSerNo: spouseId,
        spouse,
        fatherSerNo: normalizeSerNo(memberDoc.fatherSerNo),
        motherSerNo: normalizeSerNo(memberDoc.motherSerNo),
        childrenSerNos: childIds,
        isApproved: memberDoc.isapproved,
        profileImage: serializeProfileImage(memberDoc.personalDetails?.profileImage),
        dob: memberDoc.personalDetails?.dateOfBirth,
        dateOfBirth: memberDoc.personalDetails?.dateOfBirth,
        dateOfDeath: memberDoc.personalDetails?.dateOfDeath,
        isAlive: memberDoc.personalDetails?.isAlive === "yes" ? true : memberDoc.personalDetails?.isAlive === "no" ? false : undefined,
        children
      };
    };

    const tree = buildNode(rootMember);
    if (!tree) {
      return res.status(404).json({ message: "Member not found" });
    }

    treeCache.set(cacheKey, { timestamp: now, data: tree });

    console.log(`Returning family tree with root: ${tree.fullName || ""} (${tree.serNo})`);
    res.json(tree);
  } catch (error) {
    console.error("Error building family tree:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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

module.exports = router;