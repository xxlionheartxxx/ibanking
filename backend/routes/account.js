const { check, query, validationResult } = require('express-validator');
const ThirdPartyAccount = require('../models/third-partry/account.js');
const Account = require('../models/account.js');
const Transaction = require('../models/transaction.js');
const TransactionOTP = require('../models/transaction_otp.js');
const Receiver = require('../models/receiver.js');
const config = require('../config/config.js')
const moment = require('moment')
const Response = require('../utils/response.js');
const ibCrypto = require('../utils/cryto.js');
const axios = require('axios');
const CryptoJS = require('crypto-js');
const sequelize = require('../db/db.js');
const { QueryTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = require('./remind_debt.js');


router.put('/receivers/:id',[
  check('name').notEmpty().withMessage('name is require'),
], async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let token = req.headers["authentication"]
  if (!token) {
    return Response.SendMessaageRes(res.status(401), "Reqire login" )
  }
  try {
    let decoded = jwt.verify(token, config.jwtSecret)
    let receiver = await Receiver.updateName(req.body.name, decoded.id, req.params["id"]);
    return Response.Ok(res, receiver)
  } catch (error) {
    return Response.SendMessaageRes(res.status(403), "Token expired")
  }
})

router.post('/receivers', [
  check('bank_name').notEmpty().withMessage('bank_name is require'),
  check('bank_number').notEmpty().withMessage('bank_number is require'),
  check('bank_account_name').notEmpty().withMessage('bank_account_name is require'),
],async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let token = req.headers["authentication"]
  if (!token) {
    return Response.SendMessaageRes(res.status(401), "Reqire login" )
  }
  try {
    let decoded = jwt.verify(token, config.jwtSecret)
    // validate bank name
    if (!config.validBankName.includes(req.body.bank_name)) {
      return Response.SendMessaageRes(res.status(400), "bank_name is invalid")
    }
    let receiver = Receiver.getByCreatedByAndBankNumber(decoded.id, req.body.bank_number)
    if (receiver) {
      return Response.Ok(res, {})
    }
    let data = {
      name: req.body.name || req.body.bank_account_name,
      bank_name: req.body.bank_name,
      bank_account_name: req.body.bank_account_name,
      bank_number: req.body.bank_number,
      created_by: decoded.id,
      updated_by: decoded.id,
    }
    receiver = await Receiver.create(data);
    return Response.Ok(res, receiver)
  } catch (error) {
    return Response.SendMessaageRes(res.status(403), "Token expired")
  }
})

router.delete('/receivers/:id', async(req, res) => {
  let token = req.headers["authentication"]
  if (!token) {
    return Response.SendMessaageRes(res.status(401), "Reqire login" )
  }
  try {
    let decoded = jwt.verify(token, config.jwtSecret)
    await Receiver.deleteByCreatedByAndId(decoded.id, req.params["id"]);
    return Response.Ok(res, {})
  } catch (error) {
    return Response.SendMessaageRes(res.status(403), "Token expired")
  }
})

router.get('/history-transactions', [
  check('accountNumber').notEmpty().withMessage('accountNumber is require'),
], async (req, res) => {
  let token = req.headers["authentication"]
  if (!token) {
    return Response.SendMessaageRes(res.status(401), "Reqire login" )
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let decoded = jwt.verify(token, config.jwtSecret)
    let account = {}
    if (req.query.accountNumber == 'me'){
      account = await Account.getById(decoded.id)
    } else {
      account = await Account.getByAccountNumber(req.query.accountNumber)
    }
    if (!account) {
      return Response.SendMessaageRes(res.status(400), "accountNumber is invalid");
    }
    let types = null
    if (req.query.types) {
      types = req.query.types.split(",");
    }
    let page = req.query.page;
    let limit = req.query.limit;
    let transactions = await Transaction.getByAccountNumberAndType(account.number, types, page, limit)
    return Response.Ok(res, transactions)
  } catch (error) {
    console.log(error)
    return Response.SendMessaageRes(res.status(403), "Token expired")
  }
});


router.get('/receivers', async(req, res) => {
  let token = req.headers["authentication"]
  if (!token) {
    return Response.SendMessaageRes(res.status(401), "Reqire login" )
  }
  try {
    let decoded = jwt.verify(token, config.jwtSecret)
    let receivers = await Receiver.getByCreatedBy(decoded.id);
    return Response.Ok(res, receivers)
  } catch (error) {
    return Response.SendMessaageRes(res.status(403), "Token expired")
  }
})

router.get('/:bank_number',async(req, res)=> {
  let token = req.headers["authentication"]
  if (!token) {
    return Response.SendMessaageRes(res.status(401), "Reqire login" )
  }
  try {
    jwt.verify(token, config.jwtSecret)
    let account = await Account.getByAccountNumber(req.params['bank_number']);
    if (!account) {
      return Response.Ok(res, {})
    }
    return Response.Ok(res, {
      id: account.id,
      name: account.name,
      number: account.number,
      username: account.username,
      money: account.money,
      email: account.email,
    })
  } catch (error) {
    return Response.SendMessaageRes(res.status(403), "Token expired")
  }
})

