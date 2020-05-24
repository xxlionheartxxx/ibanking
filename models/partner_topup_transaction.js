const Sequelize = require('sequelize');
const database = require('../db/db.js');

const PartnerTopupTransaction = database.define(
  'partner_topup_transactions',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bank_number: {
      type: Sequelize.TEXT
    },
    transaction_id: {
      type: Sequelize.BIGINT
    },
    amount: {
      type: Sequelize.BIGINT
    },
    partner_id: {
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

PartnerTopupTransaction.getByTransactionId = async (transactionId) => {
  try {
    const transaction = await PartnerTopupTransaction.findOne({
      where: {
        transaction_id: transactionId
      },
      raw: true
    });
    return transaction
  } catch (error) {
    return error
  }
};

module.exports = PartnerTopupTransaction;
