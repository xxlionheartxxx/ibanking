const Sequelize = require('sequelize');
const database = require('../db/db.js');
const { QueryTypes } = require('sequelize');

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
      type: Sequelize.TEXT
    },
    refresh_token: {
      type: Sequelize.TEXT
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

EmployeeAccount.deleteById = async(id) => {
  try {
    await EmployeeAccount.destroy({
      where: {
        id: id,
      }
    })
  } catch (error) {
  }
}


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

EmployeeAccount.updateRefreshTokenByAccountId = async (accountId, refreshToken) => {
  try {
    database.query(
      "UPDATE employee_accounts SET refresh_token = :token WHERE id = :accountId", {
        type: QueryTypes.UPDATE,
        replacements: {token: refreshToken, accountId: accountId}
      });
  } catch (error) {
		console.log(error)
    return error
  }
};

EmployeeAccount.list = async () => {
  try {
    const employees = await EmployeeAccount.findAll();
    return employees
  } catch (error) {
    return error
  }
}

module.exports = EmployeeAccount;
