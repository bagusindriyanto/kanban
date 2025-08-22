const tasksModel = require('../models/tasks');

// Controller to get all tasks
const getAllTasks = async (req, res) => {
  try {
    const [data] = await tasksModel.getAllTasks();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// Controller to add a new task
const addNewTask = async (req, res) => {
  const { body } = req;

  if (!body.content) {
    return res.status(400).json({
      error: 'Content is required',
    });
  }

  try {
    const [data] = await tasksModel.addNewTask(body);
    res.status(201).json({
      id: data.insertId,
      content: body.content,
      pic_id: body.pic_id,
      detail: body.detail,
      status: body.status,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// Controller to update task status
const updateTaskStatus = async (req, res) => {
  const taskId = req.params.id;
  const { body } = req;

  try {
    const [data] = await tasksModel.updateTaskStatus(body, taskId);
    if (data.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task updated' });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// Controller to update pause minute and pause time for a task
const updateTaskPause = async (req, res) => {
  const taskId = req.params.id;
  const { minute_pause, pause_time } = req.body;

  if (minute_pause === undefined && pause_time === undefined) {
    return res
      .status(400)
      .json({ error: 'minute_pause or pause_time required' });
  }

  try {
    const [data] = await tasksModel.getTaskById(taskId);
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const [updatedData] = await tasksModel.updateTaskPause(
      { minute_pause, pause_time },
      taskId
    );
    if (updatedData.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const [updatedRows] = await tasksModel.getTaskById(taskId);
    res.json(updatedRows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllTasks,
  addNewTask,
  updateTaskStatus,
  updateTaskPause,
};
