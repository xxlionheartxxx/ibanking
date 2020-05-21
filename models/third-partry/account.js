const Sequelize = require('sequelize');
const database = require('../../db/db.js');

const ThirdPartyAccount = database.define(
  'third_party_accounts',
  {

    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.TEXT
    },
    secret_key: {
      type: Sequelize.TEXT
    }

  },
  { timestamps: false }
);

ThirdPartyAccount.getByName = async (name) => {
  try {
    const account = await ThirdPartyAccount.findOne({
      where: {
        name: name
      },
      raw: true
    });
    return account
  } catch (error) {
    return error
  }
};

module.exports = ThirdPartyAccount;
