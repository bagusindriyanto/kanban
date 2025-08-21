// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST, // sesuaikan dengan host MySQL Anda
  user: process.env.DB_USER, // sesuaikan dengan user MySQL Anda
  password: process.env.DB_PASSWORD, // sesuaikan dengan password MySQL Anda
  database: process.env.DB_NAME, // sesuaikan dengan nama database Anda
});

module.exports = pool.promise();
