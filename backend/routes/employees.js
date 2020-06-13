const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const EmployeeAccount = require('../models/employee_account.js');
const bcrypt = require('bcrypt');
const config = require('../config/config.js');
const Response = require('../utils/response.js');


router.put('/login', [ check('username').notEmpty().withMessage('username is require'),
  check('password').notEmpty().withMessage('password is require')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let employeeAccount = await EmployeeAccount.getByUsername(req.body.username);
  if (!employeeAccount) {
    return res.status(400).json({errors: [{errorCode: 400, message: "username or password is invalid"}]})
  }
  let hash = await bcrypt.hashSync(req.body.password, config.saltRounds)
  if (!bcrypt.compareSync(req.body.password, employeeAccount.password)) {
    return res.status(400).json({errors: [{errorCode: 400, message: "username or password is invalid"}]})
  }
  // Generate token
  Response.Ok(res, {
    "refreshToken":'Login success',
    "accessToken":'Login success',
  });
})
module.exports = router;
