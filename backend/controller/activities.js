const activitiesModel = require('../models/activities');

const getAllActivities = async (req, res) => {
  try {
    const [data] = await activitiesModel.getAllActivities();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const addNewActivity = async (req, res) => {
  const { body } = req;
  if (!body.name) {
    return res.status(400).json({
      error: 'Name is required',
    });
  }

  try {
    const [data] = await activitiesModel.addNewActivity(body);
    res.status(201).json({
      id: data.insertId,
      name: body.name,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  getAllActivities,
  addNewActivity,
};
