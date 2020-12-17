const express = require('express');
const { body } = require('express-validator');

const router = express.Router();
const controller = require('../controllers/user.controller');
const { isAdmin, isAuthenticated, isSignedIn } = require('../controllers/auth.controller');

router.param('userId', controller.getUserById);

router.get('/user/:userId', isSignedIn, isAuthenticated, controller.getUser);

module.exports = router;
