const express = require('express');
const router = express.Router();
const { check, query, validationResult } = require('express-validator');
const ThirdPartyAccount = require('../models/third-partry/account.js');
const config = require('../config/config.js')
const moment = require('moment')
const Response = require('../utils/response.js');
const ibCrypto = require('../utils/cryto.js');
const axios = require('axios');
const CryptoJS = require('crypto-js');
const openpgp = require('openpgp');

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

  const text = partnerCode + requestTime + JSON.stringify(body) + secret_key;
  const hash = CryptoJS.SHA256(text).toString();
  const signature = await signRequest(hash);

  const headers = {
      'Content-Type': 'application/json',
      'x-partner-code': `${partnerCode}`,
      'x-partner-request-time': `${requestTime}`,
      'x-partner-hash': `${hash}`,
      'x-partner-signature': `${signature}`
  }

  axios.post(`https://crypto-bank-1612785.herokuapp.com/api/services/deposits/account_number/${req.query.bankNumber}`, body, {
      headers: headers
  }).then((response) => {
      return Response.Ok(res, response.body);
  }).catch((err) => {
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
    url: 'https://bank25.herokuapp.com/api/partner/account-bank/destination-account',
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
  let toEncrypted = JSON.stringify({
    'BankName': config.myBankName,
    'DestinationAccountNumber': Number(tpBankNumber),
    'iat': moment().valueOf()
  })
  let reqBody = {
    //'Encrypted': buff.toString('base64'),
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
      return Response.SendMessaageRes(res.status(err.response.status), JSON.stringify(err.response.data))
    })
}


const signRequest = async (data) => {
    const privateKeyArmored = JSON.parse(`"${ibCrypto.myPrivatePGPKey}"`); // convert '\n'
    const passphrase = config.myBankName; // what the private key is encrypted with
 
    const { keys: [privateKey] } = await openpgp.key.readArmored(privateKeyArmored);
    await privateKey.decrypt(passphrase);
 
    const { signature: detachedSignature } = await openpgp.sign({
        message: openpgp.cleartext.fromText(data), // CleartextMessage or Message object
        privateKeys: [privateKey],                            // for signing
        detached: true
    });
    return JSON.stringify(detachedSignature);
}
module.exports = router;
