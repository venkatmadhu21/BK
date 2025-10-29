# 🔐 Credential Management - Complete Usage Guide

## ✅ What's New

### 1. **Password Sync Between Collections** ✅ IMPLEMENTED
When a user changes their password:
- ✅ Updates Users collection (bcrypt hashed)
- ✅ Syncs to LegacyLogin collection (plaintext)
- Both systems stay in sync automatically

### 2. **Admin Credential Reset** ✅ IMPLEMENTED  
Admins can now reset any user's credentials and regenerate a new password.

### 3. **Password Reset Link** ⏳ COMING SOON
Users can request password reset via email (Phase 3)

---

## 📋 Use Cases & Solutions

### Use Case 1: User Changes Their Password
**Scenario**: User is logged in and wants to change password

**Flow**:
```
1. User goes to Settings → Change Password
2. User enters: Current Password + New Password
3. Frontend calls: PUT /api/users/change-password
4. Backend:
   ✅ Verifies current password
   ✅ Hashes new password for Users collection
   ✅ Updates Users collection
   ✅ Syncs plaintext password to LegacyLogin collection
5. Response includes: { message: "...", synced: true }
```

**Frontend Example**:
```javascript
const changePassword = async (currentPassword, newPassword) => {
  const response = await axios.put('/api/users/change-password', {
    currentPassword,
    newPassword
  }, {
    headers: { 'x-auth-token': token }
  });
  
  console.log(response.data.message);
  if (response.data.synced) {
    console.log('✅ Password synced to all systems');
  } else {
    console.log('⚠️', response.data.warning);
  }
};
```

---

### Use Case 2: Admin Needs to Reset User's Credentials
**Scenario**: 
- User forgets password
- User lost their credentials email
- Admin needs to give new credentials
- User needs credentials changed

**Flow**:
```
1. Admin goes to Users Management
2. Admin clicks "Reset Credentials" on a user
3. Frontend calls: PUT /api/admin/users/{userId}/reset-credentials
4. Backend:
   ✅ Generates new temporary password
   ✅ Updates Users collection with new hashed password
   ✅ Updates LegacyLogin collection with new plaintext password
   ✅ Sends email with new credentials to user
   ✅ Returns new credentials to admin
5. Admin sees new credentials and can share them
6. User receives email with new credentials
```

**API Endpoint**:
```bash
PUT /api/admin/users/:userId/reset-credentials
Authorization: Bearer {admin-token}
```

**Response**:
```json
{
  "message": "Credentials reset successfully",
  "credentials": {
    "username": "venkat_12",
    "temporaryPassword": "XyZ9@pQr2mK",
    "email": "venkat@example.com",
    "firstName": "Venkat",
    "lastName": "Kumar"
  },
  "emailSent": true,
  "note": "New credentials sent to user email"
}
```

**Frontend Example** (Admin Panel):
```javascript
const resetUserCredentials = async (userId) => {
  try {
    const response = await axios.put(
      `/api/admin/users/${userId}/reset-credentials`,
      {},
      { headers: { 'x-auth-token': adminToken } }
    );
    
    console.log('✅ Credentials reset successfully');
    console.log('New Username:', response.data.credentials.username);
    console.log('New Password:', response.data.credentials.temporaryPassword);
    
    if (response.data.emailSent) {
      console.log('📧 Email sent to user');
    } else {
      console.log('⚠️  Email failed - send manually:');
      console.log(response.data.credentials);
    }
  } catch (error) {
    console.error('❌ Error resetting credentials:', error);
  }
};
```

---

### Use Case 3: Admin Approves Hierarchy Form (Existing)
**Scenario**: Admin approves a new family member form

**Flow** (Already implemented):
```
1. Admin approves form
2. System:
   ✅ Creates Member record with sNo
   ✅ Generates username (firstName_sNo)
   ✅ Generates temporary password
   ✅ Saves to Users collection (bcrypt)
   ✅ Saves to LegacyLogin collection (plaintext)
   ✅ Sends email with credentials
3. User receives credentials and can login
4. User can change password later (syncs to both)
```

---

## 🚀 How to Test

### Test 1: Password Sync
```bash
# 1. Login as venkat_12 with password: ^X4h7d4mreIQ
# 2. Change password to: NewP@ss123
# 3. Logout
# 4. Try to login with: NewP@ss123 ✅ Should work
# 5. Check MongoDB collections:
#    - Users collection: password is bcrypt hashed ✓
#    - LegacyLogin collection: password is "NewP@ss123" ✓
```

