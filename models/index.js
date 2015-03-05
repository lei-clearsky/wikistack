var session = require('express-session')
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
// var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wikistack');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var Page, User;
var Schema = mongoose.Schema;

var pageSchema = new Schema({
    title: String,
    url_name: String,
    owner_id:   String,
    body:   String,
    date: { type: Date, default: Date.now },
    status: Number,
    tags: [String]  
});

var userSchema = new Schema({
    name:
    {
      first: String,
      last: String
    },
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

pageSchema.methods.getSimilar = function(cb) {
  this.constructor.find({
    _id: {$ne: this._id},
    tags: {$elemMatch: { 
        $in: this.tags
      }
    }
  }, cb)
}


pageSchema.virtual('full_route').get(function () {
    return '/wiki/' + this.url_name;
});

pageSchema.methods.findSimilar = function (cb) {
  return this.model('Page').find({tags: this.tags}, cb );
}
// from examples in https://github.com/jaredhanson/passport-local
userSchema.pre('save', function(next) {
  var user = this;
  var SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
   if (err) return cb(err);
     cb(null, isMatch);
  });
};

Page = mongoose.model('Page', pageSchema);
User = mongoose.model('User', userSchema);
//var pageInstance = new Page({tags: pageTags});
//module.exports = {"Page": Page, "User": User, "PageInstance": pageInstance};



module.exports = {"Page": Page, "User": User };

