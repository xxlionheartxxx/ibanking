const Sequelize = require('sequelize');
const dbConfig = require('../config/config.js');

// your credentials
DATABASE_URL = `postgres://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.db}`;

const database = new Sequelize(DATABASE_URL);

try {
  database.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
module.exports = database;
