const jwt = require('jsonwebtoken');
const { getUserModel } = require('../utils/modelHelper.js');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
    const decoded = jwt.verify(token, secret);
    const User = getUserModel();
    let user = await User.findById(decoded.id);
    
    // Remove password from user object
    if (user && user.password) {
      const { password, ...userWithoutPassword } = user;
      user = userWithoutPassword;
    }
    
    req.user = user;
    
    if (!req.user || !req.user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role '${req.user.role}' is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };

