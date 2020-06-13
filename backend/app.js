const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('express-async-errors');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    msg: 'hello from nodejs express api'
  });
})

app.use('/v1/third-party/accounts', require('./routes/third-party/account.js'));

app.use('/v1/accounts', require('./routes/account.js'));

app.use('/v1/employees', require('./routes/employees.js'));

app.use((req, res, next) => {
  res.status(404).send({errors:[{errorCode: 404, message:'NOT FOUND'}]});
})

app.use(function (err, req, res, next) {
  console.log(err.stack);
  if (err.statusCode && err.body) {
    return res.status(err.statusCode).send({errors:[{errorCode: err.statusCode, message:err.body}]});
  }
  res.status(500).send({errors:[{errorCode:500, message:'INTERNAL SERVER ERROR'}]});
})

const PORT = 9000;
app.listen(PORT, _ => {
  console.log(`API is running at http://localhost:${PORT}`);
})
