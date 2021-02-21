const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth.controller');
const controller = require('../controllers/order.controller.js');
const { getUserById, pushOrderInPurchaseList } = require('../controllers/user.controller.js');
const { updateStock } = require('../controllers/product.controller.js');

router.param('userId', getUserById);
router.param('orderId', controller.getOrderById);

router.post(
  '/order/create/:userId',
  authController.isSignedIn,
  authController.isAuthenticated,
  pushOrderInPurchaseList,
  updateStock,
  controller.createOrder,
);

router.get(
  '/order/all/:userId',
  authController.isSignedIn,
  authController.isAuthenticated,
  authController.isAdmin,
  controller.getAllOrders,
);

router.get(
  '/order/status/:userId',
  authController.isSignedIn,
  authController.isAuthenticated,
  authController.isAdmin,
  controller.getOrderStatus,
);

router.put(
  '/order/:orderId/status/:userId',
  authController.isSignedIn,
  authController.isAuthenticated,
  authController.isAdmin,
  controller.updateOrderStatus,
);

module.exports = router;
