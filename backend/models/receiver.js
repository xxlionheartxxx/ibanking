const Sequelize = require('sequelize');
const database = require('../db/db.js');
const { QueryTypes } = require('sequelize');

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

Receiver.deleteByCreatedByAndId = async(createdBy, id) => {
  try {
    const receivers = await Receiver.destroy({
      where: {
        created_by: createdBy,
        id: id,
      }
    })
    return receivers
  } catch (error) {
  }
}
Receiver.updateName = async(name, createdBy, id) => {
  try {
    database.query(
      "UPDATE receivers SET name = :name WHERE created_by = :createdBy AND id = :id", {
        type: QueryTypes.UPDATE,
        replacements: {name: name, createdBy: createdBy, id: id}
      });
    return receivers
  } catch (error) {

  }
}
Receiver.getByCreatedByAndBankNumber = async(accountId, bankNumber) => {
  try {
    const receivers = await Receiver.findAll({
      where: {
        created_by: accountId,
        bank_number: bankNumber,
      },
      raw: true
    })
    return receivers
  } catch (error) {

  }
}
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
