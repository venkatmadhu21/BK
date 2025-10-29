# Admin Username Login Setup

## ✅ Changes Made

1. **Updated `server/routes/auth.js`**
   - Added support for admin username login: `admin_1` / `admin1234`
   - Also supports legacy email login: `admin123@gmail.com` / `1234567890`
   - Admin user is auto-created on first login attempt if not exists

2. **Updated `server/models/LegacyLogin.js` & `LegacyLoginCap.js`**
   - Added `username` field (indexed)
   - Added `firstName` and `lastName` fields
   - Now stores all required fields for login

3. **Updated `server/routes/admin.js`**
   - Now saves credentials to legacy login collection with all fields:
     - email, username, password, serNo, serno, firstName, lastName, isActive

4. **Updated `client/src/pages/Login.jsx`**
   - Form sends: `{ username, password }`

## 🚀 To Use Admin Login

### Step 1: Start MongoDB
```bash
# On Windows, if MongoDB is installed as service:
net start MongoDB

# Or if running manually:
mongod
```

### Step 2: Start the Server
```bash
# From root directory
npm run server
# or
npm run dev
```

### Step 3: Login with Admin Credentials
- **Username**: `admin_1`
- **Password**: `admin1234`

## 🔍 Troubleshooting

### Error: "Please provide email or username"
- ✅ Fixed: The login form now sends `username` field
- Make sure you're entering username (admin_1), not email

### Error: 400 Bad Request
1. **Check MongoDB Connection**
   - Ensure MongoDB is running on `localhost:27017`
   - Check `.env` file: `MONGO_URI=mongodb://localhost:27017/bal-krishna-nivas`

2. **Check Server is Running**
   - Look for console message: `MongoDB Connected Successfully`
   - API should respond at: `http://localhost:5000/api/auth/login`

3. **Check Environment Variables**
   - File: `server/.env`
   - Must have: `JWT_SECRET=your_jwt_secret_key_here`

### Error: Database Connection Timeout
- MongoDB service may not be running
- Check if MongoDB is listening on port 27017
- Verify `MONGO_URI` in `server/.env`

## 📋 Default Admin Credentials

| Field | Value |
|-------|-------|
| Username | `admin_1` |
| Password | `admin1234` |
| Email | `admin123@gmail.com` |
| Role | `admin` |
| IsAdmin | `true` |

**Note**: Admin user is auto-created on first successful login attempt if not already in database.

## 🧪 Verification

To verify admin data is saved correctly:
1. Run: `node verify-legacy-login.js`
2. Check if "admin_1" appears in login collection

## 📝 Regular User Login Flow (After Admin Approval)

When an admin approves a hierarchy form:
1. ✅ Member record created with s.no
2. ✅ User account created in `Users` collection
3. ✅ Login record created in `login` collection (legacy)
4. ✅ Username generated as: `firstName_serialNumber` (e.g., venkat_21)
5. ✅ Credentials email sent
6. ✅ User can login with username: `venkat_21`

## 🔐 Security Notes

- Temporary passwords are auto-generated (12 chars: uppercase, lowercase, numbers, symbols)
- Passwords stored as bcrypt hashes in `Users` collection
- Plaintext passwords in legacy `login` collection for backward compatibility
- All credentials are sent via email using Gmail SMTP
- Users should change password on first login
