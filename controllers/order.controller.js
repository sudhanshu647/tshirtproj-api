/* eslint-disable consistent-return */
const httpStatus = require('http-status');
const { Order } = require('../models/order');

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate('products.product', 'name price')
    .exec((err, order) => {
      if (err || !order) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: 'Category not found in DB.', err, order });
      }
      req.order = order;
      next();
    });
};

exports.createOrder = (req, res, next) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, odr) => {
    if (err && !odr) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Order not found in DB.', err, odr });
    }
    res.json(odr);
  });
};

exports.getAllOrders = (req, res, next) => {
  Order.find()
    .populate('user', 'name _id')
    .exec((err, order) => {
      if (err && !order) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: 'No order found in DB' });
      }
      res.json(order);
    });
};

exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path('status').enumValues);
};

exports.updateOrderStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    {
      $set: {
        status: req.body.status,
      },
    },
    (err, order) => {
      if (err && !order) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: 'Could not update order.' });
      }
      return res.json(order);
    },
  );
};
