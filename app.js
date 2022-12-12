require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const userSign = require('./routes/userSign');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('./middlewares/cors');
const { dataBaseUrl } = require('./utils/constants');

const { PORT, NODE_ENV, DATABASE_URL } = process.env;

const app = express();

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

app.listen(PORT, () => {
  console.log(`Сервер запущен. Порт ${PORT}`);
});

app.use(cors);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

app.use(requestLogger);

app.use('/', userSign);

app.use(router);

app.get('/signout', (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure:true,
  }).send({ message: 'Выход' });
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);
