// routes/activities.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all activities
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM activities ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new activity
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const [result] = await db.query('INSERT INTO activities (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
