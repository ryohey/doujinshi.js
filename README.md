# dojin.js

[![Build Status](http://jenkins.logginging.org/job/dojin.js%20nightly%20test/badge/icon)](http://jenkins.logginging.org/job/dojin.js%20nightly%20test/)

dojin.js is a simple dojinshi metadata search module for nodejs.

# How to install

```sh
npm install dojin
```

# Example code

```js
var dojin = require("dojin");

dojin("path_to_image", function(err, response){
  if(err) return console.log(err);
  console.log(response);
  // The good information!
});
```

"path_to_image" is

* path/to/image.jpg
* path/to/image.jpeg
* path/to/image.png
* path/to/image.gif

or

* http://url/to/image

