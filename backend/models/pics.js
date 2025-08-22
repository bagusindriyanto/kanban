const db = require('../config/db');

// Query to get all pics
const getAllPics = () => {
  const SQL = 'SELECT * FROM pics ORDER BY created_at DESC';
  return db.execute(SQL);
};

// Query to add a new pic
const addNewPic = (body) => {
  const SQL = 'INSERT INTO `pics` (`name`) VALUES (?)';
  const values = [body.name];
  return db.execute(SQL, values);
};

module.exports = {
  getAllPics,
  addNewPic,
};
