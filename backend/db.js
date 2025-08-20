// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost', // sesuaikan dengan host MySQL Anda
  user: 'root', // sesuaikan dengan user MySQL Anda
  password: '', // sesuaikan dengan password MySQL Anda
  database: 'kanban_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
