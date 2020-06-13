const Sequelize = require('sequelize');
const database = require('../db/db.js');

const EmployeeAccount = database.define(
  'employee_accounts',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.TEXT
    },
    username: {
      type: Sequelize.TEXT
    },
    password: {
      type: Sequelize.BIGINT
    },
    created_at: {
      type: Sequelize.DATE
    },
    updated_at: {
      type: Sequelize.DATE
    },
    created_by: {
      type: Sequelize.BIGINT
    },
    updated_by: {
      type: Sequelize.BIGINT
    },
  },
  { timestamps: false }
);

EmployeeAccount.getByUsername = async (username) => {
  try {
    const account = await EmployeeAccount.findOne({
      where: {
        username
      },
      raw: true
    });
    return account
  } catch (error) {
    return error
  }
};

module.exports = EmployeeAccount;
