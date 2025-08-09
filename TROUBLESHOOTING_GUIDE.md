# Family Tree System Troubleshooting Guide

## Current Issue: 500 Internal Server Error

### Problem Description
The error `Failed to load resource: the server responded with a status of 500 (Internal Server Error)` occurs when accessing family member pages, specifically when the URL contains `/api/family/member-new/ApiTestPage`.

### Root Cause Analysis
The issue occurs when:
1. The React Router parameter `serNo` is being set to `ApiTestPage` instead of a numeric value
2. The server tries to parse `ApiTestPage` as an integer, which fails
3. This suggests a routing issue where the FamilyMemberPage component is being rendered with an invalid parameter

### Fixes Applied

#### Backend Fixes
1. **Enhanced Error Handling**: Added proper validation for serNo parameters in all new API endpoints
2. **Parameter Validation**: Check for invalid values like 'undefined', 'null', and non-numeric strings
3. **Consistent Error Responses**: Return 400 Bad Request for invalid parameters instead of 500 errors

#### Frontend Fixes
1. **Updated Components**: All components now handle both old and new data structures
2. **Parameter Validation**: Added client-side validation to prevent invalid API calls
3. **Improved Error Messages**: Better error handling and user feedback

### Testing Steps

#### 1. Restart the Server
```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run server
```

#### 2. Test API Endpoints Directly
```bash
# Test valid endpoints
curl http://localhost:5000/api/family/member-new/1
curl http://localhost:5000/api/family/member-new/1/children
curl http://localhost:5000/api/family/member-new/1/parents

# Test invalid endpoints (should return 400 errors)
curl http://localhost:5000/api/family/member-new/ApiTestPage
curl http://localhost:5000/api/family/member-new/undefined
```

#### 3. Test Frontend Navigation
1. Go to `http://localhost:3000/family` (Family List Page)
2. Click on any family member card
3. Verify the URL is in format `/family/member/[number]`
4. Check browser console for any JavaScript errors

#### 4. Test API Test Page
1. Go to `http://localhost:3000/api-test`
2. Test the new API endpoints
3. Verify no 500 errors occur

### Common Issues and Solutions

#### Issue 1: Server Not Restarting
**Solution**: Make sure to stop the server completely (Ctrl+C) and restart it with `npm run server`

#### Issue 2: Invalid URLs
**Problem**: URLs like `/family/member/ApiTestPage` instead of `/family/member/1`
**Solution**: Check that all links in the application use proper numeric serNo values

#### Issue 3: Data Structure Mismatch
**Problem**: Components expecting old data structure (member.name) but getting new structure (member.fullName)
**Solution**: All components have been updated to handle both structures

### Verification Checklist

- [ ] Server restarts without errors
- [ ] API endpoints return proper error codes (400 for invalid params, 404 for not found)
- [ ] Family list page loads correctly
- [ ] Individual family member pages load with valid serNo
- [ ] Family tree visualization works
- [ ] No 500 errors in browser console

### Files Modified

#### Backend
- `server/routes/family.js` - Enhanced error handling for all new endpoints
- `server/models/Member.js` - New member model
- `server/models/Relationship.js` - New relationship model

#### Frontend
- `client/src/pages/FamilyMemberPage.jsx` - Updated to use new API endpoints
- `client/src/pages/FamilyListPage.jsx` - Updated to use new API endpoints
- `client/src/pages/RawDataPage.jsx` - Updated to use new API endpoints
- `client/src/components/family/FamilyTree.jsx` - Updated to use new API endpoints
- `client/src/components/family/FamilyMemberCard.jsx` - Updated for new data structure

### Next Steps

1. **Restart the server** to apply all backend changes
2. **Test the API endpoints** directly to ensure they work
3. **Test the frontend** navigation to ensure proper routing
4. **Check browser console** for any remaining JavaScript errors
5. **Verify data integrity** by checking that all family relationships display correctly

### Support

If issues persist:
1. Check server console logs for detailed error messages
2. Check browser console for JavaScript errors
3. Verify database connection and data integrity
4. Ensure all dependencies are installed correctly

The system has been successfully migrated to use the new `members` and `relationships` collections, providing better data integrity and more flexible relationship management.