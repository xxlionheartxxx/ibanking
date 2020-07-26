require('pg').defaults.parseInt8 = true
const Sequelize = require('sequelize');
const database = require('../db/db.js');
const { QueryTypes } = require('sequelize');

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
    username: {
      type: Sequelize.TEXT
    },
    password: {
      type: Sequelize.TEXT
    },
    phonenumber: {
      type: Sequelize.TEXT
    },
    refresh_token: {
      type: Sequelize.TEXT
    },
    email: {
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

Account.getByAccountNumber = async (number) => {
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

Account.getByUsernameOrNumber = async (username, accountNumber) => {
  try {
    const account = await Account.findOne({
      where: {
        [Sequelize.Op.or]: [
          {username: username},
          {number: accountNumber},
        ],
      },
      raw: true
    });
    return account
  } catch (error) {
    return error
  }
};

Account.getById = async (id) => {
  try {
    const account = await Account.findOne({
      where: {
        id: id
      },
      raw: true
    });
    return account
  } catch (error) {
    return error
  }
};

Account.getByUsername = async (username) => {
  try {
    const account = await Account.findOne({
      where: {
        username: username
      },
      raw: true
    });
    return account
  } catch (error) {
    return error
  }
};

Account.updatePassword = async (accountId, pass, t) => {
  try {
   await database.query(
      "UPDATE accounts SET password = :password WHERE id = :id", {
        type: QueryTypes.UPDATE,
        replacements: {password: pass, id: accountId},
        transaction: t,
      });
  } catch (error) {
    return error
  }
};

Account.updateMoneyByNumber = async (money, accountNumber, t) => {
  try {
   await database.query(
      "UPDATE accounts SET money = money + (:amount) WHERE number = :bankNumber", {
        type: QueryTypes.UPDATE,
        replacements: {amount: money, bankNumber: accountNumber},
        transaction: t,
      });
  } catch (error) {
    return error
  }
};

Account.updateRefreshTokenByAccountId = async (accountId, refreshToken) => {
  try {
    await database.query(
      "UPDATE accounts SET refresh_token = :token WHERE id = :accountId", {
        type: QueryTypes.UPDATE,
        replacements: {token: refreshToken, accountId: accountId}
      });
  } catch (error) {
    return error
  }
};

module.exports = Account;
