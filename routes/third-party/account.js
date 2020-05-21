const express = require('express');
const router = express.Router();
const database = require('../../db/db.js');
const ThirdPartyAccount = require('../../models/third-partry/account.js');
const Account = require('../../models/account.js');
const Response = require('../../utils/response.js');
const { check, validationResult } = require('express-validator');

// Middleware
router.use('/', validateThirdPartyGetAccount());

router.get('/', [
  check('bankNumber').notEmpty().withMessage('bankNumber is require')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let bankNumber = req.body.bankNumber;
  if (!bankNumber) {
    return Response.SendMessaageRes(res.status(400), "bankNumber require");
  }

  let bankAccount = await Account.getByBankNumber(bankNumber);
  if (!bankAccount) {
    return Response.SendMessaageRes(res.status(400), "bankNumber is not exists");
  }
  Response.Ok(res, {"bankName": bankNumber});
});

router.post('/topup', async (req, res) => {
  let thirdPartyAccount = req._thirdPartyAccount
  console.log(thirdPartyAccount)
  Response.Ok(res)
});

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
