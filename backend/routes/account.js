const express = require('express');
const router = express.Router();
const { check, query, validationResult } = require('express-validator');
const ThirdPartyAccount = require('../models/third-partry/account.js');
const Account = require('../models/account.js');
const Transaction = require('../models/transaction.js');
const config = require('../config/config.js')
const moment = require('moment')
const Response = require('../utils/response.js');
const ibCrypto = require('../utils/cryto.js');
const axios = require('axios');
const CryptoJS = require('crypto-js');
const openpgp = require('openpgp');
const sequelize = require('../db/db.js');
const { QueryTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.put('/login', [ check('username').notEmpty().withMessage('username is require'),
  check('password').notEmpty().withMessage('password is require')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let account = await Account.getByUsername(req.body.username);
  if (!account) {
    return res.status(400).json({errors: [{errorCode: 400, message: "username or password is invalid"}]})
  }
  if (!bcrypt.compareSync(req.body.password, account.password)) {
    return res.status(400).json({errors: [{errorCode: 400, message: "username or password is invalid"}]})
  }
  // Generate token
  var accessToken = jwt.sign({id: account.id}, config.jwtSecret, {expiresIn: config.jwtExpiresIn});
  var refreshToken = account.refreshToken
  if (!refreshToken || refreshToken == "") {
     refreshToken = jwt.sign({id: account.id}, config.jwtSecret);
      await Account.updateRefreshTokenByAccountId(account.id, refreshToken)
  }
  Response.Ok(res, {
    "refreshToken":refreshToken,
    "accessToken":accessToken,
  });
})

router.get('/history-transactions', [
  check('accountNumber').notEmpty().withMessage('accountNumber is require'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let accountNumber = req.query.accountNumber;
  let account = await Account.getByAccountNumber(accountNumber)
  if (!account) {
    return Response.SendMessaageRes(res.status(400), "accountNumber is invalid");
  }
  let types = req.query.types.split(",");
  let page = req.query.page;
  let limit = req.query.limit;
  console.log(types)
  let transactions = await Transaction.getByAccountNumberAndType(accountNumber, types, page, limit)
  return Response.Ok(res, transactions)
});

router.put('/topup', [
  check('amount').notEmpty().withMessage('name is require'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let username = req.body.username;
  let accountNumber = req.body.accountNumber;
  let account = await Account.getByUsernameOrNumber(username, accountNumber)
  if (!account) {
    return Response.SendMessaageRes(res.status(400), "username or number is invalid");
  }

  const t = await sequelize.transaction();
  // New transaction
  let newTransaction = {
    account_number: account.number,
    amount: req.body.amount,
    type: Transaction.typeTopup,
    created_by: req.requestById,
    updated_by: req.requestById,
  }
  try {
    newTransaction = await Transaction.create(newTransaction, {transaction: t});
    // update money
    await sequelize.query("UPDATE accounts SET money = money + :amount WHERE number = :bankNumber", 
      { 
        type: QueryTypes.UPDATE,
        replacements: {amount: req.body.amount, bankNumber: account.number},
        transaction: t
      });
    t.commit();
  } catch (error) {
    t.rollback();
    console.log(error)
    return Response.SendMessaageRes(res.status(500), "ERROR")
  }
  return Response.Ok(res, {message: "Ok"})
});

router.post('/', [
  check('username').notEmpty().withMessage('username is require'),
  check('password').notEmpty().withMessage('password is require'),
  check('name').notEmpty().withMessage('name is require'),
  check('email').notEmpty().withMessage('email is require'),
  check('phonenumber').notEmpty().withMessage('phonenumber is require')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let username = req.body.username;
  let account = await Account.getByUsername(username);
  if (account) {
    return Response.SendMessaageRes(res.status(400), "username is invalid");
  }
  let newAccount = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, config.saltRounds),
    name: req.body.name,
    email: req.body.email,
    phonenumber: req.body.phonenumber,
    money: 0,
    created_by: req.requestById,
    updated_by: req.requestById,
  }

  const t = await sequelize.transaction();
  try {
    newAccount = await Account.create(newAccount, {transaction: t})
    console.log(newAccount.id)
    // update money
    await sequelize.query("UPDATE accounts SET number = :accountNumber WHERE id = :accountId", 
      { 
        type: QueryTypes.UPDATE,
        replacements: {accountNumber: 370000 + newAccount.id, accountId: newAccount.id},
        transaction: t
      });
    t.commit()
  } catch (error) {
    t.rollback()
    console.log(error)
    return Response.SendMessaageRes(res.status(500), "ERROR")
  }
  return Response.Ok(res, newAccount)
});

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
    case '24Bank':
      return callGet24BankAccount(req, res, tpAccount);
  }
}

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
  return callTopupThirdPartyAccount(req, res, tpAccount);
});

