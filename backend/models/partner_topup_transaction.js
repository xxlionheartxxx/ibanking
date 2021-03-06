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
    request_id: {
      type: Sequelize.BIGINT
    },
    amount: {
      type: Sequelize.BIGINT
    },
    partner_id: {
      type: Sequelize.BIGINT
    },
    message: {
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

PartnerTopupTransaction.getByTransactionIdAndPartnerId = async (requestId, partnerId) => {
  try {
    const transaction = await PartnerTopupTransaction.findOne({
      where: {
        request_id: requestId,
        partner_id: partnerId
      },
      raw: true
    });
    return transaction
  } catch (error) {
    return error
  }
};

module.exports = PartnerTopupTransaction;
