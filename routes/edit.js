var express = require('express');
var router = express.Router();
var models = require('../models/');
//var ObjectId = require('mongoose').Types.ObjectId; 

router.get('/:id', function(req, res) {
  // this is the /edit/:id route
  models.Page.findById(req.params.id, function (err, page) {
    if (err) return handleError(err);
    console.log(page.body);
    res.render('edit', {id: req.params.id, title: page.title, content: page.body, tags: page.tags });
  });  
});

router.post('/:id/submit', function(req, res) {
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
  console.log('submit edit');
  console.log(req.params.id);
  models.Page.update({_id: req.params.id}, {$set: {title: title, body: body, url_name: url_name, tags: tags}}, function (err, cb) {
    res.redirect('/');
  }); 

});

module.exports = router;
