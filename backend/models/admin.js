require('pg').defaults.parseInt8 = true
const Sequelize = require('sequelize');
const database = require('../db/db.js');
const { QueryTypes } = require('sequelize');

const Admin = database.define(
  'admins',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    refresh_token: {
      type: Sequelize.TEXT
    },
    username: {
      type: Sequelize.TEXT
    },
    password: {
      type: Sequelize.TEXT
    },
  },
  { timestamps: false }
);

Admin.getByUsername = async (username) => {
  try {
    const admin = await Admin.findOne({
      where: {
        username: username
      },
      raw: true
    });
    return admin
  } catch (error) {
    return error
  }
};

Admin.updateRefreshTokenByAccountId = async (adminId, refreshToken) => {
  try {
    await database.query(
      "UPDATE admins SET refresh_token = :token WHERE id = :adminId", {
        type: QueryTypes.UPDATE,
        replacements: {token: refreshToken, adminId: adminId}
      });
  } catch (error) {
    return error
  }
};

module.exports = Admin;
