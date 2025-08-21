const express = require('express');
const router = express.Router();
const picsController = require('../controller/pics');

// Get all pics
router.get('/', picsController.getAllPics);

// Add new pics
router.post('/', picsController.addNewPic);

module.exports = router;
