const picsModel = require('../models/pics');

const getAllPics = async (req, res) => {
  try {
    const [data] = await picsModel.getAllPics();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const addNewPic = async (req, res) => {
  const { body } = req;
  if (!body.name) {
    return res.status(400).json({
      error: 'Name is required',
    });
  }

  try {
    const [data] = await picsModel.addNewPic(body);
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
  getAllPics,
  addNewPic,
};
