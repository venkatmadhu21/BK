# 🧪 Testing & Verification Guide

## Test Environment Setup

### Prerequisites
- ✅ MongoDB running on localhost:27017
- ✅ Backend server running on port 5000
- ✅ Frontend running on port 3000 or 5173
- ✅ Browser with DevTools
- ✅ MongoDB GUI (MongoDB Compass) - optional but helpful

### Test Data
- Admin User: `admin_1` / `admin1234`
- Test User: `venkat_12` / `^X4h7d4mreIQ` (from saved credentials)

---

## Test Suite 1: Password Sync System

### Test 1.1: User Change Password - Happy Path

**Steps:**
```
1. Open Frontend → Login Page
2. Enter:
   - Username: venkat_12
   - Password: ^X4h7d4mreIQ
3. Click Login
4. Verify: Dashboard loads ✓
5. Go to: Settings → Change Password
6. Enter:
   - Current Password: ^X4h7d4mreIQ
   - New Password: NewTest@123
   - Confirm Password: NewTest@123
7. Click "Change Password"
```

**Expected Results:**
```
Frontend:
✅ No errors
✅ Success message: "Password updated successfully..."
✅ Redirects or closes modal
✅ Maybe redirects to login

Backend Logs:
✅ "✅ Password updated in Users collection..."
✅ "✅ Password updated in LegacyLogin..."

Database Verification:
Users collection:
  → Find: { username: "venkat_12" }
  → Verify: password is bcrypt hash (starts with $2a$)
  → Old password should NOT work

LegacyLogin collection:
  → Find: { username: "venkat_12" }
  → Verify: password = "NewTest@123" (plaintext)
  → Old password should NOT work
```

**Verification Commands:**
```javascript
// In MongoDB Compass, run these queries:

// Check Users collection
db.users.findOne({ username: "venkat_12" })
// Should show: password with $2a$... hash

// Check LegacyLogin collection
db.login.findOne({ username: "venkat_12" })
// Should show: password: "NewTest@123"

// Both should have updated timestamps
```

**Success Criteria:**
- ✅ Login successful with new password
- ✅ Password changed in Users collection
- ✅ Password synced to LegacyLogin
- ✅ Old password rejected
- ✅ Both collections have same password (hashed vs plaintext)

---

### Test 1.2: User Change Password - Error Cases

#### Test 1.2a: Wrong Current Password
```
1. Go to Settings → Change Password
2. Enter:
   - Current Password: WrongPassword123
   - New Password: NewTest@456
   - Confirm: NewTest@456
3. Click "Change Password"

Expected:
❌ Error: "Current password is incorrect"
❌ Password NOT changed
✅ No sync happens
```

#### Test 1.2b: Passwords Don't Match
```
1. Go to Settings → Change Password
2. Enter:
   - Current Password: NewTest@123
   - New Password: NewTest@456
   - Confirm: DifferentPassword
3. Click "Change Password"

Expected:
❌ Error: "New passwords do not match" (Frontend validation)
❌ Request doesn't even go to backend
```

#### Test 1.2c: Password Too Short
```
1. Go to Settings → Change Password
2. Enter:
   - Current Password: NewTest@123
   - New Password: abc
   - Confirm: abc
3. Click "Change Password"

Expected:
❌ Error: "New password must be at least 6 characters"
```

---

### Test 1.3: Login With New Password

**After changing password to "NewTest@123":**

```
1. Logout
2. Go to Login Page
3. Try to login with OLD password:
   - Username: venkat_12
   - Password: ^X4h7d4mreIQ
4. Click Login

Expected:
❌ Error: "Invalid credentials"
```

```
5. Try to login with NEW password:
   - Username: venkat_12
   - Password: NewTest@123
6. Click Login

Expected:
✅ Success: Dashboard loads
✅ Logged in successfully
```

---

## Test Suite 2: Admin Credential Reset

### Test 2.1: Admin Reset Credentials - Happy Path

**Setup:**
```
1. In MongoDB, verify venkat_12 exists in both collections:
   - Users collection
   - LegacyLogin collection
```

**Steps:**
```
1. Open Frontend → Login as Admin
   - Username: admin_1
   - Password: admin1234
   - Click Login

2. Verify: Admin dashboard loads ✓

3. Navigate to: Admin → Users Management (or similar)

4. Find: venkat_12 in users list

5. Click: "Reset Credentials" button

6. See: Confirmation modal
   "Are you sure you want to reset credentials for Venkat Kumar?"

7. Click: "Confirm Reset"
```

**Expected Results:**

