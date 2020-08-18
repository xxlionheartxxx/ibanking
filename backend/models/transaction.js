const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const database = require('../db/db.js');
const moment = require('moment');
const { QueryTypes } = require('sequelize');

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
    bank_name: {
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
Transaction.getByBankNameAndDate = async (bankName, from, to, page, limit) => {
  try {
    let where = {}
    if (bankName && ["37Bank", "24Bank", "25Bank"].includes(bankName)) {
      where.bank_name = bankName
    }
    if (from && from > 0) {
      where.created_at = {
        "$gt": moment.unix(from)
      }
    }
    if (to && to > 0) {
      where.created_at = {
        "$lt": moment.unix(to)
      }
    }
    if (to && from && from >0 && to > 0) {
      where.created_at = {
        [Op.between]: [moment.unix(from).format(), moment.unix(to).format()],
      }
    }
    const transactions = await Transaction.findAll({
      where,
      offset: (page-1)*limit || 0,
      order: [['created_at', 'DESC']],
      raw: true
    });
    return transactions
  } catch (error) {
    throw error
  }
};
Transaction.getByAccountNumberAndType = async (accountNumber, type, page, limit) => {
  try {
    const transactions = await Transaction.findAll({
      where: {
        account_number: accountNumber,
        status: Transaction.statusDone,
        type: type || Transaction.types
      },
      offset: (page-1)*limit || 0,
      order: [['created_at', 'DESC']],
      raw: true
    });
    return transactions
  } catch (error) {
    throw error
  }
};

Transaction.updateDoneStatus = async (ids, t) => {
  try {
    await database.query(
      "UPDATE transactions SET status = 'done' WHERE id IN (:ids)", {
        type: QueryTypes.UPDATE,
        replacements: {ids: ids},
        transaction: t,
      });
  } catch (error) {
    throw new  error
  }
}

Transaction.getById = async (id) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        id: id
      },
      raw: true
    })
    return transaction
  } catch (error) {
    throw new  error
  }
}

module.exports = Transaction;
