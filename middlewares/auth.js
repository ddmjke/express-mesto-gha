const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
// const { SUPER_STRONG_SECRET } = require('../utils/secrets');

const extractBearer = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Unauthorized'));
  }
  const token = extractBearer(authorization);
  let payload;

  try {
    payload = jwt.verify(token, require('../utils/secrets'));
  } catch (err) {
    return next(new UnauthorizedError('Unauthorized'));
  }

  req.user = payload;
  return next();
};
