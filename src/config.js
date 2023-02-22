require("dotenv").config();
const Pool = require("pg").Pool;

const credentials = {
  user: process.env.user || "user",
  localhost: process.env.localhost || "localhost",
  database: process.env.database || "visits",
  password: process.env.password,
  port: parseInt(process.env.port) || "5432",
  max: 1,
  idleTimeoutMillis: 0,
};

const pool = new Pool(credentials);

module.exports = { pool };
