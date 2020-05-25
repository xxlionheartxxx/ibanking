const express = require('express');
const router = express.Router();
const { check, query, validationResult } = require('express-validator');
const ThirdPartyAccount = require('../models/third-partry/account.js');
const config = require('../config/config.js')
const moment = require('moment')
const Response = require('../utils/response.js');
const ibCrypto = require('../utils/cryto.js');
const axios = require('axios');

router.post('/third-party/topup', [
  check('bankNumber').notEmpty().withMessage('bankNumber is require'),
  check('bankName').notEmpty().withMessage('bankName is require'),
  check('amount').notEmpty().withMessage('amount is require')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let tpBankName = req.body.bankName;
  let tpAccount = await ThirdPartyAccount.getByName(tpBankName);
  if (!tpAccount) {
    return Response.SendMessaageRes(res.status(400), "bankName is invalid");
  }
  return callGetThirdPartyAccount(req, res, tpAccount);
});

function callTopupThirdPartyAccount(req, res, tpAccount) {
  switch (tpAccount.name) {
    case '25Bank':
      return callTopup25BankAccount(req, res, tpAccount);
  }
}

router.get('/third-party', [
  query('bankNumber').notEmpty().withMessage('bankNumber is require'),
  query('bankName').notEmpty().withMessage('bankName is require')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let tpBankName = req.query.bankName;
  let tpAccount = await ThirdPartyAccount.getByName(tpBankName);
  if (!tpAccount) {
    return Response.SendMessaageRes(res.status(400), "bankName is invalid");
  }
  return callGetThirdPartyAccount(req, res, tpAccount);
});

function callGetThirdPartyAccount(req, res, tpAccount) {
  switch (tpAccount.name) {
    case '25Bank':
      return callGet25BankAccount(req, res, tpAccount);
  }
}

function callTopup25BankAccount(req, res, tpAccount) {
  let tpBankNumber = req.body.bankNumber;
  let encrypted = JSON.stringify({
    'BankName': config.myBankName,
    'DestinationAccountNumber': Number(tpBankNumber),
    'Amount': req.body.amount,
    'Message': 'Topup',
    'iat': moment().valueOf()
  })
  let buff = new Buffer(encrypted);
  const sign = ibCrypto.RSASign(encrypted, 'base64')
  let reqBody = {
    'Encrypted': buff.toString('base64'),
    'Signed': sign,
  }
  axios({
    method: 'post',
    url: 'http://bank25.herokuapp.com/api/partner/account-bank/destination-account',
    data: reqBody
  }).then(function (response) {
      return Response.Ok(res, response.body);
    })
    .catch(function (err) {
      return Response.SendMessaageRes(res.status(err.response.status), JSON.stringify(err.response.data))
    })
}

function callGet25BankAccount(req, res, tpAccount) {
  let tpBankNumber = req.query.bankNumber;
  let encrypted = JSON.stringify({
    'BankName': config.myBankName,
    'DestinationAccountNumber': Number(tpBankNumber),
    'iat': moment().valueOf()
  })
  let buff = new Buffer(encrypted);
  const sign = ibCrypto.RSASign(encrypted, 'base64')
  let reqBody = {
    'Encrypted': buff.toString('base64'),
    'Signed': sign,
  }
  axios({
    method: 'get',
    url: 'http://bank25.herokuapp.com/api/partner/account-bank/destination-account',
    data: reqBody
  }).then(function (response) {
      return Response.Ok(res, {'bankName': response.data.TenKhachHang});
    })
    .catch(function (err) {
      return Response.SendMessaageRes(res.status(err.response.status), JSON.stringify(err.response.data))
    })
}

module.exports = router;
