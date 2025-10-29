# 🎨 Frontend Integration Guide - Credential Management

## 🎯 What Frontend Needs to Implement

### 1. User Password Change Feature
**Location**: User Settings/Profile Page

### 2. Admin Credential Reset Feature
**Location**: Admin Users Management Panel

---

## 📝 Implementation Examples

### Feature 1: User Password Change (Settings Page)

#### Component Structure
```jsx
// components/ChangePassword.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validate
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        '/api/users/change-password',
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        { headers: { 'x-auth-token': token } }
      );

      setMessage(response.data.message);
      if (response.data.synced) {
        setMessage(response.data.message + ' ✅ Synced to all systems');
      } else if (response.data.warning) {
        setMessage(response.data.message + ' ⚠️ ' + response.data.warning);
      }

      // Clear form
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });

      // Show success for 3 seconds then redirect
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error changing password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Change Password</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            minLength="6"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Enter new password (min 6 chars)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Confirm new password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
```

---

### Feature 2: Admin Credential Reset (Users Management)

#### Component Structure
```jsx
// components/AdminUsersList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [resetResult, setResetResult] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users', {
        headers: { 'x-auth-token': token }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleResetCredentials = async (userId, user) => {
    setSelectedUser(user);
    setShowResetModal(true);
  };

  const confirmResetCredentials = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `/api/admin/users/${selectedUser._id}/reset-credentials`,
        {},
        { headers: { 'x-auth-token': token } }
      );

      setResetResult(response.data);
    } catch (error) {
      setResetResult({
        message: 'Error resetting credentials',
        error: error.response?.data?.error || error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Users Management</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-left">Username</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="border p-3">
                  {user.firstName} {user.lastName}
                </td>
                <td className="border p-3">{user.email}</td>
                <td className="border p-3">{user.username || 'N/A'}</td>
                <td className="border p-3">
                  <span className={`px-3 py-1 rounded ${
                    user.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="border p-3">
                  <button
                    onClick={() => handleResetCredentials(user._id, user)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded"
                  >
                    Reset Credentials
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reset Credentials Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            {!resetResult ? (
              <>
                <h3 className="text-xl font-bold mb-4">Reset Credentials?</h3>
                <p className="mb-4 text-gray-600">
                  Are you sure you want to reset credentials for{' '}
                  <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong>?
                </p>
                <p className="mb-6 text-sm text-gray-500">
                  A new password will be generated and sent to their email.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowResetModal(false)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmResetCredentials}
                    disabled={loading}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Confirm Reset'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  {resetResult.error ? (
                    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                      <p className="font-bold">Error</p>
                      <p>{resetResult.message}</p>
                      <p className="text-sm mt-2">{resetResult.error}</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                      <p className="font-bold">✅ Success!</p>
                      <p>{resetResult.message}</p>
                    </div>
                  )}
                </div>

                {resetResult.credentials && (
                  <div className="bg-gray-50 p-4 rounded mb-4">
                    <h4 className="font-bold mb-3">New Credentials:</h4>
                    
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">
                        Username
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={resetResult.credentials.username}
                          readOnly
                          className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded"
                        />
                        <button
                          onClick={() => 
                            copyToClipboard(resetResult.credentials.username)
                          }
                          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">
                        Temporary Password
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={resetResult.credentials.temporaryPassword}
                          readOnly
                          className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded font-mono"
                        />
                        <button
                          onClick={() => 
                            copyToClipboard(
                              resetResult.credentials.temporaryPassword
                            )
                          }
                          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <input
                        type="text"
                        value={resetResult.credentials.email}
                        readOnly
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                )}

                <p className="text-sm text-gray-600 mb-4">
                  {resetResult.emailSent ? (
                    <span className="text-green-600">
                      ✅ Credentials email sent to user
                    </span>
                  ) : (
                    <span className="text-orange-600">
                      ⚠️ {resetResult.note || 'Email sending failed'}
                    </span>
                  )}
                </p>

                <button
                  onClick={() => {
                    setShowResetModal(false);
                    setResetResult(null);
                    fetchUsers();
                  }}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersList;
```

---

## 🔌 API Integration Checklist

### For User Password Change
```jsx
// In your auth context or API service:

const changePassword = async (currentPassword, newPassword) => {
  const response = await axios.put(
    '/api/users/change-password',
    { currentPassword, newPassword },
    { 
      headers: { 
        'x-auth-token': localStorage.getItem('token')
      } 
    }
  );
  return response.data;
};
```

### For Admin Credential Reset
```jsx
// In your admin context or API service:

const resetUserCredentials = async (userId) => {
  const response = await axios.put(
    `/api/admin/users/${userId}/reset-credentials`,
    {},
    { 
      headers: { 
        'x-auth-token': localStorage.getItem('token')
      } 
    }
  );
  return response.data;
};
```

---

## 🎨 UI/UX Best Practices

### Settings/Profile Page
- ✅ Easy access to "Change Password" option
- ✅ Current password verification required
- ✅ Password strength indicator
- ✅ Confirmation password field
- ✅ Clear success/error messages
- ✅ Redirect to login on success (optional)

### Admin Users Panel
- ✅ "Reset Credentials" button visible for each user
- ✅ Confirmation modal before reset
- ✅ Display new credentials clearly
- ✅ Copy-to-clipboard buttons for easy sharing
- ✅ Show if email was sent successfully
- ✅ Option to manually share credentials if email fails

---

## 📱 Mobile Responsive

### Change Password Form
```jsx
// Mobile-first approach:
<div className="max-w-md mx-auto sm:max-w-lg">
  {/* Same form as above */}
</div>
```

### Admin Users Table
```jsx
// Responsive table with mobile collapse:
<div className="overflow-x-auto sm:overflow-x-visible">
  <table className="w-full">
    {/* Same table */}
  </table>
</div>
```

---

## ✅ Testing Checklist

### Test Change Password
- [ ] User cannot change password with wrong current password
- [ ] User must enter matching new passwords
- [ ] Password minimum 6 characters enforced
- [ ] Password changes in Users collection ✓
- [ ] Password syncs to LegacyLogin ✓
- [ ] Old password no longer works ✓
- [ ] New password works for login ✓

### Test Admin Reset Credentials
- [ ] Admin can see users list ✓
- [ ] Admin can reset user credentials ✓
- [ ] New credentials returned in response ✓
- [ ] Email sent with new credentials (if email works) ✓
- [ ] Users collection updated ✓
- [ ] LegacyLogin collection updated ✓
- [ ] Old password no longer works ✓
- [ ] New password works for login ✓
- [ ] Non-admin users cannot access reset endpoint ✓

---

## 🚀 Deployment Notes

### Before Going Live
1. Test all credential flows end-to-end
2. Ensure email service is configured
3. Update user documentation
4. Train admins on new feature
5. Create user onboarding with password change prompt
6. Add password requirements to help/FAQ

### Monitoring
- Track password reset usage
- Monitor for email delivery issues
- Log all credential resets for audit
- Watch for failed login attempts
- Alert on multiple reset attempts

---

## 📚 Documentation for Users

### In-App Help Section
```markdown
# How to Change Your Password

1. Go to Settings
2. Click "Change Password"
3. Enter your current password
4. Enter a new password (minimum 6 characters)
5. Confirm your new password
6. Click "Change Password"

Your password will be synced across all systems automatically.

# If You Forgot Your Password

Contact an admin to reset your credentials. 
An admin will generate a new temporary password 
and send it to your email.
```

---

## 🔐 Security Reminders

- Never log passwords in UI
- Always use HTTPS in production
- Implement rate limiting on auth endpoints
- Add CAPTCHA for multiple failed attempts
- Expire session after password change (optional)
- Consider 2FA for admin accounts