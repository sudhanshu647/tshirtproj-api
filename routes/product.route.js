const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const productController = require('../controllers/product.controller');

// params
router.param('userId', userController.getUserById);
router.param('productId', productController.getProductById);

// Create routes
router.post(
  '/prodcut/create/:userId',
  authController.isSignedIn,
  authController.isAuthenticated,
  authController.isAdmin,
  productController.createProduct,
);

// Read routes
router.get('/product/:productId', productController.getProduct);
router.get('/product/photo/:productId', productController.photo);

// Delete route
router.delete(
  '/product/:productId/:userId',
  authController.isSignedIn,
  authController.isAuthenticated,
  authController.isAdmin,
  productController.deleteProduct,
);

// Update route
router.put(
  '/product/:productId/:userId',
  authController.isSignedIn,
  authController.isAuthenticated,
  authController.isAdmin,
  productController.updateProduct,
);

router.get('/products', productController.getAllProducts);

router.get('/products/categories', productController.getAllUniqueCategories);

module.exports = router;
