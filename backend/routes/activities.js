const express = require('express');
const router = express.Router();
const activitiesController = require('../controller/activities');

// Get all activities
router.get('/', activitiesController.getAllActivities);

// Add new activity
router.post('/', activitiesController.addNewActivity);

module.exports = router;
