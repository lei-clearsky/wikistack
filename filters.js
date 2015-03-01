// Setting custom filters on Swig
var marked = require('marked');
var markedFilter = function (body) {
  return marked(body);
}

markedFilter.safe = true;

module.exports = function(swig) {
  swig.setFilter('marked', markedFilter);

  var page_link = function (doc) {
    var link_name;
    if (typeof doc.title !== "undefined" && doc.title !== "") {
      link_name = doc.title
    } else {
      link_name = "Page "+doc.url_name;
    }
    return "<a href='"+doc.full_route+"'>"+link_name+"</a>";
  };
  page_link.safe = true;

  swig.setFilter('page_link', page_link);

  var page_tag = function (tag) {
    return "<a href='/search'>" + tag + "</a>";
  }
  page_tag.safe = true;
  swig.setFilter('page_tag', page_tag);
};
