const db = require('../config/db');

const getAllPics = () => {
  const SQL = 'SELECT * FROM pics ORDER BY created_at DESC';
  return db.execute(SQL);
};

const addNewPic = (body) => {
  const SQL = 'INSERT INTO `pics` (`name`) VALUES (?)';
  const values = [body.name];
  return db.execute(SQL, values);
};

module.exports = {
  getAllPics,
  addNewPic,
};
