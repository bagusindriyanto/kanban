const db = require('../config/db');

const getAllActivities = () => {
  const SQL = 'SELECT * FROM activities ORDER BY created_at DESC';
  return db.execute(SQL);
};

const addNewActivity = (body) => {
  const SQL = 'INSERT INTO `activities` (`name`) VALUES (?)';
  const values = [body.name];
  return db.execute(SQL, values);
};

module.exports = {
  getAllActivities,
  addNewActivity,
};
