const jwt = require('jsonwebtoken');

const HttpError = require("../models/http-error");

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) throw new Error('Authentication failed!');

    const decodedToken = jwt.verify(token, process.env.API_PRIVATE_KEY);
    req.userData = { userId: decodedToken.userId }
    next();
  } catch (err) {
    return next(new HttpError('Authentication failed!', 401));
  }
};

module.exports = checkAuth;