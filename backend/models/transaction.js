const Sequelize = require('sequelize');
const database = require('../db/db.js');

const Transaction = database.define(
  'topup_transactions',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: Sequelize.TEXT
    },
    account_number: {
      type: Sequelize.TEXT
    },
    amount: {
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

Transaction.typeTopup = "topup"
Transaction.typeBankTransfer = "bank_transfer"
Transaction.typeDebtRemind = "debt_remind"

Transaction.getByAccountNumberAndType = async (accountNumber, type, page, limit) => {
  try {
    const transaction = await TopupTransaction.find({
      where: {
        account_number: accountNumber,
        type: type
      },
      limit: limit,
      offset: (page-1)*limit,
      order: [['created_at', 'DESC']],
      raw: true
    });
    return transaction
  } catch (error) {
    return error
  }
};

module.exports = Transaction;
