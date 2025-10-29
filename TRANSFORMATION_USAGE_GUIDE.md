# Member Data Transformation - Quick Usage Guide

## Overview
The transformation utility converts family member data from the new nested schema (with `personalDetails` object) to the flat structure that the frontend expects.

## Import Statement

```javascript
import { transformMemberData, transformMembersData } from '../utils/memberTransform';
```

## Usage Examples

### Example 1: Transform Single Member
```javascript
import api from '../utils/api';
import { transformMemberData } from '../utils/memberTransform';

// Fetch single member
const res = await api.get(`/api/family/member/${serNo}`);

// Transform the data
const member = transformMemberData(res.data);

// Now you can access:
console.log(member.firstName);        // "Balwant"
console.log(member.fullName);          // "Balwant Ramkrishna Gogte"
console.log(member.gender);            // "male"
console.log(member.dateOfBirth);       // Date object
console.log(member.serNo);             // 5
```

### Example 2: Transform Array of Members
```javascript
import api from '../utils/api';
import { transformMembersData } from '../utils/memberTransform';

// Fetch all members
const res = await api.get('/api/family/members');

// Transform all members at once
const members = transformMembersData(res.data);

// Use transformed data
members.forEach(member => {
  console.log(`${member.fullName} (#${member.serNo})`);
});

// Filter by gender (now case-insensitive)
const males = members.filter(m => m.gender?.toLowerCase() === 'male');
const females = members.filter(m => m.gender?.toLowerCase() === 'female');
```

### Example 3: Complete Component Example
```javascript
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { transformMembersData } from '../utils/memberTransform';

