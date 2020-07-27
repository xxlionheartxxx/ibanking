const Sequelize = require('sequelize');
const database = require('../db/db.js');
const { QueryTypes } = require('sequelize');

const ForgotPassOTP = database.define(
  'forgot_pass_otps',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: Sequelize.BIGINT
    },
    otp: {
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

ForgotPassOTP.updateByAccountId = async (id, otp) => {
  try {
    await database.query(
      "UPDATE forgot_pass_otps SET otp = :otp WHERE account_id = :id", {
        type: QueryTypes.UPDATE,
        replacements: {otp: otp, id: id},
        transaction: t,
      });
  } catch (error) {
    return error
  }
};

ForgotPassOTP.getByAccountId = async (id) => {
  try {
    const forgotPassOTP = await ForgotPassOTP.findOne({
      where: {
        account_id: id
      },
      raw: true
    });
    return forgotPassOTP
  } catch (error) {
    return error
  }
};

module.exports = ForgotPassOTP;
