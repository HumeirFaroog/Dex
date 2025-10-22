const mongoose = require('mongoose');

let isConnected = false;
let useInMemory = false;

const connectDB = async () => {
  // Check if MongoDB URI is provided
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI === '') {
    console.log('⚠️  MongoDB URI not provided. Using in-memory storage.');
    useInMemory = true;
    // Ensure in-memory data is initialized
    try {
      const { ensureDataInitialized } = require('../storage/inMemoryStore.js');
      await ensureDataInitialized();
    } catch (err) {
      console.error('Error initializing in-memory data:', err);
    }
    return { useInMemory: true };
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return { useInMemory: false, connection: conn };
  } catch (error) {
    console.warn(`⚠️  MongoDB connection failed: ${error.message}`);
    console.log('📦 Falling back to in-memory storage...');
    useInMemory = true;
    // Ensure in-memory data is initialized
    try {
      const { ensureDataInitialized } = require('../storage/inMemoryStore.js');
      await ensureDataInitialized();
    } catch (err) {
      console.error('Error initializing in-memory data:', err);
    }
    return { useInMemory: true };
  }
};

const getStorageMode = () => useInMemory;
const getConnectionStatus = () => isConnected;

module.exports = connectDB;
module.exports.getStorageMode = getStorageMode;
module.exports.getConnectionStatus = getConnectionStatus;
