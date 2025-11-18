import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import universityRoutes from './routes/university.js';
import roadmapRoutes from './routes/roadmap.js';
import careerRoutes from './routes/career.js';
import aptitudeRoutes from './routes/aptitude.js';
import adminRoutes from './routes/admin.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { logger } from './utils/logger.js';

// Import database connection and models
import { connectDB, disconnectDB, ensureConnection } from './config/database.js';
import { initializeModels } from './models/index.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
const allowedOrigins = NODE_ENV === 'development' 
  ? ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173']
  : process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',')
    : process.env.RENDER_EXTERNAL_URL
      ? [process.env.RENDER_EXTERNAL_URL]
      : process.env.VERCEL_URL 
        ? [`https://${process.env.VERCEL_URL}`, `https://${process.env.VERCEL_URL.replace('https://', '')}`]
        : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || allowedOrigins.some(allowed => origin?.includes(allowed))) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in production for now
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
  optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS) / 1000 / 60),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Speed limiting
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 50
});

app.use('/api/', limiter);
app.use('/api/', speedLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
  });
});

// Test endpoint for debugging
app.get('/test', (req, res) => {
  res.status(200).json({
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    cors: {
      origin: NODE_ENV === 'development' 
        ? ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173']
        : process.env.CORS_ORIGIN || 'http://localhost:3000'
    }
  });
});

// API routes
const API_VERSION = process.env.API_VERSION || 'v1';
const apiPrefix = `/api/${API_VERSION}`;

app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/user`, userRoutes);
app.use(`${apiPrefix}/university`, universityRoutes);
app.use(`${apiPrefix}/roadmap`, roadmapRoutes);
app.use(`${apiPrefix}/career`, careerRoutes);
app.use(`${apiPrefix}/aptitude`, aptitudeRoutes);
app.use(`${apiPrefix}/admin`, adminRoutes);

// Serve static files in production
if (NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../../frontend/dist/index.html'));
  });
}

// Database connection middleware for serverless (Vercel)
// This ensures DB is connected before handling any request
if (process.env.VERCEL) {
  app.use(async (req, res, next) => {
    try {
      // Ensure database connection is ready before processing request
      const connection = await ensureConnection();
      // Initialize models if not already initialized
      if (connection && connection.readyState === 1) {
        initializeModels(connection);
      }
      next();
    } catch (error) {
      logger.error('Database connection error in request:', error);
      // Initialize models in demo mode if connection fails
      initializeModels(null);
      // Continue anyway - routes should handle missing DB gracefully
      next();
    }
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Database connection and server startup
let dbConnection = null;

const initializeDatabase = async () => {
  try {
    // Try to connect to MongoDB
    try {
      dbConnection = await connectDB();
      logger.info('✅ MongoDB connected successfully');
      
      // Initialize models after database connection
      initializeModels(dbConnection);
      logger.info('✅ Models initialized successfully');
    } catch (dbError) {
      logger.warn('⚠️ MongoDB connection failed. Running in demo mode with placeholder data.');
      logger.warn('To enable full functionality, please set up MongoDB database.');
      logger.warn('Error:', dbError.message);
      
      // Initialize models with null connection for demo mode
      initializeModels(null);
      logger.info('✅ Models initialized in demo mode');
    }
  } catch (error) {
    logger.error('Unable to initialize database:', error);
    throw error;
  }
};

const startServer = async () => {
  try {
    await initializeDatabase();
    
    // Start server
    // Listen on 0.0.0.0 to accept connections from all network interfaces (required for Render)
    const HOST = process.env.HOST || '0.0.0.0';
    app.listen(PORT, HOST, () => {
      logger.info(`🚀 Server running in ${NODE_ENV} mode on ${HOST}:${PORT}`);
      logger.info(`📊 Health check: http://${HOST}:${PORT}/health`);
      logger.info(`🔗 API Base URL: http://${HOST}:${PORT}${apiPrefix}`);
      if (NODE_ENV === 'development') {
        logger.info(`🌐 Frontend URL: http://localhost:3000`);
      }
      if (process.env.RENDER_EXTERNAL_URL) {
        logger.info(`🌐 Render URL: ${process.env.RENDER_EXTERNAL_URL}`);
      }
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  try {
    await disconnectDB();
  } catch (error) {
    logger.warn('Database already closed or not connected.');
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  try {
    await disconnectDB();
  } catch (error) {
    logger.warn('Database already closed or not connected.');
  }
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Initialize database connection for serverless (Vercel)
// In serverless, we don't pre-connect - connection happens on first request via middleware
if (process.env.VERCEL) {
  // On Vercel, try to pre-connect (optional - middleware will handle if this fails)
  initializeDatabase().catch((err) => {
    logger.warn('Pre-connection failed (will connect on first request):', err.message);
  });
} else {
  // In standalone mode, start the server
  startServer();
}

// Export app for Vercel serverless functions
export default app;
