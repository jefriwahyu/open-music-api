
const ClientError = require('./ClientError');

class Unauthorized extends ClientError {
  constructor(message) {
    super(message, 401);
    this.name = 'Unauthorized';
  }
}

module.exports = Unauthorized;
