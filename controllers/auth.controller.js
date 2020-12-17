const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const expressJwt = require('express-jwt');
const { validationResult } = require('express-validator');
const { JWT_SECRET, JWT_EXPIRY_MINUTES } = require('../config/vars');
const User = require('../models/user');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array()[0];
    return res.status(httpStatus.BAD_REQUEST).json({
      // message: errors.array()[0].msg,
      error,
      message: `${error.param} has ${error.msg}`,
    });
  }
  const user = new User(req.body);
  user.save((err, userObj) => {
    if (err) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Not able to save user', data: req.body,
      });
    }
    return res.status(httpStatus.OK).json({ user: userObj });
  });
};

exports.signin = (req, res, next) => {
  const errors = validationResult(req);
  const { email, password } = req.body;
  if (!errors.isEmpty()) {
    const error = errors.array()[0];
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
      error,
      message: `${error.param} has ${error.msg}`,
    });
  }

  User.findOne({ email }, (error, user) => {
    if (error || !user) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Email does not exist!' });
    }

    if (!user.authenticate(password)) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'User email and password do not match.' });
    }
    // create token
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);
    // put token in cookie
    res.cookie('token', token, { expiry: new Date() + JWT_EXPIRY_MINUTES });

    // send res to frontend
    const { _id, name, role } = user;
    return res.status(httpStatus.OK).json({
      token,
      user: {
        _id, name, email, role,
      },
    });
  });
  // return next();
};

exports.signnout = (req, res) => {
  res.clearCookie('token');
  return res.status(httpStatus.OK).json({ message: 'User signout successfully!' });
};

exports.isSignedIn = expressJwt({
  secret: JWT_SECRET,
  userProperty: 'auth',
  algorithms: ['HS256'],
});

exports.isAuthenticated = (req, res, next) => {
  console.log('auth', req.auth);
  console.log('profile', req.profile);
  const checker = req.profile && req.auth && String(req.profile._id) === req.auth._id;
  if (!checker) {
    return res.json({ status: httpStatus.UNAUTHORIZED, message: 'Access denied.' });
  }
  return next();
};

exports.isAdmin = (req, res, next) => {
  if (!req.profile === 0) {
    return res.json({ status: httpStatus.FORBIDDEN, message: 'You are not Admin.' });
  }
  return next();
};
