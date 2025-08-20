// routes/pics.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all pics
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pics ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new pic
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const [result] = await db.query('INSERT INTO pics (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
