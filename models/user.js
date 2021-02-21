/* eslint-disable func-names */
const mongoose = require('mongoose');
const { v1: uuidv1 } = require('uuid');
const crypto = require('crypto');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: 32,
    required: true,
  },
  lastname: {
    type: String,
    trim: true,
    maxlength: 32,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  userinfo: {
    type: String,
    trim: true,
  },
  encry_password: {
    type: String,
    required: true,
  },
  salt: String,
  role: {
    type: Number,
    default: 0,
  },
  purchases: {
    type: Array,
    default: [],
  },
},
{ timestamps: true });

UserSchema.virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema.methods = {
  authenticate(plainPassword) {
    return this.securePassword(plainPassword) === this.encry_password;
  },

  securePassword(plainPassword) {
    if (!plainPassword) return '';
    try {
      return crypto
        .createHmac('sha256', this.salt)
        .update(plainPassword)
        .digest('hex');
    } catch (error) {
      return error;
    }
  },
};

module.exports = mongoose.model('User', UserSchema);
