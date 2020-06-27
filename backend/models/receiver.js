const Sequelize = require('sequelize');
const database = require('../db/db.js');

const Receiver = database.define(
  'receivers',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bank_name: {
      type: Sequelize.TEXT
    },
    bank_number: {
      type: Sequelize.TEXT
    },
    name: {
      type: Sequelize.TEXT
    },
    bank_account_name: {
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

Receiver.getByCreatedBy = async(accountId) => {
  try {
    const receivers = await Receiver.findAll({
      where: {
        created_by: accountId,
      },
      raw: true
    })
    return receivers
  } catch (error) {

  }
}

module.exports = Receiver;
