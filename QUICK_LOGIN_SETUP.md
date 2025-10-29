# Quick Login Setup for venkat_12

## ⚠️ Important: MongoDB Must Be Running!

Before you can save credentials and login, MongoDB must be running on your system.

### Step 1: Start MongoDB

**On Windows:**
```bash
# Option 1: If MongoDB is installed as a service
net start MongoDB

# Option 2: If you have MongoDB in your PATH
mongod

# Option 3: If you know MongoDB's installation directory
C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe
```

Once you see `waiting for connections on port 27017`, MongoDB is ready.

### Step 2: Keep MongoDB Running

- **Leave the MongoDB window open** (it needs to keep running in the background)
- Open a **new terminal/command prompt** for the next steps

### Step 3: Start the Backend Server

In the new terminal:
```bash
cd c:\Users\USER\Desktop\Bal-krishna\ Nivas
npm run server
```

Leave this running. You should see `Server is running on port 5000` or similar.

### Step 4: Save Login Credentials

Open another terminal/command prompt and run:
```bash
cd c:\Users\USER\Desktop\Bal-krishna\ Nivas
node save-venkat-credentials.js
```

You should see:
```
✅ Credentials saved successfully!

🔑 Login Credentials:
   Username: venkat_12
   Password: ^X4h7d4mreIQ
```

### Step 5: Test Login

1. Open your browser and go to `http://localhost:3000` or `http://localhost:5173`
2. Click Login
3. Enter:
   - **Username**: `venkat_12`
   - **Password**: `^X4h7d4mreIQ`
4. Click Login button

## 🐛 If You Still Get 400 Error

### Check MongoDB Connection
```bash
# In a terminal, verify MongoDB is running
netstat -ano | findstr :27017
```
If no output, MongoDB is not running. Go back to Step 1.

### Check Backend Logs
Look at the backend terminal where you ran `npm run server`:
- You should see logs when you try to login
- Any errors will be displayed there

### Check Frontend Console
In the browser:
1. Press `F12` to open Developer Tools
2. Go to **Console** tab
3. Try to login again
4. Share any error messages

## 📝 Credentials Details

| Field | Value |
|-------|-------|
| Username | `venkat_12` |
| Password | `^X4h7d4mreIQ` |
| Email | `venkat@example.com` |
| Serial No | 12 |
| First Name | Venkat |
| Last Name | Kumar |

## ✨ Next Steps After Successful Login

Once you're logged in:
1. You can change your password in profile settings
2. Update your personal information
3. View family tree and other features

---

**Need help?** Check the terminal windows for error messages and share them!