# Credential Management Guide

## 📋 Current Issues

### Problem 1: No Credential Reset for Admin
- Once admin approves a form and credentials are generated, there's no way to change them
- If user loses password, there's no reset mechanism
- Users in LegacyLogin collection don't get updated when password changes

### Problem 2: Dual System Not Synced
- Users collection (bcrypt hashed) ✓
- LegacyLogin collection (plaintext) - **NOT SYNCED** ❌
- When user changes password, only Users collection updates
- Legacy login still has old plaintext password

### Problem 3: No Admin Credential Reset
- Admin can't regenerate credentials for existing users
- No way to reset forgotten passwords
- No audit trail of credential changes

---

## 🔧 SOLUTIONS TO IMPLEMENT

### Solution 1: Add Credential Reset Endpoint
**New endpoint**: `PUT /api/admin/users/:userId/reset-credentials`

**What it does:**
- Admin can reset any user's credentials
- Generates new temporary password
- Updates both Users and LegacyLogin collections
- Sends new credentials via email
- Returns the new credentials

**Example:**
```bash
PUT /api/admin/users/12/reset-credentials
```

Response:
```json
{
  "message": "Credentials reset successfully",
  "credentials": {
    "username": "venkat_12",
    "temporaryPassword": "NewP@ssw0rd123",
    "email": "venkat@example.com"
  },
  "emailSent": true
}
```

---

### Solution 2: Sync Password Changes
**Update change-password endpoint** to also update LegacyLogin

Current flow:
```
User changes password
  ↓
Updates Users collection ✓
  ↓
LegacyLogin stays with OLD password ❌
```

New flow:
```
User changes password
  ↓
Updates Users collection ✓
  ↓
Updates LegacyLogin collection ✓
  ↓
Success
```

---

### Solution 3: Add Password Reset (Forgot Password)
**New endpoint**: `POST /api/auth/forgot-password`

**What it does:**
- User enters email/username
- System sends reset link via email
- User clicks link and sets new password
- Updates both Users and LegacyLogin

---

## 🛠️ RECOMMENDED IMPLEMENTATION ORDER

### Phase 1 (URGENT): Fix Password Sync ⚡
**File**: `server/routes/users.js`
- Modify `change-password` endpoint to update LegacyLogin
- Affects: Users who change their password

### Phase 2 (HIGH): Add Admin Credential Reset 🔐
**File**: `server/routes/admin.js`
- New endpoint: `PUT /api/admin/users/:userId/reset-credentials`
- Allows admin to regenerate any user's credentials
- Affects: Admin management of user accounts

### Phase 3 (MEDIUM): Add Password Reset Link 📧
**File**: `server/routes/auth.js`
- New endpoint: `POST /api/auth/forgot-password`
- Sends reset link via email
- Affects: Users who forgot their password

---

## 📊 Credential Management Workflow

```
New User Flow:
┌─────────────────────────────────┐
│ Admin Approves Hierarchy Form    │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│ Generate Credentials:           │
│ - Username: firstName_serNo     │
│ - Password: Random (12 chars)   │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│ Save to Users Collection        │ (bcrypt hashed)
│ Save to LegacyLogin Collection  │ (plaintext)
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│ Send Email with Credentials     │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│ User Receives Credentials       │
│ Email contains:                 │
│ - Username: venkat_12           │
│ - Password: xyz123!@#           │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│ User Logs In                    │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│ (Optional) User Changes Password│
│ - Old: /api/users/change-password
│ - Syncs to BOTH collections ✓   │
└─────────────────────────────────┘


Admin Reset Flow (TO BE ADDED):
┌─────────────────────────────────┐
│ Admin: "Reset this user"        │
│ PUT /api/admin/users/:id/...    │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│ Generate New Temporary Password │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│ Update Users Collection         │
│ Update LegacyLogin Collection   │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│ Send New Credentials via Email  │
└─────────────────────────────────┘
```

---

## 🚨 ACTION ITEMS

- [ ] Implement Phase 1: Fix password sync in users.js
- [ ] Implement Phase 2: Add admin credential reset in admin.js
- [ ] Implement Phase 3: Add forgot password in auth.js
- [ ] Test all flows end-to-end
- [ ] Update frontend to use new endpoints
- [ ] Add UI for admin credential reset
- [ ] Add UI for user password reset

---

## 📝 Example: After Approval

**Current State:**
- Admin approves form
- User gets: username `venkat_12`, password `^X4h7d4mreIQ`
- User logs in successfully ✓

**If user forgets password:**
- ❌ No way to reset without admin intervention
- ❌ No forgot password link

**If admin wants different credentials:**
- ❌ No way to change them
- ❌ Must go into database manually

**AFTER FIXES:**
- ✅ Admin can: `PUT /api/admin/users/12/reset-credentials`
- ✅ User can: `POST /api/auth/forgot-password` with email
- ✅ Both options sync to Users AND LegacyLogin collections