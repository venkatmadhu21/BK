const FamilyMember = require("../models/fami");
const Members = require("../models/mem");

const DATA_URI_REGEX = /^data:(.+?);base64,(.+)$/;

const convertDataUriToImageObject = (value) => {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  const match = normalizedValue.match(DATA_URI_REGEX);

  if (!match) {
    return null;
  }

  const [, mimeType, base64Data] = match;

  if (!mimeType || !base64Data) {
    return null;
  }

  return {
    mimeType,
    data: base64Data,
    originalName: "data-uri-upload",
  };
};

const normalizeImageDataUris = (input) => {
  if (Array.isArray(input)) {
    return input.map((item) => normalizeImageDataUris(item));
  }

  if (input && typeof input === "object") {
    return Object.entries(input).reduce((acc, [key, value]) => {
      acc[key] = normalizeImageDataUris(value);
      return acc;
    }, {});
  }

  if (typeof input === "string") {
    const imageObject = convertDataUriToImageObject(input);
    return imageObject || input;
  }

  return input;
};

const addFamilyMember = async (req, res) => {
  try {
    console.log("=== FORM SUBMISSION RECEIVED ===");
    console.log("Request Body:", req.body);
    console.log("Request Files:", req.files ? Object.keys(req.files) : "No files");

    // Convert uploaded files to base64
    const filesData = {};
    Object.entries(req.files || {}).forEach(([fieldPath, files]) => {
      console.log(`Processing file field: ${fieldPath}`);
      const parsed = fieldPath.split(".");
      const property = parsed.pop();
      const parentPath = parsed.join(".");

      filesData[parentPath] = filesData[parentPath] || {};
      if (files && files.length > 0) {
        const file = files[0];
        console.log(`Converting ${fieldPath} to base64 (${file.size} bytes)`);
        filesData[parentPath][property] = {
          data: file.buffer.toString("base64"),
          mimeType: file.mimetype,
          originalName: file.originalname,
        };
      }
    });

    const mergeData = (base, updates) => {
      const result = Array.isArray(base) ? [...base] : { ...base };
      Object.keys(updates).forEach((key) => {
        if (updates[key] && typeof updates[key] === "object" && !Array.isArray(updates[key])) {
          const existingValue = base?.[key] && typeof base[key] === "object" ? base[key] : {};
          result[key] = mergeData(existingValue, updates[key]);
        } else {
          result[key] = updates[key];
        }
      });
      return result;
    };

    let payload = req.body;

    if (req.files) {
      console.log("Merging file data into payload...");
      payload = Object.keys(filesData).reduce((acc, key) => {
        const keys = key.split(".");
        let pointer = acc;
        keys.forEach((k, index) => {
          if (index === keys.length - 1) {
            pointer[k] = mergeData(pointer[k], filesData[key]);
          } else {
            pointer[k] = pointer[k] || {};
            pointer = pointer[k];
          }
        });
        return acc;
      }, payload);
    }

    payload = normalizeImageDataUris(payload);

    const cleanPayload = (data) => {
      if (Array.isArray(data)) {
        const cleanedArray = data
          .map((item) => cleanPayload(item))
          .filter((item) => item !== undefined);
        return cleanedArray.length ? cleanedArray : undefined;
      }

      if (data && typeof data === "object") {
        const cleanedObject = Object.entries(data).reduce((acc, [key, value]) => {
          const cleanedValue = cleanPayload(value);
          const isEmptyObject =
            cleanedValue &&
            typeof cleanedValue === "object" &&
            !Array.isArray(cleanedValue) &&
            Object.keys(cleanedValue).length === 0;

          if (
            cleanedValue !== undefined &&
            cleanedValue !== "" &&
            !isEmptyObject
          ) {
            acc[key] = cleanedValue;
          }

          return acc;
        }, {});

        return Object.keys(cleanedObject).length ? cleanedObject : undefined;
      }

      if (data === null || data === "null" || data === "undefined") {
        return undefined;
      }

      return data;
    };

    const cleanedPayload = cleanPayload(payload) || {};

    console.log("Final Payload to Save:", JSON.stringify(cleanedPayload, null, 2));
    console.log("Creating family member in database...");

    const familyMember = await FamilyMember.create(cleanedPayload);

    console.log("=== FAMILY MEMBER SAVED SUCCESSFULLY ===");
    console.log("Saved Document ID:", familyMember._id);
    console.log("Saved to collection: Heirarchy_form");

    return res.status(201).json({
      success: true,
      data: familyMember,
      message: "✅ Family member saved successfully to database!",
      documentId: familyMember._id,
    });
  } catch (error) {
    console.error("=== ERROR SAVING FAMILY MEMBER ===");
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    console.error("Full Error:", error);

    return res.status(500).json({
      success: false,
      message: `❌ Error: ${error.message}`,
      error: error.message,
    });
  }
};

