const express = require('express');
const router = express.Router();
const { check, query, validationResult } = require('express-validator');
const RemindDebt = require('../models/remind_debt.js');

router.put('/remind_debts/:id',[
  check('message').notEmpty().withMessage('message is require'),
  check('status').notEmpty().withMessage('status is require'),
], async(req, res) => {
  let token = req.headers["authentication"]
  if (!token) {
    return Response.SendMessaageRes(res.status(401), "Reqire login" )
  }
  try {
    let decoded = jwt.verify(token, config.jwtSecret)
    let remindDebt = RemindDebt.updateStatus(req.params['id'], req.body.message, req.body.status)
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
    let remindDebts = {}
    if (req.params['id'] === 'me') {
      remindDebts = RemindDebt.getByDebtor(decoded.id)
    } else {
      remindDebts = RemindDebt.getByCreatedBy(decoded.id)
    }
    return Response.Ok(res, remindDebts)
  } catch (error) {
    return Response.SendMessaageRes(res.status(403), "Token expired")
  }
})

router.post('/remind_debts',[], async(req, res) => {
  return res.status(200).end()
})


module.exports = router;