```
Frontend Modal:
✅ Loading state shows
✅ After few seconds, success screen appears
✅ Displays:
   - Message: "Credentials reset successfully"
   - New Username: venkat_12
   - New Password: (random 12-char like "Xy9@pQr2mK")
   - Email: venkat@example.com
✅ Copy buttons available
✅ Email status shown: "✅ Credentials email sent to user"
   OR "⚠️ Email failed - send manually"

Backend Logs:
✅ "🔐 Admin resetting credentials for Venkat Kumar"
✅ "✅ Users collection password updated"
✅ "✅ LegacyLogin collection password updated"
✅ "✉️  New credentials email sent to venkat@example.com"
✅ "ADMIN ACTION: RESET_USER_CREDENTIALS..."

Database Verification:
Users collection:
  → Find: { username: "venkat_12" }
  → Verify: password is NEW bcrypt hash (different from before)
  → Old password should NOT work

LegacyLogin collection:
  → Find: { username: "venkat_12" }
  → Verify: password is NEW plaintext (from response)
  → Matches the temp password shown in modal
```

**Verification Steps:**
```javascript
// Copy the new temp password from modal
// Let's say it's: "Xy9@pQr2mK"

// In MongoDB Compass:
db.users.findOne({ username: "venkat_12" })
// Should show: NEW password hash

db.login.findOne({ username: "venkat_12" })
// Should show: password: "Xy9@pQr2mK"
```

**Email Verification** (if email service works):
```
1. Check Gmail inbox for: balkrishnanivas@gmail.com (or configured email)
2. Look for: Subject line with credentials
3. Body should contain:
   - Username: venkat_12
   - New Password: Xy9@pQr2mK
   - Temp password notice
```

**Success Criteria:**
- ✅ Admin sees success screen with new credentials
- ✅ New password in Users collection (hashed)
- ✅ New password in LegacyLogin (plaintext)
- ✅ Both passwords match (one hashed, one plaintext)
- ✅ Email sent (if email configured)
- ✅ Audit log recorded
- ✅ Old password rejected
- ✅ New password works

---

### Test 2.2: Login With New Reset Credentials

**After admin reset to "Xy9@pQr2mK":**

```
1. Admin closes modal
2. Admin panel stays open

3. In NEW browser tab/window:
   - Go to: Frontend Login Page
   - Try NEW credentials:
     Username: venkat_12
     Password: Xy9@pQr2mK
   - Click Login

Expected:
✅ Success: Dashboard loads
✅ Logged in as venkat_12
✅ Can access all features
```

**Verify in New Tab:**
```
4. Go to: Settings → Change Password
5. Old password check:
   - Current Password: ^X4h7d4mreIQ (old one)
   - Expected: ❌ "Current password is incorrect"

6. New password check:
   - Current Password: Xy9@pQr2mK (new one)
   - Expected: ✅ Works (can proceed with new password)
```

---

### Test 2.3: Non-Admin Cannot Access Reset

**Objective:** Verify that only admins can reset credentials

```
1. Login as venkat_12 with credentials: Xy9@pQr2mK

2. Try direct API call:
   PUT /api/admin/users/{someUserId}/reset-credentials
   
Expected:
❌ Error: 401 Unauthorized or 403 Forbidden
❌ Message: "Admin auth required" or similar
❌ Request rejected by middleware
```

**Verification:**
```javascript
// In Browser DevTools Console:
await fetch('/api/admin/users/123/reset-credentials', {
  method: 'PUT',
  headers: {
    'x-auth-token': localStorage.getItem('token'),
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(d => console.log(d))

Expected Response:
{
  message: "Admin access required"
  // OR
  message: "Unauthorized"
  // OR similar
}
```

---

## Test Suite 3: Edge Cases & Error Handling

### Test 3.1: User Without SerNo Changes Password

**Scenario:** User created without serNo

```
1. Try to change password
2. System should:
   ✅ Update Users collection
   ✅ Try to find serNo
   ✅ If not found, respond with warning:
      {
        message: "Password updated successfully",
        synced: false,
        warning: "Could not sync to legacy system..."
      }
```

**Success Criteria:**
- ✅ User can still change password
- ✅ Users collection updated
- ✅ Clear warning message about sync failure
- ✅ Old password rejected
- ✅ New password works (in Users collection)

---

### Test 3.2: Email Service Fails on Reset

**Scenario:** Email sending fails but password reset succeeds

```
1. Admin resets credentials
2. Backend:
   ✅ Updates Users collection
   ✅ Updates LegacyLogin collection
   ❌ Email sending fails
   
3. Response shows:
   {
     message: "Credentials reset successfully",
     credentials: {...},
     emailSent: false,
     note: "Email failed - please send manually"
   }
```

**Success Criteria:**
- ✅ Password still reset in database
- ✅ Admin gets credentials to share manually
- ✅ Response clearly indicates email failed
- ✅ User can still login with new password
- ✅ No data loss

---

### Test 3.3: Rapid Successive Password Changes

**Scenario:** User changes password multiple times quickly

