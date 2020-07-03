const Sequelize = require('sequelize');
const database = require('../db/db.js');

const Transaction = database.define(
  'transactions',
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
    status: {
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

Transaction.statusProcessing = "processing"
Transaction.statusDone = "done"
Transaction.statusCancel = "cancel"
Transaction.typeTopup = "topup"
Transaction.typeBankTransfer = "bank_transfer"
Transaction.typeDebtRemind = "debt_remind"
Transaction.types = [Transaction.typeTopup, Transaction.typeBankTransfer, Transaction.typeDebtRemind]

Transaction.getByAccountNumberAndType = async (accountNumber, type, page, limit) => {
  try {
    const transactions = await Transaction.findAll({
      where: {
        account_number: accountNumber,
        status: Transaction.statusDone,
        type: type || Transaction.types
      },
      limit: limit || 20,
      offset: (page-1)*limit || 0,
      order: [['created_at', 'DESC']],
      raw: true
    });
    return transactions
  } catch (error) {
    return error
  }
};

module.exports = Transaction;
