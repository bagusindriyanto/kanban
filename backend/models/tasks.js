const db = require('../config/db');

const getAllTasks = () => {
  const SQL = 'SELECT * FROM tasks ORDER BY created_at DESC';
  return db.execute(SQL);
};

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
  console.log('Updating task status:', {
    taskId,
    status,
    timestamp_todo,
    timestamp_progress,
    timestamp_done,
    timestamp_archived,
    minute_pause,
    minute_activity,
    pause_time,
  });
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

module.exports = {
  getAllTasks,
  addNewTask,
  updateTaskStatus,
};
