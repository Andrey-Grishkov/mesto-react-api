const { err403 } = require('../utils/errorsCodes');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.status = err403;
  }
}

module.exports = ForbiddenError;
