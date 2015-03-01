var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
  // this is the /add/ route
  console.log("HERE");
  res.render('add');
});

router.post('/submit', function(req, res) {
  // this is the /add/submit route
  var models = require('../models/');

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
  var tags = req.body.pageTags.split(/[ ,]+/);
  

  var p = new models.Page({ "title": title, "body":body, "url_name":url_name, "tags": tags });
  p.save();
  res.redirect('/');

});

module.exports = router;
