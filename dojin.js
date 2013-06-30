var restler = require('restler');
var fs = require("fs");
var cheerio = require('cheerio');

module.exports = function(jpgFilePath, complete){
  fs.stat(jpgFilePath, function(err, stats) {
      if (err) return complete(err);
      restler.post("http://doujinshi.mugimugi.org/IMGSERV/socket.php", {
          multipart: true,
          headers:{
            'Cookie': 'LANG=1; AGE=18', // LANG=1 is English.
            'Accept': '*/*',
            'User-Agent': "Mozilla/5.0 (Windows NT 6.1; Intel Mac OS X 10.6; rv:7.0.1) Gecko/20100101 Firefox/7.0.1"
          },
          data: {
              "COLOR": "4",
              "img": restler.file(jpgFilePath, null, stats.size, null, "image/jpg")
          }
      }).on("error", function(err){
        return complete(err);
      })
      .on("complete", function(data) {
        $ = cheerio.load(data);
        var arr = [];
        $("#main .round_middle,#main .round_middle2").each(function(){
          var bookinfo = $(this).find(".bookinfo2");
          var names = bookinfo.find("span.L0");
          var values = bookinfo.find("span.LPEXACT1");
          var dict = {};
          for (var i = 0; i<names.length; ++i){
            dict[$(names[i]).text().toLowerCase().replace(/:$/,"")] = $(values[i]).text();
          }
          dict["cover"] = $(this).find("[alt='cover']").attr("src");
          arr.push(dict);
        });
        complete(undefined, arr);
      });
  });
}
