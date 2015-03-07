// Setting custom filters on Swig
var marked = require('marked');

module.exports = function(swig) {
  // marked filter
  var markedFilter = function (body) {
    return marked(body);
  }
  markedFilter.safe = true;
  swig.setFilter('marked', markedFilter);

  // page link
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
  
  // page link with id
  var page_id_link = function (doc) {
    var link_name;
    if (typeof doc.title !== "undefined" && doc.title !== "") {
      link_name = doc.title
    } else {
      link_name = "Page "+doc.url_name;
    }
    return "<a href='"+doc.full_route+"/" + doc.id + "'>"+link_name+"</a>";
  };
  page_id_link.safe = true;
  swig.setFilter('page_id_link', page_id_link);
  

  // edit page link
  var edit_page_link = function (doc) {
    return "<a href= '/page/" + doc.id + "/edit'><button class='btn btn-primary'>Edit</button></a>"; 
  }
  edit_page_link.safe = true;
  swig.setFilter('edit_page_link', edit_page_link);
  
  // delete page link
  var delete_page_link = function (doc) {
    return "<form method='POST' action='/page/" + doc.id + "/delete' class='inline-form-btn'><input type='submit' class='btn btn-danger' value='delete'></input></form>"; 
  }
  delete_page_link.safe = true;
  swig.setFilter('delete_page_link', delete_page_link);
  
  // page tag
  var page_tag = function (tag) {
    return "<a href='/search?pageTag=" + tag + "'>" + tag + "</a>";
  }
  page_tag.safe = true;
  swig.setFilter('page_tag', page_tag);

  // trim words  
  var trim_words = function (doc) {
    expString = doc.split(/\s+/, 30);
    theNewString=expString.join(" ");
    return theNewString + ' ...';
  }
  trim_words.safe = true;
  swig.setFilter('trim_words', trim_words);
};
