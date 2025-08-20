const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new task
router.post('/', async (req, res) => {
  const {
    content,
    pic_id,
    detail,
    status = 'todo',
    timestamp_todo = new Date(),
    timestamp_progress = null,
    timestamp_done = null,
    timestamp_archived = null,
    minute_pause = 0,
    minute_activity = 0,
    pause_time = null,
  } = req.body;

  if (!content) return res.status(400).json({ error: 'Content is required' });

  try {
    const [result] = await db.query(
      `INSERT INTO tasks 
      (content, pic_id, detail, status, timestamp_todo, timestamp_progress, timestamp_done, timestamp_archived, minute_pause, minute_activity, pause_time) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        content,
        pic_id || null,
        detail || '',
        status,
        timestamp_todo,
        timestamp_progress,
        timestamp_done,
        timestamp_archived,
        minute_pause,
        minute_activity,
        pause_time,
      ]
    );
    res.status(201).json({ id: result.insertId, content, pic_id, detail, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task status and timestamps
router.put('/:id/status', async (req, res) => {
  const taskId = req.params.id;
  const { status, timestamp_todo, timestamp_progress, timestamp_done, timestamp_archived, minute_pause, minute_activity, pause_time } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE tasks SET 
        status = ?, 
        timestamp_todo = ?, 
        timestamp_progress = ?, 
        timestamp_done = ?, 
        timestamp_archived = ?, 
        minute_pause = ?, 
        minute_activity = ?,
        pause_time = ?
      WHERE id = ?`,
      [
        status,
        timestamp_todo || null,
        timestamp_progress || null,
        timestamp_done || null,
        timestamp_archived || null,
        minute_pause || 0,
        minute_activity || 0,
        pause_time || null,
        taskId,
      ]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update pause minutes and pause time for a task
router.put('/:id/pause', async (req, res) => {
  const taskId = req.params.id;
  const { minute_pause, pause_time } = req.body;

  if (minute_pause === undefined && pause_time === undefined) {
    return res.status(400).json({ error: 'minute_pause or pause_time required' });
  }

  try {
    const [taskRows] = await db.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
    if (taskRows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updates = [];
    const values = [];

    if (minute_pause !== undefined) {
      updates.push('minute_pause = ?');
      values.push(minute_pause);
    }
    if (pause_time !== undefined) {
      updates.push('pause_time = ?');
      values.push(pause_time);
    }

    values.push(taskId);

    const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const [updatedRows] = await db.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
    res.json(updatedRows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