const FamilyListComponent = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Fetch from API
        const res = await api.get('/api/family/members');
        
        // Transform data - THIS IS THE KEY STEP
        const transformedMembers = transformMembersData(res.data);
        
        // Use transformed data
        setMembers(transformedMembers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching members:', error);
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {members.map(member => (
        <div key={member.serNo}>
          <h3>{member.fullName}</h3>
          <p>Gender: {member.gender}</p>
          <p>Level: {member.level}</p>
          <p>Vansh: {member.vansh}</p>
          {member.spouse && (
            <p>Spouse: {member.spouse.fullName}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default FamilyListComponent;
```

### Example 4: With Filtering
```javascript
import { transformMembersData } from '../utils/memberTransform';

const res = await api.get('/api/family/members');
const members = transformMembersData(res.data);

// Filter by gender (case-insensitive)
const maleMembers = members.filter(m => 
  m.gender?.toLowerCase() === 'male'
);

// Filter by level
const generationTwo = members.filter(m => m.level === 2);

// Filter by vansh
const vansh61Members = members.filter(m => m.vansh === '61');

// Search by name
const searchResults = members.filter(m =>
  m.fullName.toLowerCase().includes('balwant')
);

// Complex filter
const complexFilter = members.filter(m =>
  m.gender?.toLowerCase() === 'female' &&
  m.level === 2 &&
  m.childrenSerNos.length > 0
);
```

## Data Mapping Reference

### Input (From Database with New Schema)
```javascript
{
  personalDetails: {
    firstName: "Balwant",
    middleName: "Ramkrishna",
    lastName: "Gogte",
    gender: "male",
    dateOfBirth: "2025-10-24T00:00:00.000Z",
    mobileNumber: "1234567890",
    // ... other fields
  },
  marriedDetails: {
    spouseFirstName: "Kashibai",
    // ... other fields
  },
  serNo: 5,
  level: 2,
  vansh: "61"
}
```

### Output (After Transformation - What You Use)
```javascript
{
  firstName: "Balwant",
  middleName: "Ramkrishna",
  lastName: "Gogte",
  fullName: "Balwant Ramkrishna Gogte",
  gender: "male",
  dateOfBirth: "2025-10-24T00:00:00.000Z",
  mobileNumber: "1234567890",
  phone: "1234567890",  // alias
  spouse: {
    firstName: "Kashibai",
    fullName: "Kashibai ...",
    serNo: 6
  },
  serNo: 5,
  level: 2,
  vansh: "61",
  // ... all other fields
}
```

## Common Field Mappings

| Database Path | Transformed Field |
|---|---|
| `personalDetails.firstName` | `firstName` |
| `personalDetails.lastName` | `lastName` |
| `personalDetails.gender` | `gender` |
| `personalDetails.dateOfBirth` | `dateOfBirth` |
| `personalDetails.mobileNumber` | `mobileNumber` / `phone` |
| `personalDetails.email` | `email` |
| `personalDetails.profileImage` | `profileImage` |
| `personalDetails.city` | `city` |
| `personalDetails.state` | `state` |
| `personalDetails.pinCode` | `pinCode` |
| `personalDetails.country` | `country` |
| `marriedDetails.spouseFirstName` | `spouse.firstName` |
| `serNo` | `serNo` |
| `level` | `level` |
| `vansh` | `vansh` |
| `fatherSerNo` | `fatherSerNo` |
| `motherSerNo` | `motherSerNo` |
| `childrenSerNos` | `childrenSerNos` |
| `isapproved` | `isapproved` |

## Gender Comparison (IMPORTANT!)

**❌ DON'T DO THIS:**
```javascript
if (member.gender === 'Male') { }  // Case-sensitive, might fail
```

**✅ DO THIS:**
```javascript
if (member.gender?.toLowerCase() === 'male') { }  // Case-insensitive
```

Or use a helper function:
```javascript
const isMale = (member) => member?.gender?.toLowerCase() === 'male';

if (isMale(member)) { }
```

## Reverse Transformation (For API Submissions)

When you need to send data back to the API, use the reverse transform:

```javascript
import { reverseTransformMemberData } from '../utils/memberTransform';

// You have flat member data
const flatMember = {
  firstName: "Balwant",
  lastName: "Gogte",
  gender: "male",
  // ... other fields
};

// Convert back to new schema for API submission
const apiPayload = reverseTransformMemberData(flatMember);

// Send to API
await api.post('/api/family/members', apiPayload);
```

## Error Handling

```javascript
import { transformMembersData } from '../utils/memberTransform';

try {
  const res = await api.get('/api/family/members');
  
  if (!res.data) {
    throw new Error('No data received from API');
  }

  const members = transformMembersData(res.data);
  
  if (!members || members.length === 0) {
    console.warn('No members to display');
  }
  
  setMembers(members);
} catch (error) {
  console.error('Failed to load members:', error);
  // Show error to user
}
```

## Performance Notes

- The transformation is fast (O(n) complexity)
- It's safe to call on every component render (memoize if needed)
- No mutations to original data
- All date objects are preserved

```javascript
// If you're concerned about performance, memoize the transformation
import { useMemo } from 'react';

const members = useMemo(
  () => transformMembersData(rawData),
  [rawData]
);
```

## Best Practices

1. **Transform as early as possible** - Transform right after fetching from API
2. **Transform once, use many times** - Store transformed data in state
3. **Use case-insensitive comparisons** - Always use `.toLowerCase()` for gender
4. **Handle null/undefined** - Use optional chaining (`?.`)
5. **Provide fallbacks** - Use `||` operator for display values

```javascript
// Good practice example
const FamilyMemberComponent = ({ member }) => {
  const transformedMember = useMemo(() => 
    transformMemberData(member), 
    [member]
  );

  const displayName = transformedMember?.fullName || 'Unknown Member';
  const isMale = transformedMember?.gender?.toLowerCase() === 'male';

  return (
    <div>
      <h3>{displayName}</h3>
      <span>{isMale ? 'Male' : 'Female'}</span>
    </div>
  );
};
```

## Troubleshooting

### Issue: "Cannot read property 'firstName' of undefined"
**Solution**: Ensure transformation is called before using data
```javascript
const transformed = transformMemberData(data);
if (transformed?.firstName) { }
```

### Issue: Gender filter not working
**Solution**: Use case-insensitive comparison
```javascript
// Wrong:
members.filter(m => m.gender === 'Male')

// Correct:
members.filter(m => m.gender?.toLowerCase() === 'male')
```

### Issue: fullName showing "[object Object]"
**Solution**: Transformation automatically computes fullName - check component
```javascript
// The transformation already does this:
fullName: `${firstName} ${middleName} ${lastName}`.trim()
```

## API Integration Checklist

When working with the API:
- [ ] Import the transformation utility
- [ ] Call transformation on API responses
- [ ] Store transformed data in state
- [ ] Use transformed data in components
- [ ] Use case-insensitive gender comparisons
- [ ] Test with null/undefined values
- [ ] Handle errors gracefully

---

**Version**: 1.0
**Last Updated**: Implementation Complete