/* eslint-disable consistent-return */
const httpStatus = require('http-status');
const Category = require('../models/category');

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err || !cate) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Category not found in DB.' });
    }
    req.category = cate;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, cate) => {
    if (err || !cate) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Not able to save category in DB.' });
    }
    return res.status(httpStatus.CREATED).json({ category, message: 'Category created' });
  });
};

exports.getCategory = (req, res) => res.status(httpStatus.OK).json(req.category);

exports.getAllCategories = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err || !categories) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Not able to save category in DB.' });
    }
    return res.status(httpStatus.OK).json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const { category } = req;
  category.name = req.body.name;
  category.save((err, updatedCategories) => {
    if (err && !updatedCategories) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Not able to update category in DB' });
    }
    return res.status(httpStatus.OK).json(category);
  });
};

exports.removeCategory = (req, res) => {
  const { category } = req;
  category.remove((err, cate) => {
    if (err && !cate) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Not able to update category in DB' });
    }
    return res.status(httpStatus.OK).json({ message: `This ${category} was deleted successfully.` });
  });
};
