const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Member = require('../models/Member');

function normalizeString(value) {
  if (!value) return '';
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function buildMemberLookup(members) {
  const bySerNo = new Map();
  const byName = new Map();

  for (const m of members) {
    if (m.serNo != null) bySerNo.set(Number(m.serNo), m);
    const parts = [m.firstName, m.middleName, m.lastName].filter(Boolean);
    const fullName = normalizeString(parts.join(' '));
    if (fullName) byName.set(fullName, m);
  }
  return { bySerNo, byName };
}

function parsePhotosJSON(raw) {
  // Accept a few shapes:
  // 1) Array of { serNo?, name?, base64 } objects
  // 2) Object keyed by name => base64
  // 3) Object keyed by serNo (as string) => base64
  // 4) Array of [name, base64]
  if (Array.isArray(raw)) {
    return raw
      .map((entry) => {
        if (entry && typeof entry === 'object' && 'base64' in entry) {
          return {
            serNo: entry.serNo != null ? Number(entry.serNo) : null,
            name: entry.name ? normalizeString(entry.name) : '',
            base64: String(entry.base64 || ''),
          };
        }
        if (Array.isArray(entry) && entry.length >= 2) {
          return {
            serNo: null,
            name: normalizeString(entry[0]),
            base64: String(entry[1] || ''),
          };
        }
        return null;
      })
      .filter(Boolean);
  }

  if (raw && typeof raw === 'object') {
    const entries = [];
    for (const [key, value] of Object.entries(raw)) {
      const base64 = String(value || '').replace(/\s+/g, '');
      const maybeSerNo = Number(key);
      if (Number.isFinite(maybeSerNo)) {
        entries.push({ serNo: maybeSerNo, name: '', base64: `data:image/png;base64,${base64}` });
      } else {
        // Determine mime type
        let mime = 'png';
        if (/\.jpe?g$/i.test(key)) {
          mime = 'jpeg';
        }
        // Strip image extensions if present
        let name = key.replace(/\.(png|jpe?g)$/i, '');
        // Remove parentheses and their contents
        name = name.replace(/\s*\([^)]*\)/g, '');
        // Normalize gogate to gogte
        name = name.replace(/gogate/gi, 'gogte');
        name = normalizeString(name);
        const dataUrl = `data:image/${mime};base64,${base64}`;
        entries.push({ serNo: null, name, base64: dataUrl });
      }
    }
    return entries;
  }

  throw new Error('Unsupported photos_base64.json format');
}

async function main() {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/bal-krishna-nivas';
  await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    const filePath = path.join(__dirname, '..', 'photos_base64.json');
    const rawText = fs.readFileSync(filePath, 'utf8');
    const rawJson = JSON.parse(rawText);
    const photoEntries = parsePhotosJSON(rawJson);

    const members = await Member.find({});
    console.log('Total members in DB:', members.length);
    console.log('All member names:', members.map(m => normalizeString(`${m.firstName} ${m.middleName || ''} ${m.lastName}`.trim())));
    console.log('Members with serNo:', members.filter(m => m.serNo != null).map(m => `${m.serNo}: ${m.firstName} ${m.middleName || ''} ${m.lastName}`.trim()));
    const { bySerNo, byName } = buildMemberLookup(members);

    let updatedCount = 0;
    let notFoundCount = 0;
    const errors = [];
    const notFoundNames = [];
    const updatedNames = [];

    for (const entry of photoEntries) {
      try {
        let member = null;
        if (entry.serNo != null && bySerNo.has(entry.serNo)) {
          member = bySerNo.get(entry.serNo);
        } else if (entry.name) {
          if (byName.has(entry.name)) {
            member = byName.get(entry.name);
          } else {
            // Try relaxed matching: compare against member.fullName normalized
            for (const m of members) {
              const parts = [m.firstName, m.middleName, m.lastName].filter(Boolean);
              const fullName = normalizeString(parts.join(' '));
              if (fullName === entry.name) {
                member = m;
                break;
              }
            }
          }
        }

        if (!member) {
          notFoundCount += 1;
          notFoundNames.push(entry.name || `serNo: ${entry.serNo}`);
          continue;
        }

        // Only update if value is non-empty
        if (entry.base64 && entry.base64.length > 0) {
          member.profileImage = entry.base64;
          await member.save();
          updatedCount += 1;
          updatedNames.push(entry.name || `serNo: ${entry.serNo}`);
        }
      } catch (e) {
        errors.push(e);
      }
    }

    console.log(`Updated profileImage for ${updatedCount} member(s). Not found: ${notFoundCount}.`);
    if (updatedNames.length) {
      console.log('Updated names:', updatedNames);
    }
    if (notFoundNames.length) {
      console.log('Not found names:', notFoundNames);
    }
    if (errors.length) {
      console.log(`Encountered ${errors.length} error(s).`);
    }
  } finally {
    await mongoose.connection.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});