function callTopupThirdPartyAccount(req, res, tpAccount) {
  switch (tpAccount.name) {
    case '25Bank':
      return callTopup25BankAccount(req, res, tpAccount);
    case '24Bank':
      return callTopup24BankAccount(req, res, tpAccount);
  }
}

async function callTopup24BankAccount (req, res, tpAccount) {
  const requestTime = moment().format();
  const partnerCode = config.myBankName;
  const secret_key = config.myBankName;
  const body = {
      amount: req.body.amount,
      depositor: {
          account_number: "1201245870155",
          full_name: "Nguyễn Văn A"
      },
      receiver: {
          account_number: req.body.bankNumber,
          full_name: req.body.bankName
      },
      partner_code: partnerCode
  };
  console.log(body)

  const text = partnerCode + requestTime + JSON.stringify(body) + secret_key;
  const hash = CryptoJS.SHA256(text).toString();
  const signature = await ibCrypto.PGPSign(hash);
  console.log(signature)

  const headers = {
      'Content-Type': 'application/json',
      'x-partner-code': `${partnerCode}`,
      'x-partner-request-time': `${requestTime}`,
      'x-partner-hash': `${hash}`,
      'x-partner-signature': `${signature}`
  }

  axios.post(`https://crypto-bank-1612785.herokuapp.com/api/services/deposits/account_number/${req.body.bankNumber}`, body, {
      headers: headers
  }).then((response) => {
      return Response.Ok(res, response.body);
  }).catch((err) => {
      console.log(err)
      return Response.SendMessaageRes(res.status(err.response.status), JSON.stringify(err.response.data))
  })
}

function callGet24BankAccount(req, res, tpAccount) {
  const requestTime = moment().format();
  const partnerCode = config.myBankName;
  const secret_key = config.myBankName;
  const body = {};
  const text = partnerCode + requestTime + JSON.stringify(body) + secret_key;
  const hash = CryptoJS.SHA256(text).toString();

  const headers = {
      'Content-Type': 'application/json',
      'x-partner-code': partnerCode,
      'x-partner-request-time': requestTime,
      'x-partner-hash': hash
  }

  axios.get(`https://crypto-bank-1612785.herokuapp.com/api/services/account_number/${req.query.bankNumber}`, {
      headers: headers
  }).then((response) => {
      return Response.Ok(res, {'bankName': response.data});
  }).catch((err) => {
      return Response.SendMessaageRes(res.status(err.response.status), JSON.stringify(err.response.data))
  })
}

function callTopup25BankAccount(req, res, tpAccount) {
  let tpBankNumber = req.body.bankNumber;
  let toEncrypted = JSON.stringify({
    'BankName': config.myBankName,
    'DestinationAccountNumber': Number(tpBankNumber),
    'SourceAccountNumber': '123',
    'SourceAccountName': config.myBankName,
    'Amount': req.body.amount,
    'Message': 'Topup',
    'iat': moment().valueOf()
  })
  let reqBody = {
    'Encrypted': ibCrypto.Bank25RSAEncrypted(toEncrypted, tpAccount.pub_rsa_key),
    'Signed': ibCrypto.RSASign(toEncrypted, 'base64'),
  }
  axios({
    method: 'post',
    url: 'https://bank25.herokuapp.com/api/partner/account-bank/destination-account/recharge',
    data: reqBody
  }).then(function (response) {
      return Response.Ok(res, response.body);
    })
    .catch(function (err) {
      console.log(err)
      return Response.SendMessaageRes(res.status(err.response.status), JSON.stringify(err.response.data))
    })
}

function callGet25BankAccount(req, res, tpAccount) {
  let tpBankNumber = req.query.bankNumber;
  let toEncrypted = JSON.stringify({
    'BankName': config.myBankName,
    'DestinationAccountNumber': Number(tpBankNumber),
    'iat': moment().valueOf()
  })
  let reqBody = {
    'Encrypted': ibCrypto.Bank25RSAEncrypted(toEncrypted, tpAccount.pub_rsa_key),
    'Signed': ibCrypto.RSASign(toEncrypted, 'base64'),
  }
  axios({
    method: 'get',
    url: 'https://bank25.herokuapp.com/api/partner/account-bank/destination-account',
    data: reqBody
  }).then(function (response) {
      return Response.Ok(res, {'bankName': response.data.TenKhachHang});
    })
    .catch(function (err) {
      console.log(err)
      return Response.SendMessaageRes(res.status(err.response.status), JSON.stringify(err.response.data))
    })
}

module.exports = router;
