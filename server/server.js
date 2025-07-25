import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import noteRoutes from './routes/notes.js';
import folderRoutes from './routes/folders.js';
import personalityRoutes from './routes/personalities.js';
import draftRoutes from './routes/drafts.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();
console.log('--- Server Startup Log ---');
console.log('Environment variables loaded.');

const app = express();
const PORT = process.env.PORT || 5000;
console.log(`Attempting to start server on port: ${PORT}`);

// Keep-alive mechanism to prevent server from sleeping
setInterval(() => {
  console.log('🔄 Keep-alive ping:', new Date().toISOString());
}, 14 * 60 * 1000); // Every 14 minutes

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit the process, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process, just log the error
});

// Security middleware
console.log('Configuring security middleware (helmet, cors, rateLimit)...');
app.use(helmet());
const allowedOrigins = [
  'http://localhost:5173',
  'https://memocast.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('❌ CORS policy: This origin is not allowed'));
    }
  },
  credentials: true
}));

console.log(`CORS origin set to: ${process.env.CLIENT_URL || 'https://memocast.netlify.app'}`);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
console.log('Rate limiting configured.');

// Body parsing middleware
console.log('Configuring body parsing middleware...');
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
console.log('Body parsing middleware configured.');

// MongoDB connection
console.log(`Attempting to connect to MongoDB at: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/memocast'}`);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/memocast', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false
      
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('❌ MongoDB disconnected. Attempting to reconnect...');
  connectDB();
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected successfully');
});

// Routes
app.use('/api', uploadRoutes);

console.log('Registering API routes...');
app.use('/api/auth', (req, res, next) => {
  console.log(`➡️  Auth route hit: ${req.method} ${req.originalUrl}`);
  next();
}, authRoutes);
app.use('/api/notes', (req, res, next) => {
  console.log(`➡️  Notes route hit: ${req.method} ${req.originalUrl}`);
  next();
}, noteRoutes);
app.use('/api/folders', (req, res, next) => {
  console.log(`➡️  Folders route hit: ${req.method} ${req.originalUrl}`);
  next();
}, folderRoutes);
app.use('/api/personalities', (req, res, next) => {
  console.log(`➡️  Personalities route hit: ${req.method} ${req.originalUrl}`);
  next();
}, personalityRoutes);
app.use('/api/drafts', (req, res, next) => {
  console.log(`➡️  Drafts route hit: ${req.method} ${req.originalUrl}`);
  next();
}, draftRoutes);
console.log('API routes registered.');

// Health check
app.get('/api/health', (req, res) => {
  console.log('💚 Health check route hit.');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
console.log('Registering global error handling middleware...');
app.use((err, req, res, next) => {
  console.error('❌ Global error handler caught an error:');
  console.error('Error stack:', err.stack);
  console.error('Error message:', err.message);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});
console.log('Global error handling middleware registered.');


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('--- Server Startup Complete ---');
});