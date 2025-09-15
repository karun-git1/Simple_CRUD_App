// routes/todos.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Check if MongoDB is connected
const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

// In-memory storage for development (when MongoDB is not available)
let todos = [];
let nextId = 1;

// Create
router.post('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      const Todo = require('../models/Todo');
      const todo = new Todo({ text: req.body.text });
      await todo.save();
      res.status(201).json(todo);
    } else {
      // Use in-memory storage
      const todo = {
        _id: nextId++,
        text: req.body.text,
        done: false,
        createdAt: new Date()
      };
      todos.push(todo);
      res.status(201).json(todo);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      const Todo = require('../models/Todo');
      const todos = await Todo.find().sort('-createdAt');
      res.json(todos);
    } else {
      // Use in-memory storage
      res.json(todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const Todo = require('../models/Todo');
      const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!todo) return res.status(404).json({ error: 'Not found' });
      res.json(todo);
    } else {
      // Use in-memory storage
      const id = parseInt(req.params.id);
      const todoIndex = todos.findIndex(t => t._id === id);
      if (todoIndex === -1) return res.status(404).json({ error: 'Not found' });
      
      todos[todoIndex] = { ...todos[todoIndex], ...req.body };
      res.json(todos[todoIndex]);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const Todo = require('../models/Todo');
      const todo = await Todo.findByIdAndDelete(req.params.id);
      if (!todo) return res.status(404).json({ error: 'Not found' });
      res.json({ success: true });
    } else {
      // Use in-memory storage
      const id = parseInt(req.params.id);
      const todoIndex = todos.findIndex(t => t._id === id);
      if (todoIndex === -1) return res.status(404).json({ error: 'Not found' });
      
      todos.splice(todoIndex, 1);
      res.json({ success: true });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
