// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.MYSQLHOST, // sesuaikan dengan host MySQL Anda
  user: process.env.MYSQLUSER, // sesuaikan dengan user MySQL Anda
  password: process.env.MYSQLPASSWORD, // sesuaikan dengan password MySQL Anda
  database: process.env.MYSQLDATABASE, // sesuaikan dengan nama database Anda
  port: process.env.MYSQLPORT, // sesuaikan dengan port MySQL Anda
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
