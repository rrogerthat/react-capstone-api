'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''}
});

UserSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};

UserSchema.methods.validatePassword = function(password) {  //create method on Object?
  return bcrypt.compare(password, this.password); //Boolean
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10); //10 stands for how many times salting algorithm is applied.
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};
