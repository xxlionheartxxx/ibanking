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

app.use((req, res, next) => {
  next();
  if (res.statusCode == 403) {
    res.send('FORBIDDEN');
  }
})

app.use('/v1/third-party/accounts', require('./routes/third-party/account.js'));

app.use((req, res, next) => {
  res.status(404).send('NOT FOUND');
})

app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.status(500).send('INTERNAL SERVER ERROR');
})

const PORT = 9000;
app.listen(PORT, _ => {
  console.log(`API is running at http://localhost:${PORT}`);
})