router.post('/:bank_number/transfer/otp', [
  check('transaction_id').notEmpty().withMessage('bank_number is require'),
  check('otp').notEmpty().withMessage('bank_name is require'),
], async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let token = req.headers["authentication"]
  if (!token) {
    return Response.SendMessaageRes(res.status(401), "Reqire login" )
  }
  let decoded = {}
  try {
    decoded = jwt.verify(token, config.jwtSecret)
  } catch (error) {
    return Response.SendMessaageRes(res.status(403), "Token expired")
  }
  let transactionOTP = await TransactionOTP.getById(req.body.transaction_id)
  if (!transactionOTP || transactionOTP.verified) {
    return Response.SendMessaageRes(res.status(400), "transaction_id is invalid")
  }
  if (transactionOTP.otp != req.body.otp) {
    console.log(transactionOTP, req.body)
    return Response.SendMessaageRes(res.status(400), "otp is invalid")
  }

  let srcTransaction = await Transaction.getById(transactionOTP.source_transaction_id)
  let destTransaction = await Transaction.getById(transactionOTP.destination_transaction_id)

  const t = await sequelize.transaction();
  try {
    // Update
    await Account.updateMoneyByNumber(srcTransaction.amount, srcTransaction.account_number, t) 

    if (destTransaction.bank_name == config.myBankName) {
      await Account.updateMoneyByNumber(destTransaction.amount, destTransaction.account_number, t)
    } else {
      //Call third party
    }
    await Transaction.updateDoneStatus([destTransaction.id, srcTransaction.id], t)
    await TransactionOTP.setVerified(transactionOTP.id, t)
    t.commit()
  } catch (error) {
    t.rollback()
    return Response.SendMessaageRes(res.status(500), "ERROR")
  }
  return Response.Ok(res, {})
})

router.post('/:bank_number/transfer',[
  check('bank_number').notEmpty().withMessage('bank_number is require'),
  check('bank_name').notEmpty().withMessage('bank_name is require'),
  check('money').notEmpty().withMessage('money is require'),
  check('fee_for_me').notEmpty().withMessage('fee_for_me is require'),
], async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let token = req.headers["authentication"]
  if (!token) {
    return Response.SendMessaageRes(res.status(401), "Reqire login" )
  }
  let decoded = {}
  try {
    decoded = jwt.verify(token, config.jwtSecret)
  } catch (error) {
    return Response.SendMessaageRes(res.status(403), "Token expired")
  }
  let sourceAccount = await Account.getById(decoded.id)
  if (!sourceAccount) {
    return Response.SendMessaageRes(res.status(400), "bank_number is invalid");
  }
  if (sourceAccount.money <= req.body.money) {
    return Response.SendMessaageRes(res.status(400), "not enough money");
  }

  let targetAccount = await Account.getByUsernameOrNumber("", req.body.bank_number)
  if (!targetAccount) {
    return Response.SendMessaageRes(res.status(400), "bank_number is invalid");
  }

  const t = await sequelize.transaction();
  // New transaction
  let sourceTransaction = {
    account_number: sourceAccount.number,
    bank_name: config.myBankName,
    amount: req.body.money *-1,
    type: Transaction.typeBankTransfer,
    status: Transaction.statusProcessing,
    created_by: decoded.id,
    updated_by: decoded.id,
  }
  let destinationTransaction = {
    account_number: targetAccount.number,
    bank_name: config.myBankName,
    amount: req.body.money,
    type: Transaction.typeTopup,
    status: Transaction.statusProcessing,
    created_by: decoded.id,
    updated_by: decoded.id,
  }

  // Generate OTP
  otp = "1234567"
  let newTransactionOTP = {}
  try {
    sourceTransaction = await Transaction.create(sourceTransaction, {transaction: t});
    destinationTransaction = await Transaction.create(destinationTransaction, {transaction: t});

    newTransactionOTP = {
      otp: otp,
      source_transaction_id: sourceTransaction.id,
      destination_transaction_id: destinationTransaction.id,
      verified: false,
    }
    newTransactionOTP = await TransactionOTP.create(newTransactionOTP, {transaction: t});
    t.commit();
  } catch (error) {
    t.rollback();
    return Response.SendMessaageRes(res.status(500), "ERROR")
  }

  // Send OTP
  return Response.Ok(res, {transaction_id: newTransactionOTP.id})
})


router.get('/', async(req, res) => {
  let token = req.headers["authentication"]
  if (!token) {
    return Response.SendMessaageRes(res.status(401), "Reqire login" )
  }
  try {
    let decoded = jwt.verify(token, config.jwtSecret)
    let account = await Account.getById(decoded.id);
    return Response.Ok(res, {
      id: account.id,
      name: account.name,
      number: account.number,
      username: account.username,
      phonenumber: account.phonenumber,
      money: account.money,
      email: account.email,
    })
  } catch (error) {
    return Response.SendMessaageRes(res.status(403), "Token expired")
  }
})

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
  var refreshToken = account.refresh_token
  if (!refreshToken || refreshToken == "") {
     refreshToken = jwt.sign({id: account.id}, config.jwtSecret);
      await Account.updateRefreshTokenByAccountId(account.id, refreshToken)
  }
  Response.Ok(res, {
    "refreshToken":refreshToken,
    "accessToken":accessToken,
  });
})

router.put('/topup', [
  check('amount').notEmpty().withMessage('name is require'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
 let token = req.headers["authentication"]
  if (!token) {
    return Response.SendMessaageRes(res.status(401), "Reqire login" )
  }
  try {
    let decoded = jwt.verify(token, config.jwtSecret)
  } catch (error) {
    return Response.SendMessaageRes(res.status(403), "Token expired")
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
    status: Transaction.statusDone,
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

 let token = req.headers["authentication"]
  if (!token) {
    return Response.SendMessaageRes(res.status(401), "Reqire login" )
  }
  let decoded = {}
  try {
     decoded = jwt.verify(token, config.jwtSecret)
  } catch (error) {
    return Response.SendMessaageRes(res.status(403), "Token expired")
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
    created_by: decoded.id,
    updated_by: decoded.id,
  }

  const t = await sequelize.transaction();
  try {
    newAccount = await Account.create(newAccount, {transaction: t})
    // update account
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
