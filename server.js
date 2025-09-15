// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const todosRouter = require('./routes/todos');

// API routes
app.use('/api/todos', todosRouter);

// Health check route for Render
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Simple CRUD App is running!',
    timestamp: new Date().toISOString()
  });
});

// Serve index.html for root route
app.get('/', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).send('Error loading application');
  }
});

// Fallback route - serve index.html for all unmatched routes (SPA routing)
app.get('*', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } catch (error) {
    console.error('Error serving fallback:', error);
    res.status(404).json({ error: 'Route not found' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Database connection and server startup
async function start() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/simple_crud';
    
    // Connect to MongoDB
    await mongoose.connect(uri, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 App available at: http://localhost:${PORT}`);
      console.log(`🏥 Health check at: http://localhost:${PORT}/health`);
    });
    
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

start();
