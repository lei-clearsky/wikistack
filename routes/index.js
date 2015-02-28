var express = require('express');
var router = express.Router();

var models = require('../models/');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  models.Page.find(function(err, data){
  	// var SOMETHING = data
  	res.render('index', { title: 'WikiStack', docs: data });
  });

});


// IN PROGRESS
router.get('/wiki/:name', function(req, res, next) {
  
  var models = require('../models/');

  var name = req.params.name;
   
   // CHECK.
  models.Page.find({url_name: name}, function(err, data){
  	// var SOMETHING = data
  	// res.render('index', { title: 'WikiStack', docs: data });
  	console.log(data);
  	res.render('show', { title: data[0].title, content: data[0].body });
  	// res.render('show', { title: data.title, content: data.body });
  });

});


module.exports = router;
