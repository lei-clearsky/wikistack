var express = require('express');
var router = express.Router();
var models = require('../models/');

/* GET home page. */
router.get('/', function(req, res, next) {
  models.Page.find(function(err, data){
  	res.render('index', { title: 'WikiStack', docs: data });
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
      console.log('similar pages');
      console.log(similarPages);
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
      //res.redirect('/searchTagResult');
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









module.exports = router;
