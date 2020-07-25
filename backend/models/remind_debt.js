const Sequelize = require('sequelize');
const database = require('../db/db.js');
const { QueryTypes } = require('sequelize');

const RemindDebt = database.define(
  'remind_debts',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    debtor: {
      type: Sequelize.BIGINT
    },
    amount: {
      type: Sequelize.BIGINT
    },
    message: {
      type: Sequelize.BIGINT
    },
    status: {
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
RemindDebt.statusCancel = "cancel"
RemindDebt.statusReminding = "reminding"
RemindDebt.statusPaid = "paid"
RemindDebt.updateStatus = async(remindDebtId, message, status, t) => {
  try {
    await database.query(
      "UPDATE remind_debts SET message = :message, status = :status WHERE id = :remindDebtId", {
        type: QueryTypes.UPDATE,
        replacements: {status: status, message: message, remindDebtId: remindDebtId},
        transaction: t,
      });
  } catch (error) {
    console.log(error)
  }
}
RemindDebt.getById = async(id) => {
  try {
    const remindDebt = await RemindDebt.findOne({
      where: {
        id: id,
      },
      raw: true
    })
    return remindDebt
  } catch (error) {
  }
}
RemindDebt.getByDebtor = async(accountId) => {
  try {
    const remindDebts = await RemindDebt.findAll({
      where: {
        status: RemindDebt.statusReminding,
        debtor: accountId,
      },
      order: [['created_at', 'DESC']],
      raw: true
    })
    return remindDebts
  } catch (error) {
  }
}
RemindDebt.getByCreatedBy = async(accountId) => {
  try {
    const remindDebts = await RemindDebt.findAll({
      where: {
        created_by: accountId,
        status: RemindDebt.statusReminding,
      },
      order: [['created_at', 'DESC']],
      raw: true
    })
    return remindDebts
  } catch (error) {
  }
}

module.exports = RemindDebt;
