const express = require('express');
const router = express.Router();
const database = require('../../db/db.js');
const ThirdPartyAccount = require('../../models/third-partry/account.js');
const Account = require('../../models/account.js');
const PartnerTopupTransaction = require('../../models/partner_topup_transaction.js');
const Response = require('../../utils/response.js');
const ibCrypto = require('../../utils/cryto.js');
const { check, query, validationResult } = require('express-validator');
const sequelize = require('../../db/db.js');
const { QueryTypes } = require('sequelize');

// Get bank name by bank number
router.use('/', validateThirdPartyGetAccount());
router.get('/', [
  query('bankNumber').notEmpty().withMessage('bankNumber is require')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let bankNumber = req.query.bankNumber;
  let bankAccount = await Account.getByBankNumber(bankNumber);
  if (!bankAccount) {
    return Response.SendMessaageRes(res.status(400), "bankNumber is not exists");
  }
  Response.Ok(res, {"bankName": bankAccount.name});
});

// Topup
router.use('/topup', [
  check('bankNumber').notEmpty().withMessage('bankNumber is require'),
  check('requestId').notEmpty().withMessage('requestId is require'),
  check('amount').notEmpty().withMessage('amount is require'),
  check('signature').notEmpty().withMessage('signature is require'),
],validateTopupSign());
router.post('/topup',  async (req, res) => {
  let thirdPartyAccount = req._thirdPartyAccount;
  let transaction = await PartnerTopupTransaction.getByTransactionIdAndPartnerId(req.body.requestId, thirdPartyAccount.id);
  if (transaction) {
    return Response.SendMessaageRes(res.status(400), "Duplicate request id")
  }

  let account = await Account.getByBankNumber(req.body.bankNumber);
  if (!account || account.id <= 0) {
    return Response.SendMessaageRes(res.status(400), "bankNumber is invalid");
  }

  const t = await sequelize.transaction();
  // New transaction
  let newTransaction = {
    partner_id: thirdPartyAccount.id,
    request_id: req.body.requestId,
    bank_number: req.body.bankNumber,
    message: req.body.message,
    amount: req.body.amount,
  }
  try {
    newTransaction = await PartnerTopupTransaction.create(newTransaction, {transaction: t});
    // update money
    await sequelize.query("UPDATE accounts SET money = money + :amount WHERE number = :bankNumber", 
      { 
        type: QueryTypes.UPDATE,
        replacements: {amount: req.body.amount, bankNumber: req.body.bankNumber},
        transaction: t
      });
    t.commit();
    // Sign
    const sign = ibCrypto.RSASign(''+newTransaction.id, 'base64')
    return Response.Ok(res, {transactionId: newTransaction.id, signature: sign})
  } catch (error) {
    await t.rollback();
  }
});

function validateTopupSign() {
  return async function(req, res, next) {
    let thirdPartyAccount = req._thirdPartyAccount
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.body.amount <= 0) {
      return res.status(400).json({ errors: [{ errorCode: 400, message: 'amount is invalid'}] });
    }
    let rawSign = req.body.bankNumber + req.body.requestId + req.body.amount + (req.body.message || '')
    if (!ibCrypto.VerifyRSASign(thirdPartyAccount.pub_rsa_key, req.body.signature, rawSign)) {
      return Response.SendMessaageRes(res.status(400), "Sign is invalid")
    }
    next()
  }
}

function validateThirdPartyGetAccount() {
  return async function(req, res, next) {
    let thirdPartyname = req.headers['x-third-party-name'];
    if (!thirdPartyname) {
      return Response.SendMessaageRes(res.status(401));
    }
    let account = await ThirdPartyAccount.getByName(thirdPartyname);
    if (!account) {
      return Response.SendMessaageRes(res.status(401));
    }
    req._thirdPartyAccount= account
    next();
  }
}

module.exports = router;
