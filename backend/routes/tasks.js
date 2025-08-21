const express = require('express');
const router = express.Router();
const tasksController = require('../controller/tasks');

// Get all tasks
router.get('/', tasksController.getAllTasks);

// Add new task
router.post('/', tasksController.addNewTask);

module.exports = router;
