const { check, query, validationResult } = require('express-validator');
const express = require('express');
const router = express.Router();
const Admin = require('../models/admin.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js')
const Response = require('../utils/response.js');
const Transaction = require('../models/transaction.js');
const EmployeeAccount = require('../models/employee_account.js');

router.put('/login', [ check('username').notEmpty().withMessage('username is require'),
  check('password').notEmpty().withMessage('password is require')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let admin = await Admin.getByUsername(req.body.username);
  if (!admin) {
    return res.status(400).json({errors: [{errorCode: 400, message: "username or password is invalid"}]})
  }
  if (!bcrypt.compareSync(req.body.password, admin.password)) {
    return res.status(400).json({errors: [{errorCode: 400, message: "username or password is invalid"}]})
  }
  // Generate token
  var accessToken = jwt.sign({id: admin.id}, config.jwtSecret, {expiresIn: config.jwtExpiresIn});
  var refreshToken = admin.refresh_token
  if (!refreshToken || refreshToken == "") {
     refreshToken = jwt.sign({id: admin.id}, config.jwtSecret);
      await admin.updateRefreshTokenByAccountId(admin.id, refreshToken)
  }
  Response.Ok(res, {
    "refreshToken":refreshToken,
    "accessToken":accessToken,
  });
})

router.post('/employees/:id',[
  check('name').notEmpty().withMessage('name is require'),
  check('username').notEmpty().withMessage('username is require'),
  check('password').notEmpty().withMessage('password is require')
],  async(req, res)=>{
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
    let data = {
      name: req.body.name,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, config.saltRounds),
    }
    employee = await EmployeeAccount.create(data);
    return Response.Ok(res, employee)
  } catch (error) {
    console.log(error)
    return Response.SendMessaageRes(res.status(403), "Token expired")
  }
})

router.delete('/employees/:id', async(req, res) => {
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
    await EmployeeAccount.deleteById(req.params["id"]);
    return Response.Ok(res, "")
  } catch (error) {
    return Response.SendMessaageRes(res.status(403), "Token expired")
  }
})

router.put('/employees/:id',[
  check('name').notEmpty().withMessage('name is require'),
  check('username').notEmpty().withMessage('username is require'),
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
    let employee = await EmployeeAccount.getByUsername(req.body.username);
    if (employee && employee.id !== parseInt(req.params["id"])) {
      return Response.SendMessaageRes(res.status(400), "username is exists" )
    }
    let data = {
      name: req.body.name,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, config.saltRounds),
    }
    employee = await EmployeeAccount.update(data, {where:{id:data.id}});
    return Response.Ok(res, employee)
  } catch (error) {
		console.log(error)
    return Response.SendMessaageRes(res.status(403), "Token expired")
  }
})

router.post('/employees',[
  check('name').notEmpty().withMessage('name is require'),
  check('username').notEmpty().withMessage('username is require'),
  check('password').notEmpty().withMessage('password is require')
],  async(req, res)=>{
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
    let data = {
      name: req.body.name,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, config.saltRounds),
    }
    employee = await EmployeeAccount.create(data);
    return Response.Ok(res, employee)
  } catch (error) {
    console.log(error)
    return Response.SendMessaageRes(res.status(403), "Token expired")
  }
})

router.get('/employees', async(req, res)=>{
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
    let employees = await EmployeeAccount.list()
    return Response.Ok(res, employees)
  } catch (error) {
    console.log(error)
    return Response.SendMessaageRes(res.status(403), "Token expired")
  }
})

router.get('/history-transactions', [
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
    let transactions = await Transaction.getByBankNameAndDate(req.query.bankName, req.query.from, req.query.to)
    return Response.Ok(res, transactions)
  } catch (error) {
    console.log(error)
    return Response.SendMessaageRes(res.status(403), "Token expired")
  }
});

module.exports = router;
