const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const categoryController = require('../controllers/category.controller');

// params
router.param('userId', userController.getUserById);
router.param('categoryId', categoryController.getCategoryById);

// actual routes
router.post(
  '/category/create/:userId',
  authController.isSignedIn,
  authController.isAuthenticated,
  authController.isAdmin,
  categoryController.createCategory,
);

router.get('/category/:categoryId', categoryController.getCategory);
router.get('/categories', categoryController.getAllCategories);

router.put(
  '/category/:categoryId/:userId',
  authController.isSignedIn,
  authController.isAuthenticated,
  authController.isAdmin,
  categoryController.updateCategory,
);

router.delete(
  '/category/:categoryId/:userId',
  authController.isSignedIn,
  authController.isAuthenticated,
  authController.isAdmin,
  categoryController.removeCategory,
);

module.exports = router;
