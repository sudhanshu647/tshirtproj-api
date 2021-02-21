/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
const httpStatus = require('http-status');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');

exports.getProductById = (req, res, next, id) => {
  Product.findById(id).exec((err, prod) => {
    if (err || !prod) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Category not found in DB.', err, prod });
    }
    req.product = prod;
    next();
  });
};

exports.createProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(httpStatus.BAD_REQUEST).json({ error: 'problem with image' });
    }

    // TODO restricution on field
    const {
      name, description, price, category, stock,
    } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(httpStatus.BAD_REQUEST).json({ error: 'Please includes all fields' });
    }

    const product = new Product(fields);

    // Handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(httpStatus.BAD_REQUEST).json({ error: 'File size too big' });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    // save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(httpStatus.BAD_REQUEST).json({ error: 'saving tshirt in DB falled' });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.status(httpStatus.OK).json(req.product);
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.updateProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(httpStatus.BAD_REQUEST).json({ error: 'problem with image' });
    }

    let { product } = req;
    product = _.extend(product, fields);

    // Handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(httpStatus.BAD_REQUEST).json({ error: 'File size too big' });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    // save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(httpStatus.BAD_REQUEST).json({ error: 'Updation of product failed.' });
      }
      res.json(product);
    });
  });
};

exports.deleteProduct = (req, res) => {
  const { product } = req;
  Product.remove((err, prod) => {
    if (err && !prod) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Not able to delete product.' });
    }
    return res.status(httpStatus.OK).json({ message: `This ${product} was deleted successfully.` });
  });
};

exports.getAllProducts = (req, res) => {
  const limit = req.query.limit || 8;
  const sortBy = req.query.sortBy || '_id';
  Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, 'asc']])
    .limit(Number(limit))
    .exec((err, products) => {
      if (err || !products) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: 'Proucts not found.' });
      }
      return res.status(httpStatus.OK).json({ products });
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct('category', {}, (err, categories) => {
    if (err || !categories) {
      return res.status(httpStatus.BAD_REQUEST).json({ error: 'No category found' });
    }
    return res.status(httpStatus.OK).json({ categories });
  });
};

exports.updateStock = (req, res, next) => {
  const myOperations = req.body.order.products.map((prod) => ({
    updateOne: {
      filter: { _id: prod._id },
      update: { $inc: { stock: -prod.count, sold: +prod.count } },
    },
  }));

  Product.bulkWrite(myOperations, {}, (err) => {
    if (err) {
      return res.status(httpStatus.BAD_REQUEST).json({ error: 'Updation failed.' });
    }
    next();
  });
};
