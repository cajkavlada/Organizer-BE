const HttpError = require("../models/http-error");

const unknownRouteError = (req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  return next(error);
}

const defaultError = (error, req, res, next) => {
  if (res.headerSent) return next(error);
  
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
};

exports.unknownRouteError = unknownRouteError;
exports.defaultError = defaultError;