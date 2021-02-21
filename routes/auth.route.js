const express = require('express');

const router = express.Router();
const { body } = require('express-validator');
const controller = require('../controllers/auth.controller');

router.post(
  '/signup',
  [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('lastname').trim(),
  ],
  controller.signup,
);

router.post(
  '/signin',
  [
    body('email', 'Email is mandatory.').isEmail(),
    body('password', 'Password is mandatory.').isLength({ min: 1 }),
  ],
  controller.signin,
);

router.get('/signout', controller.signnout);

router.get('/test-route', controller.isSignedIn, (req, res) => {
  res.json({ id: req.auth, message: 'protected route' });
});

module.exports = router;
