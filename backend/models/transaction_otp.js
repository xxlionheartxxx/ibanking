const Sequelize = require('sequelize');
const database = require('../db/db.js');
const { QueryTypes } = require('sequelize');

const TransactionOTP = database.define(
  'transaction_otps',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    otp: {
      type: Sequelize.TEXT
    },
    source_transaction_id: {
      type: Sequelize.BIGINT
    },
    destination_transaction_id: {
      type: Sequelize.BIGINT
    },
    verified: {
      type: Sequelize.BOOLEAN
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

TransactionOTP.getById = async (id) => {
  try {
    const transaction = await TransactionOTP.findOne({
      where: {
        id: id
      },
      raw: true
    })
    return transaction
  } catch (error) {
    return error
  }
}

TransactionOTP.setVerified = async (id, t) => {
  try {
    await database.query(
      "UPDATE transaction_otps SET verified = true WHERE id = :id", {
        type: QueryTypes.UPDATE,
        replacements: {id: id},
        transaction: t,
      });
  } catch (error) {
    throw new error
  }
}

module.exports = TransactionOTP;
