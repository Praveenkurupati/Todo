const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: 'Authorization token missing.' });
    }

    // console.log(token)
    const user = jwt.verify(token, '12345');
    req.userData = user;
    next();
  } catch (error) {
    console.error('Error verifying token:', error.message);
    return res.status(403).json({ error: 'Invalid token.' });
  }
};

module.exports = verifyToken;

