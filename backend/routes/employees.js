const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const EmployeeAccount = require('../models/employee_account.js');
const bcrypt = require('bcrypt');
const config = require('../config/config.js');
const Response = require('../utils/response.js');
const jwt = require('jsonwebtoken');

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
  if (!bcrypt.compareSync(req.body.password, employeeAccount.password)) {
    return res.status(400).json({errors: [{errorCode: 400, message: "username or password is invalid"}]})
  }
  // Generate token
  var accessToken = jwt.sign({id: employeeAccount.id}, config.jwtSecret, {expiresIn: config.jwtExpiresIn});
  var refreshToken = employeeAccount.refreshToken
  if (!refreshToken || refreshToken == "") {
     refreshToken = jwt.sign({id: employeeAccount.id}, config.jwtSecret);
      await EmployeeAccount.updateRefreshTokenByAccountId(employeeAccount.id, refreshToken)
  }
  Response.Ok(res, {
    "refreshToken":refreshToken,
    "accessToken":accessToken,
  });
})
module.exports = router;
