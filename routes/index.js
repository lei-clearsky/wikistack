var express = require('express');
var router = express.Router();
var models = require('../models/');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET home page. */
router.get('/', function(req, res, next) {
  models.Page.find(function(err, data){
  	res.render('index', { title: 'WikiStack', docs: data, user: req.user });
  });
});

// Get wiki page
router.get('/wiki/:name', function(req, res, next) {
  var models = require('../models/');
  var name = req.params.name;
  // var pageInstance = new Page({tags: {$ne: name}});   
  models.Page.find({url_name: name}, function(err, data){
  	// res.render('index', { title: 'WikiStack', docs: data });
    //var pageInstance = new models.Page({tags: {$elemMatch: {$in: [data[0].tags]}},url_name: {$ne: data[0].url_name}}); 
    var pageInstance = new models.Page(); 
    pageInstance.findSimilar(function (err, similarPages) {
      res.render('show', { title: data[0].title, content: data[0].body, tags: data[0].tags, pages: similarPages });
    });    
  	// res.render('show', { title: data.title, content: data.body });
  });
});

// Get tag
router.get('/search', function(req, res, next) {
  if (req.query.pageTag) {
    var tagQuery = req.query.pageTag;
    models.Page.find({tags: {$elemMatch: {$in: [tagQuery]}}}, function(err, data) {
      res.render('searchTagResult', {
        title: "Search Result(s) for '" + tagQuery + "'",
        docs: data
      });
    });
  } else {
    res.render('search', {
      title: 'Sorry, no results match this tag. Try to search with different query :)'
    });
  }
});

// Update
// router.get('/:id/update', function(req, res, next) {
//  models.Page.update({}, function(err, data) {
//    res.render('show');
//  });
// });
//
//
// Delete

// Authentication
/*
 * router.get('/', function (req, res) {
  res.render('index', {
    user: req.user
  });
});
*/

router.get('/login', function(req, res) {
  res.render('login', {
    user : req.user
  });
});

router.get('/signup', function(req, res) {
  res.render('signup', {
    user: req.user
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err)
    if (!user) {
      console.log('check user: ');
      console.log(user);
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.post('/signup', function(req, res) {
  var user = new models.User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
  console.log('user save data');
  console.log(req.body.username);
  console.log(req.body.email);
  console.log(req.body.password);
  user.save(function(err) {
    console.log('check user save');
    console.log(user);
    req.logIn(user, function(err) {
      res.redirect('/');
    });
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  models.User.findOne({ username: username }, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'Incorrect username.' });
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  });
}));

// passport config
passport.serializeUser(function(user, done) {
   done(null, user.id);
 });

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = router;
