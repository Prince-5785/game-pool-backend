require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('../models');
const Admin = db.Admin; // Changed from User to Admin

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
  
      if (err) {

        return res.status(403).json({ message: 'Invalid or expired token' });
      }
      
      // Find admin
      const admin = await Admin.findByPk(decoded.id); // Changed from user to admin
      
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      
      // if (admin.status !== 'active') {
      //   return res.status(403).json({ message: `Your account is ${admin.status}` });
      // }
      
      // Add admin to request
      req.user = {
        id: admin.id,
        email: admin.email,
        role: admin.role
      };
      
      next();
    });
    
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access Denied: Unauthorized Role' });
    }
    next();
  };
};

module.exports = { authMiddleware, authorizeRoles };
