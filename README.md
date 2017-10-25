# dojin.js

dojin.js is a simple dojinshi metadata search module for nodejs.
https://www.doujinshi.org/

# How to install

```sh
npm install dojin
```

# Example code

```js
const dojin = require("dojin")

dojin("path_to_image")
  .then(result){
    console.log(result)
  })
```

"path_to_image" is

* path/to/image.jpg
* path/to/image.jpeg
* path/to/image.png
* path/to/image.gif

or

* http://url/to/image

# Command line interface

```bash
dojin page0001.jpg
```

```bash
dojin https://example.com/page0001.jpg
```
