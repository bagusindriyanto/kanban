const tasksModel = require('../models/tasks');

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

module.exports = {
  getAllTasks,
  addNewTask,
};
