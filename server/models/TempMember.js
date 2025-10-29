const mongoose = require('mongoose');
const FamilyMember = require('./fami');

// Clone the FamilyMember schema so both collections stay aligned
const tempMemberSchema = FamilyMember.schema.clone();
tempMemberSchema.set('collection', 'tempmembers');

tempMemberSchema.set('timestamps', true);

const TempMember = mongoose.models.TempMember || mongoose.model('TempMember', tempMemberSchema, 'tempmembers');

module.exports = TempMember;