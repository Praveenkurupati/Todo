const jwt = require('jsonwebtoken');

function signJwt(user) {
  const payload = {
    userId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobileNumber: user.mobileNumber,
  };

  const expiresIn = '24h';

  return jwt.sign(payload, '12345', { expiresIn });
}

module.exports = signJwt;
