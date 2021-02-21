/* eslint-disable no-param-reassign */
const httpStatus = require('http-status');
const Order = require('../models/order');
const User = require('../models/user');

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(httpStatus.NOT_FOUND).json({ message: 'User was not found!' });
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

//  Model.findByIdAndUpdate(id, { $set: { name: 'jason bourne' }}, options, callback)
exports.updateUser = (req, res) => {
  const id = req.profile._id;
  User.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: 'User not updated!' });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      return res.status(httpStatus.OK).json({ user });
    },
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ _id: req.profile._id })
    .populate('user', '_id name')
    .exec((err, order) => {
      if (err) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: 'No order found in this Account.' });
      }
      return res.status(httpStatus.OK).json({ order });
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  const { _id } = req.profile;
  const purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.description,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  // store purchases into the DB.
  User.findOneAndUpdate(
    // _id,
    { _id },
    { $push: { purchases } },
    { new: true },
    (err) => {
      if (err) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: 'Unable to save purchase List.' });
      }
      return next();
    },
  );
};