### Test 2: Admin Reset Credentials
```bash
# 1. Login as admin with username: admin_1, password: admin1234
# 2. Go to Users Management
# 3. Find venkat_12 user
# 4. Click "Reset Credentials"
# 5. See response with new credentials:
#    - Username: venkat_12
#    - New password: (auto-generated)
# 6. Check email for credentials (if email service working)
# 7. Logout from admin
# 8. Login as venkat_12 with new password ✅ Should work
# 9. Verify both Users and LegacyLogin collections updated
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────┐
│ User Changes Password in Settings           │
└────────────┬────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────┐
│ PUT /api/users/change-password              │
│ Body: {                                     │
│   currentPassword: "xyz...",                │
│   newPassword: "abc..."                     │
│ }                                           │
└────────────┬────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────┐
│ Backend Process:                            │
│ 1. Verify current password ✓                │
│ 2. Hash new password                        │
│ 3. Update Users collection ✓                │
│ 4. Find serNo                               │
│ 5. Update LegacyLogin ✓                     │
│ 6. Update LegacyLoginCap ✓                  │
└────────────┬────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────┐
│ Response:                                   │
│ {                                           │
│   message: "Password updated...",           │
│   synced: true                              │
│ }                                           │
└─────────────────────────────────────────────┘


┌─────────────────────────────────────────────┐
│ Admin Clicks "Reset Credentials"            │
│ on venkat_12 in Admin Panel                 │
└────────────┬────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────┐
│ PUT /api/admin/users/{userId}/...           │
│ reset-credentials                           │
└────────────┬────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────┐
│ Backend Process:                            │
│ 1. Find user by ID                          │
│ 2. Generate new password                    │
│ 3. Hash & save to Users collection ✓        │
│ 4. Save plaintext to LegacyLogin ✓          │
│ 5. Save plaintext to LegacyLoginCap ✓       │
│ 6. Send email with new credentials ✓        │
│ 7. Log admin action ✓                       │
└────────────┬────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────┐
│ Response to Admin:                          │
│ {                                           │
│   message: "Credentials reset successfully",│
│   credentials: {                            │
│     username: "venkat_12",                  │
│     temporaryPassword: "New@Pass123",       │
│     email: "venkat@example.com"             │
│   },                                        │
│   emailSent: true                           │
│ }                                           │
└─────────────────────────────────────────────┘


┌─────────────────────────────────────────────┐
│ Both Collections Now Have New Password:     │
│ Users Collection:                           │
│   password: "$2a$10$hashed_new_password"    │
│ LegacyLogin Collection:                     │
│   password: "New@Pass123" (plaintext)       │
│ User email:                                 │
│   "Hi, your new password is: New@Pass123"  │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Implementation Details

### Modified Files

#### 1. `server/routes/users.js`
- ✅ Imports LegacyLogin and LegacyLoginCap
- ✅ Enhanced `PUT /api/users/change-password` endpoint
- Sync logic:
  - Gets user's serNo
  - Updates LegacyLogin collection
  - Falls back to LegacyLoginCap if not found
  - Returns sync status in response

#### 2. `server/routes/admin.js`
- ✅ Added new endpoint: `PUT /api/admin/users/:userId/reset-credentials`
- Generates new password using existing `generateTemporaryPassword()` function
- Updates both Users and LegacyLogin collections
- Sends email using emailService
- Logs admin action

---

## ⚠️ Important Notes

### Security Considerations
1. **Plaintext Passwords in LegacyLogin**: 
   - Stored plaintext for backward compatibility with legacy system
   - This is a design decision for the existing system
   - Future: Migrate entirely to bcrypt system

2. **Temporary Passwords**: 
   - Generated using secure random mix of uppercase, lowercase, numbers, symbols
   - Should be changed on first login (user prompted)
   - Never reuse old passwords

3. **Admin Actions Logged**: 
   - All credential resets logged with timestamp and admin ID
   - Provides audit trail

### Database Consistency
- If sync fails to LegacyLogin, response indicates this with warning
- User can still login with modern system (Users collection)
- Admin should be notified if sync fails
- Optional: Background job to resync missing passwords

---

## 🔄 Complete Credential Lifecycle

```
Step 1: Admin Approves Form
  ↓ Generated credentials saved to:
  - Users collection (bcrypt)
  - LegacyLogin collection (plaintext)
  - Email sent to user

Step 2: User Receives Credentials
  ↓ User can:
  - Login with username + password
  - Change password anytime

Step 3: User Changes Password
  ↓ System:
  - Updates Users collection
  - Syncs to LegacyLogin
  - Both in sync ✓

Step 4: User Forgets Password
  ↓ Admin can:
  - Reset credentials
  - Generate new password
  - Update both collections
  - Send new credentials via email

Step 5: User Logs In With New Credentials
  ↓ Both systems work:
  - Modern (Users collection)
  - Legacy (LegacyLogin collection)
```

---

## 📞 Troubleshooting

### Issue: Password Changed But Login Still Fails
**Cause**: Collections out of sync
**Solution**: 
```bash
# Admin can reset credentials to resync
PUT /api/admin/users/{userId}/reset-credentials
```

### Issue: Email Not Sent With Credentials
**Cause**: Email service issue
**Check**: 
- Gmail credentials in .env
- Response shows: `emailSent: false`
**Solution**: 
- Admin can manually share credentials from response
- Check email service logs

### Issue: User Not Found in LegacyLogin After Change
**Cause**: User created without serNo
**Solution**: 
- Ensure users have serNo before password changes
- Admin can reset credentials to force sync

---

## ✨ Next Steps (Phase 3)

- [ ] Add "Forgot Password" endpoint
- [ ] Create password reset email link
- [ ] Frontend UI for password reset
- [ ] Add password reset form to frontend
- [ ] Test complete forgot password flow
- [ ] Add password strength requirements
- [ ] Add password history (prevent reuse)

---

## 💡 Summary

**Before**:
- ❌ No way to change credentials after approval
- ❌ No password sync between collections
- ❌ Users stuck with generated credentials

**After**: 
- ✅ Users can change password (auto-syncs)
- ✅ Admin can reset credentials anytime
- ✅ Both Users and LegacyLogin stay in sync
- ✅ Email sent with new credentials
- ✅ Audit trail of all changes