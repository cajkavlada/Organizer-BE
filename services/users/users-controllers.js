const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const HttpError = require("../../models/http-error");
const User = require('./users-model');

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email })
  if (existingUser) return next( new HttpError('User exists already, please login instead.', 422));

  const hashedPassword = await bcrypt.hash(password, 12);

  const createdUser = new User({ name, email, password: hashedPassword, tasks: [] });
  await createdUser.save();

  const token = await jwt.sign({ userId: createdUser.id, email: createdUser.email }, process.env.API_PRIVATE_KEY, { expiresIn: '1h' });

  res.status(201).json({ userId: createdUser.id, email: createdUser.email, token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const invalidCredentialsError = new HttpError('Invalid credentials.', 422);

  const existingUser = await User.findOne({ email })
  if (!existingUser) return next(invalidCredentialsError);
  
  let isValidPassword = false;
  isValidPassword = await bcrypt.compare(password, existingUser.password);
  if (!isValidPassword) return next(invalidCredentialsError);

  const token = await jwt.sign({ userId: existingUser.id, email: existingUser.email }, process.env.API_PRIVATE_KEY, { expiresIn: '1h' });

  res.json({  userId: existingUser.id, email: existingUser.email, token });
}

exports.signup = signup;
exports.login = login;