// routes/todos.js
const express = require('express');
const Todo = require('../models/Todo');
const router = express.Router();

// Create
router.post('/', async (req, res) => {
  try{
    const todo = new Todo({ text: req.body.text });
    await todo.save();
    res.status(201).json(todo);
  }catch(e){ res.status(500).json({ error: e.message }); }
});

// Read all
router.get('/', async (req, res) => {
  try{
    const todos = await Todo.find().sort('-createdAt');
    res.json(todos);
  }catch(e){ res.status(500).json({ error: e.message }); }
});

// Update
router.put('/:id', async (req, res) => {
  try{
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if(!todo) return res.status(404).json({ error: 'Not found' });
    res.json(todo);
  }catch(e){ res.status(500).json({ error: e.message }); }
});

// Delete
router.delete('/:id', async (req, res) => {
  try{
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if(!todo) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  }catch(e){ res.status(500).json({ error: e.message }); }
});

module.exports = router;
