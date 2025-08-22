const db = require('../config/db');

// Query to get all tasks
const getAllTasks = () => {
  const SQL = 'SELECT * FROM tasks ORDER BY created_at DESC';
  return db.execute(SQL);
};

// Query to get a task by ID
const getTaskById = (taskId) => {
  const SQL = 'SELECT * FROM tasks WHERE id = ?';
  return db.execute(SQL, [taskId]);
};

// Query to add a new task
const addNewTask = (body) => {
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
  } = body;
  const SQL =
    'INSERT INTO `tasks` (`content`, `pic_id`, `detail`, `status`, `timestamp_todo`, `timestamp_progress`, `timestamp_done`, `timestamp_archived`, `minute_pause`, `minute_activity`, `pause_time`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [
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
  ];
  return db.execute(SQL, values);
};

// Query to update task status
const updateTaskStatus = (body, taskId) => {
  const {
    status,
    timestamp_todo,
    timestamp_progress,
    timestamp_done,
    timestamp_archived,
    minute_pause,
    minute_activity,
    pause_time,
  } = body;
  const SQL =
    'UPDATE tasks SET status = ?, timestamp_todo = ?, timestamp_progress = ?, timestamp_done = ?, timestamp_archived = ?, minute_pause = ?, minute_activity = ?, pause_time = ? WHERE id = ?';
  const values = [
    status,
    timestamp_todo || null,
    timestamp_progress || null,
    timestamp_done || null,
    timestamp_archived || null,
    minute_pause || 0,
    minute_activity || 0,
    pause_time || null,
    taskId,
  ];
  return db.execute(SQL, values);
};

// Query to update pause minute and pause time for a task
const updateTaskPause = ({ minute_pause, pause_time }, taskId) => {
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
  const SQL = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
  return db.execute(SQL, values);
};

module.exports = {
  getAllTasks,
  getTaskById,
  addNewTask,
  updateTaskStatus,
  updateTaskPause,
};
