import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

// Cache the connection to reuse in serverless environments
let cachedConnection = null;

const connectDB = async () => {
  try {
    // If already connected, return the cached connection
    if (cachedConnection && mongoose.connection.readyState === 1) {
      logger.info('Using existing MongoDB connection');
      return mongoose.connection;
    }

    // If connection exists but is not ready, wait for it
    if (cachedConnection && mongoose.connection.readyState === 2) {
      logger.info('MongoDB connection in progress, waiting...');
      await new Promise((resolve, reject) => {
        mongoose.connection.once('connected', resolve);
        mongoose.connection.once('error', reject);
        setTimeout(() => reject(new Error('Connection timeout')), 10000);
      });
      return mongoose.connection;
    }

    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dream_uni_finder';
    
    if (!MONGODB_URI || MONGODB_URI.includes('username:password')) {
      throw new Error('MONGODB_URI is not properly configured. Please set it in your environment variables.');
    }

    // Connection options optimized for serverless
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 1, // Maintain at least 1 socket connection
      maxIdleTimeMS: 30000, // Close connections after 30s of inactivity
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // Disable mongoose buffering
    };

    logger.info('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, options);
    
    cachedConnection = mongoose.connection;
    logger.info('✅ MongoDB Connected successfully.');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
      cachedConnection = null;
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
      cachedConnection = null;
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
      cachedConnection = mongoose.connection;
    });
    
    return mongoose.connection;
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    cachedConnection = null;
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      cachedConnection = null;
      logger.info('MongoDB disconnected');
    }
  } catch (error) {
    logger.error('MongoDB disconnection error:', error);
  }
};

// Helper function to ensure connection is ready (for serverless)
const ensureConnection = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  return await connectDB();
};

export { connectDB, disconnectDB, ensureConnection, mongoose };
