const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');

const JWT_SECRET = 'your-secret-key';

// Middleware to verify token
const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication required' });
    }
};

// Get all tasks
router.get('/', auth, async (req, res) => {
    try {
        const { filter } = req.query;
        let query = { userId: req.userId };
        
        if (filter === 'completed') query.completed = true;
        if (filter === 'pending') query.completed = false;
        
        const tasks = await Task.find(query).sort({ dueDate: 1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create task
router.post('/', auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            userId: req.userId
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle task status
router.patch('/:id/toggle', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        task.completed = !task.completed;
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
