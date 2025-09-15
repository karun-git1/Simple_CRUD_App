// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const todosRouter = require('./routes/todos');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/todos', todosRouter);

// Health check route for Render
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Simple CRUD App is running!' });
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fallback route - serve index.html for all unmatched routes (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

async function start(){
  try{
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/simple_crud';
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
  }catch(err){
    console.error('Failed to start', err);
  }
}

start();
