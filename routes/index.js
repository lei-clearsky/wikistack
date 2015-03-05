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
  	data[0].getSimilar(function(err, similarPages) {
      res.render('show', { 
        title: data[0].title,
        tags: data[0].tags, 
        similarPages: similarPages,
        content: data[0].body, 
        user: req.user
      });
    });
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

// Edit page route
router.get('/page/:id/edit', function(req, res) {
  // this is the /edit/:id route
  models.Page.findById(req.params.id, function (err, page) {
    if (err) return handleError(err);
    console.log(page.body);
    res.render('edit', {id: req.params.id, title: page.title, content: page.body, tags: page.tags });
  });  
});

router.post('/page/:id/edit', function(req, res) {
  // this is the /edit/submit route
  var generateUrlName = function(name) {
    if (typeof name != "undefined" && name !== "") {
      // Removes all non-alphanumeric characters from name
      // And make spaces underscore
      return name.replace(/\s/ig,"_").replace(/\W/ig,"");
    } else {
      // Generates random 5 letter string
      return Math.random().toString(36).substring(2,7);
    }
  };

  var title = req.body.pageTitle;
  var body = req.body.pageContent;
  var url_name = generateUrlName(title);
  var tags = req.body.pageTags.split(/\s*,\s*/);
  models.Page.update({_id: req.params.id}, {$set: {title: title, body: body, url_name: url_name, tags: tags}}, function (err, cb) {
    res.redirect('/');
  }); 

});

// Delete page route
router.post('/page/:id/delete', function(req, res) {
  models.Page.findOneAndRemove({_id: req.params.id}, function (err, cb) {
    res.redirect('/');    
  });
});
// Authentication
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
  user.save(function(err) {
    req.logIn(user, function(err) {
      res.redirect('/');
    });
  });
});

// passport config
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

passport.serializeUser(function(user, done) {
   done(null, user.id);
 });

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = router;
