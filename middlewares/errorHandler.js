const { InternalError } = require('../errors/InternalError');

module.exports = (err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).send({ message: err.message });
  }
  const error = new InternalError('Произошла ошибка на сервере');
  res.status(error.status).send({ message: error.message });
  return next();
};
