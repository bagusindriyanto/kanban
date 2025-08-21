const express = require('express');
const router = express.Router();
const tasksController = require('../controller/tasks');

// Get all tasks
router.get('/', tasksController.getAllTasks);

// Add new task
router.post('/', tasksController.addNewTask);

// Update task status
router.put('/:id/status', tasksController.updateTaskStatus);

module.exports = router;
