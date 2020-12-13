const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const ProductCartSchema = new mongoose.Schema({
  product: {
    type: ObjectId,
    ref: 'Product',
  },
  name: {
    type: String,
    trim: true,
  },
  count: Number,
  price: Number,
}, { timestamps: true });

const ProductCart = mongoose.model('ProductCart', ProductCartSchema);

const OrderSchema = new mongoose.Schema({
  products: [ProductCartSchema],
  transaction_id: {},
  amount: { type: Number },
  address: {
    type: String,
    trim: true,
  },
  updated: Date,
  user: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },

}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);

module.exports = { ProductCart, Order };
