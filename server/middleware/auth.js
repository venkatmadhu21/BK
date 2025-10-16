const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminAuth = (req, res, next) => {
  // First check basic auth
  auth(req, res, (err) => {
    if (err || !req.user) return;

    // Check if user is admin
    if (req.user.role !== 'admin' && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  });
};

module.exports = auth;
module.exports.adminAuth = adminAuth;
