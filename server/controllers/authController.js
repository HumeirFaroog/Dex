const jwt = require('jsonwebtoken');
const { getUserModel, findUserWithPassword } = require('../utils/modelHelper.js');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
  if (!secret || secret === '') {
    console.warn('⚠️  WARNING: JWT_SECRET is not set. Using default secret. This is insecure for production!');
  }
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, dateOfBirth, address, specialization, licenseNumber, bloodGroup, emergencyContact } = req.body;

    const User = getUserModel();

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password for in-memory storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'patient',
      phone,
      dateOfBirth,
      address,
      specialization,
      licenseNumber,
      bloodGroup,
      emergencyContact,
      lastLogin: new Date()
    });

    // For MongoDB, save is needed
    if (user.save) {
      await user.save();
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user - normalize email to lowercase for comparison
    const normalizedEmail = email.toLowerCase().trim();
    console.log(`🔐 Login attempt for email: "${normalizedEmail}"`);
    
    const user = await findUserWithPassword({ email: normalizedEmail });
    
    if (!user) {
      console.log(`❌ Login attempt failed: User not found for email: "${normalizedEmail}"`);
      // Debug: List available users (only in development)
      if (process.env.NODE_ENV !== 'production') {
        const User = getUserModel();
        if (typeof User.find === 'function') {
          const allUsers = await User.find({});
          console.log('📋 Available users:', allUsers.map(u => ({ 
            email: u?.email || 'NO EMAIL', 
            role: u?.role || 'NO ROLE',
            isActive: u?.isActive 
          })));
        } else {
          // For in-memory store, access users directly
          const { userStore } = require('../storage/inMemoryStore.js');
          const allUsers = await userStore.find({});
          console.log('📋 Available users (in-memory):', allUsers.map(u => ({ 
            email: u?.email || 'NO EMAIL', 
            role: u?.role || 'NO ROLE',
            isActive: u?.isActive 
          })));
        }
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log(`✅ User found: ${user.email} (${user.role})`);

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Check password
    let isMatch;
    if (user.matchPassword) {
      // MongoDB model method
      isMatch = await user.matchPassword(password);
    } else {
      // In-memory: compare directly
      if (!user.password) {
        console.log(`Login attempt failed: User ${user.email} has no password stored`);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      isMatch = await bcrypt.compare(password, user.password);
    }
    
    if (!isMatch) {
      console.log(`Login attempt failed: Invalid password for email: ${normalizedEmail}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    const User = getUserModel();
    user.lastLogin = new Date();
    if (user.save) {
      await user.save();
    } else {
      await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
    }

    const token = generateToken(user._id);

    console.log(`✅ Successful login: ${user.email} (${user.role})`);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const User = getUserModel();
    const user = await User.findById(req.user.id);
    
    // Remove password from response
    if (user && user.password) {
      const { password, ...userWithoutPassword } = user;
      return res.json({
        success: true,
        user: userWithoutPassword
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const allowedUpdates = ['name', 'phone', 'dateOfBirth', 'address', 'specialization', 'licenseNumber', 'bloodGroup', 'emergencyContact'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    const User = getUserModel();
    const user = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Remove password from response
    if (user && user.password) {
      const { password, ...userWithoutPassword } = user;
      return res.json({
        success: true,
        user: userWithoutPassword
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};
