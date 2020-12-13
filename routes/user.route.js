const express = require('express');
const { body } = require('express-validator');

const router = express.Router();
const controller = require('../controllers/user.controller');

module.exports = router;
