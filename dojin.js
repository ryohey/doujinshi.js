var restler = require("restler");
var fs = require("fs");
var cheerio = require("cheerio");
var _ = require("underscore");
var mime = require("mime");

var POST_URL = "http://doujinshi.mugimugi.org/IMGSERV/socket.php";

var SITE_URL = "http://doujinshi.mugimugi.org/search/image/";

var ERROR_MSG_INVALID_URL = "Invalid URL. Please test " + SITE_URL;
var ERROR_RESPONSES = [
  {resp: "Uploading URLERRR NO FUCKING PICTURE, FUCK OFF", msg: ERROR_MSG_INVALID_URL},
  {resp: "Uploading URLError downloading file from host,", msg: ERROR_MSG_INVALID_URL}
];

module.exports = function(path, callback){
  resolveFormData(path, function(err, data){
    if(err) return callback(err);
    httpRequest(data, callback);
  });
}

/*
 * true  : path is the jpg, jpeg, png, gif
 * false : otherwise
 */
function isFile(path){
  return /[jpg|jpeg|png|gif]$/.test(path);
}

function isUrl(path) {
  return /^https?:\/\//.test(path);
}

function resolveFormData(path, callback){
  if(isUrl(path)){
    var data = {
      "URL" : path
    };
    callback(null, data);
  }else if(isFile(path)){
    fs.stat(path, function(err, stats) {
      if (err) return callback(err);
      var data = {
        "COLOR": "4",
        "img": restler.file(path, null, stats.size, null, mime.lookup(path))
      };
      callback(null, data);
    });
  }else{
    callback(new Error("Invalid path"));
  }
}

function httpRequest(data, callback){
  restler.post(POST_URL, {
    multipart: true,
    headers:{ 'Cookie': 'LANG=1; AGE=18' /* LANG=1 is English.*/ },
    data: data
  })
  .removeAllListeners("error")
  .removeAllListeners("complete")
  .on("error", function(err){
    callback(err);
  })
  .on("complete", function(content) {
    // Check error.
    // Because it cannot determine the http status code, to determine the content
    for(var i = 0; i < ERROR_RESPONSES.length; i++){
      if(content.indexOf(ERROR_RESPONSES[i].resp) >= 0){
        return callback(new Error(ERROR_RESPONSES[i].msg));
      }
    }

    var results = scraping(content);
    // Error detection.
    // If an error occurs,  I want to add to the ERROR_RESPONSES.
    if(results.length === 0){
      console.error("dojin.js : Empty results");
    }
    callback(null, results);
  });
}

function scraping(contents) {
  var $ = cheerio.load(contents);
  // scraping
  return $("#main .round_middle,#main .round_middle2").map(function(i, elem){

    var bookinfo = $(elem).find(".bookinfo2");

    // Pick up the keys.
    var keys = bookinfo.find("span.L0").map(function(i, elem){
      return $(elem).text().toLowerCase().replace(/:$/, "");
    });

    // Pick up the values.
    var values = bookinfo.find("span.LPEXACT1").map(function(i, elem){
      return $(elem).text();
    });

    // Don't forget the cover image URL.
    var cover = {cover: $(this).find("[alt='cover']").attr("src")};

    var pear = _.object(keys, values);
    return _.extend(pear, cover);
  });
}

