const Sequelize = require('sequelize');
const database = require('../db/db.js');

const Account = database.define(
  'accounts',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.TEXT
    },
    number: {
      type: Sequelize.TEXT
    },
    money: {
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

Account.getByBankNumber = async (number) => {
  try {
    const account = await Account.findOne({
      where: {
        number: number
      },
      raw: true
    });
    return account
  } catch (error) {
    return error
  }
};

module.exports = Account;