const getAllFamilyMembers = async (req, res) => {
  try {
    // Fetch from Members collection (not FamilyMember)
    // Filter only approved members
    let query = Members.find({ isapproved: true });
    
    // Optional level filter
    if (req.query.level) {
      query = query.where('level').equals(parseInt(req.query.level));
    }
    
    const members = await query.sort({ level: 1, serNo: 1 });
    
    // Transform members to include profile image as base64
    const transformedMembers = members.map(member => ({
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
      email: member.personalDetails?.email || '',
      mobileNumber: member.personalDetails?.mobileNumber || '',
      country: member.personalDetails?.country || '',
      state: member.personalDetails?.state || '',
      city: member.personalDetails?.city || '',
      aboutYourself: member.personalDetails?.aboutYourself || '',
      profession: member.personalDetails?.profession || '',
      // Profile image as base64 (with mime type)
      profileImage: member.personalDetails?.profileImage?.data ? 
        `data:${member.personalDetails.profileImage.mimeType || 'image/jpeg'};base64,${member.personalDetails.profileImage.data}` 
        : null,
      // Married status for display
      isAlive: member.personalDetails?.isAlive,
      everMarried: member.personalDetails?.everMarried,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt
    }));
    
    return res.status(200).json({ success: true, data: transformedMembers });
  } catch (error) {
    console.error("Error fetching family members:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const searchParents = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Search in members collection (first, middle, last names)
    const searchRegex = new RegExp(query, "i"); // case-insensitive search

    const members = await Members.find({
      $or: [
        { "personalDetails.firstName": searchRegex },
        { "personalDetails.middleName": searchRegex },
        { "personalDetails.lastName": searchRegex },
      ],
    })
      .select(
        "personalDetails serNo vansh"
      )
      .limit(10);

    // Format the response for frontend
    const formattedMembers = members.map((member) => ({
      id: member._id,
      serNo: member.serNo || "",
      firstName: member.personalDetails?.firstName || "",
      middleName: member.personalDetails?.middleName || "",
      lastName: member.personalDetails?.lastName || "",
      dateOfBirth: member.personalDetails?.dateOfBirth ? new Date(member.personalDetails.dateOfBirth).toISOString().split("T")[0] : "",
      profileImage: member.personalDetails?.profileImage || null,
      gender: member.personalDetails?.gender || "",
      vansh: member.vansh || "",
      bio: member.personalDetails?.aboutYourself || "",
      email: member.personalDetails?.email || "",
      mobileNumber: member.personalDetails?.mobileNumber || "",
      displayName: `${member.personalDetails?.firstName || ""} ${member.personalDetails?.middleName || ""} ${
        member.personalDetails?.lastName || ""
      }`.trim(),
    }));

    return res.status(200).json({ success: true, data: formattedMembers });
  } catch (error) {
    console.error("Error searching parents:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  addFamilyMember,
  getAllFamilyMembers,
  searchParents,
};