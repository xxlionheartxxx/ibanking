const express = require('express');
const router = express.Router();
const database = require('../../db/db.js');
const ThirdPartyAccount = require('../../models/third-partry/account.js');

// Middleware
router.use('/', validateThirdPartyGetAccount())

router.get('/', async (req, res) => {
  return res.status(200).end();
})

function validateThirdPartyGetAccount() {
  return async function(req, res, next) {
    let thirdPartyname = req.headers['x-third-party-name'];
    if (!thirdPartyname) {
      return res.status(403);
    }
    let account = await ThirdPartyAccount.getByName(thirdPartyname)
    next();
  }
}
module.exports = router;
