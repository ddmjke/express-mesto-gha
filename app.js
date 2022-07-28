const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const { NOT_FOUND_ERROR } = require('./utils/errors');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use('/', (req, res, next) => {
  req.user = {
    _id: '62e13388767a0b954de3dea4',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => res.status(NOT_FOUND_ERROR).send({ message: 'Bad request' }));

app.listen(PORT);
