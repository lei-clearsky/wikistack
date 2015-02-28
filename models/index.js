var mongoose = require('mongoose');
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
      status: Number
});

var userSchema = new Schema({
    name:  {
                   first: String,
          last: String
      },
      email: String
});

pageSchema.virtual('full_route').get(function () {
    return '/wiki/' + this.url_name;
});

// pageSchema.virtual('full_route').set(function () {
//     var = FULLTHING
//     url_name = FULLTHING - /wiki/
// });

Page = mongoose.model('Page', pageSchema);
User = mongoose.model('User', userSchema);

module.exports = {"Page": Page, "User": User};

//Page.findOne({name: name}, function(err, page) {
//  console.log(page.full_route);
//});
