const { err409 } = require('../utils/errorsCodes');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.status = err409;
  }
}

module.exports = ConflictError;
