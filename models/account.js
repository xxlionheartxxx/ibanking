const Sequelize = require('sequelize');
const database = require('../../db/db.js');

const Account = database.define(
  'accounts',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.TEXT
    },
    number: {
      type: Sequelize.TEXT
    },
    money: {
      type: Sequelize.BIGINT
    }
  },
  { timestamps: false }
);

Account.getByNumber = async (number) => {
  try {
    const account = await ThirdPartyAccount.findAll({
      limit: 1,
      where: {
        number: number
      }
    });
    return account
  } catch (error) {
    return error
  }
};

module.exports = Account;