```
1. User changes password to: Pass1
2. Immediately changes to: Pass2
3. Immediately changes to: Pass3

Expected:
✅ All changes succeed
✅ Final password is Pass3
✅ All synced to LegacyLogin
✅ Login works with Pass3 only
```

---

## Test Suite 4: Database Consistency

### Test 4.1: Both Collections Stay in Sync

**Setup:** User: venkat_12

```
Initial State:
Users: password = bcrypt hash of "Initial"
LegacyLogin: password = "Initial"

Action 1: User changes to "Changed"
Result:
✅ Users: password = bcrypt hash of "Changed"
✅ LegacyLogin: password = "Changed"

Action 2: Admin resets to "Reset123"
Result:
✅ Users: password = bcrypt hash of "Reset123"
✅ LegacyLogin: password = "Reset123"

Action 3: User changes to "Final"
Result:
✅ Users: password = bcrypt hash of "Final"
✅ LegacyLogin: password = "Final"
```

**Verification Query:**
```javascript
// All passwords should be in sync:
let user = db.users.findOne({ username: "venkat_12" });
let legacy = db.login.findOne({ username: "venkat_12" });

// When user logs in with a password:
// 1. Try Users collection with bcrypt.compare(pwd, user.password)
// 2. OR Try LegacyLogin with direct string comparison: pwd === legacy.password
// Both should work with current password
```

---

### Test 4.2: Timestamps Updated

```
User changes password:
Expected:
✅ Users collection: updatedAt = now
✅ LegacyLogin collection: updatedAt = now

Admin resets password:
Expected:
✅ Users collection: updatedAt = now
✅ LegacyLogin collection: updatedAt = now
```

**Verification:**
```javascript
db.users.findOne({ username: "venkat_12" }).updatedAt
db.login.findOne({ username: "venkat_12" }).updatedAt

// Both should be recent timestamps
```

---

## Test Suite 5: Audit & Logging

### Test 5.1: Admin Actions Logged

```
When admin resets credentials:
Expected in server logs:
✅ "ADMIN ACTION: RESET_USER_CREDENTIALS by user {adminId}"
✅ Details include:
   - userId: {id}
   - userName: {first} {last}
   - email: {email}
   - emailSent: true/false
```

---

## Checklist for All Tests

### Password Sync Tests
- [ ] Test 1.1: User changes password successfully
- [ ] Test 1.2a: Wrong current password rejected
- [ ] Test 1.2b: Mismatched new passwords rejected
- [ ] Test 1.2c: Password too short rejected
- [ ] Test 1.3: Login with new password works
- [ ] Test 1.3: Login with old password fails

### Admin Reset Tests
- [ ] Test 2.1: Admin reset succeeds
- [ ] Test 2.1: Response shows new credentials
- [ ] Test 2.1: Users collection updated
- [ ] Test 2.1: LegacyLogin collection updated
- [ ] Test 2.1: Email sent (if available)
- [ ] Test 2.2: Login with new credentials works
- [ ] Test 2.2: Login with old credentials fails
- [ ] Test 2.3: Non-admin can't access reset

### Edge Cases
- [ ] Test 3.1: User without serNo handled
- [ ] Test 3.2: Email failure handled gracefully
- [ ] Test 3.3: Rapid changes handled

### Database Consistency
- [ ] Test 4.1: Collections stay in sync
- [ ] Test 4.2: Timestamps updated correctly

### Logging & Audit
- [ ] Test 5.1: Admin actions logged

---

## Sign-Off

When all tests pass, complete this form:

```
Test Date: _______________
Tester Name: _______________
Environment: _______________

Password Sync: ✅ PASS / ❌ FAIL
Admin Reset: ✅ PASS / ❌ FAIL
Edge Cases: ✅ PASS / ❌ FAIL
Database: ✅ PASS / ❌ FAIL
Logging: ✅ PASS / ❌ FAIL

Overall Status: ✅ READY / ❌ ISSUES

Notes:
_________________________
_________________________
```

---

## Troubleshooting

### Backend logs don't show sync message
```
Check: server/routes/users.js has console.log statements
Solution: Restart backend server: npm run server
```

### Password change succeeds but login fails
```
Check: Both collections for updated password
Solution: 
  1. Verify MongoDB connection
  2. Check serNo exists on user
  3. Admin reset to force sync
```

### Admin reset shows no response
```
Check: Backend server running and logs
Solution:
  1. Check F12 → Network tab for error response
  2. Check backend logs for exceptions
  3. Verify admin has proper token
```

### Email not sent
```
Check: .env has Gmail credentials
Solution:
  1. Verify GMAIL_EMAIL and GMAIL_APP_PASSWORD in .env
  2. Check backend logs for email errors
  3. Use response credentials if email fails
```

---

**Ready to test! Good luck!** 🚀