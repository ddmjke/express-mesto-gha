const jwt = require('jsonwebtoken');
const { UNAUTHORIZED_ERROR } = require('../utils/errors');
const { SUPER_STRONG_SECRET } = require('../utils/secrets');

const handleAuthError = (res) => {
  res.status(UNAUTHORIZED_ERROR).send({ message: 'Unauthorized' });
};

const extractBearer = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError();
  }
  const token = extractBearer(authorization);
  let payload;

  try {
    payload = jwt.verify(token, SUPER_STRONG_SECRET);
  } catch (err) {
    return handleAuthError();
  }

  req.user = payload;
  return next();
};
