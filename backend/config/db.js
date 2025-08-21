// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST, // sesuaikan dengan host MySQL Anda
  user: process.env.DATABASE_USER, // sesuaikan dengan user MySQL Anda
  password: process.env.DATABASE_PASSWORD, // sesuaikan dengan password MySQL Anda
  database: process.env.DATABASE_NAME, // sesuaikan dengan nama database Anda
});

module.exports = pool.promise();
