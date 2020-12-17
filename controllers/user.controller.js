const httpStatus = require('http-status');
const User = require('../models/user');

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(httpStatus.OK).json({ message: 'User was not found!' });
    }
    req.profile = user;
    return next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  res.json(req.profile);
};
