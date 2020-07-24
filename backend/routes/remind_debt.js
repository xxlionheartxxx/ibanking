const express = require('express');
const router = express.Router();
const { check, query, validationResult } = require('express-validator');
const Response = require('../utils/response.js');
const bcrypt = require('bcrypt');
const config = require('../config/config.js');
const jwt = require('jsonwebtoken');
const RemindDebt = require('../models/remind_debt.js');
const Account = require('../models/account.js');

router.put('/remind_debts/:id',[
  check('message').notEmpty().withMessage('message is require'),
  check('status').notEmpty().withMessage('status is require'),
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
    jwt.verify(token, config.jwtSecret)
    await RemindDebt.updateStatus(req.params['id'], req.body.message, req.body.status)
    return Response.Ok(res, {})
  } catch (error) {
    return Response.SendMessaageRes(res.status(403), "Token expired")
  }
})

router.get('/remind_debts/:id',[], async(req, res) => {
  let token = req.headers["authentication"]
  if (!token) {
    return Response.SendMessaageRes(res.status(401), "Reqire login" )
  }
  try {
    let decoded = jwt.verify(token, config.jwtSecret)
    let remindDebts = []
    if (req.params['id'] === 'me') {
      remindDebts = await RemindDebt.getByDebtor(decoded.id)
    } else {
      remindDebts = await RemindDebt.getByCreatedBy(decoded.id)
    }
    return Response.Ok(res, remindDebts)
  } catch (error) {
    return Response.SendMessaageRes(res.status(403), "Token expired")
  }
})

router.post('/remind_debts',[
  check('debtor').notEmpty().withMessage('debtor is require'),
  check('amount').notEmpty().withMessage('amount is require'),
  check('message').notEmpty().withMessage('message is require'),
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
    let debtor = await Account.getByAccountNumber(req.body.debtor)
    let data = {
      debtor: debtor.id,
      amount: req.body.amount,
      status: RemindDebt.statusReminding,
      message: req.body.message,
      created_by: decoded.id,
      updated_by: decoded.id,
    }
    remindDebt = await RemindDebt.create(data);
    return Response.Ok(res, remindDebt)
  } catch (error) {
    console.log(error)
    return Response.SendMessaageRes(res.status(403), "Token expired")
  }
})


module.exports = router;
