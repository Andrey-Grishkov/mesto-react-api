const { err400 } = require('../utils/errorsCodes');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.status = err400;
  }
}

module.exports = BadRequestError;
