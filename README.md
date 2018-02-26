# doujinshi.js

doujinshi.js is a simple doujinshi metadata search module for nodejs.
https://www.doujinshi.org/

# How to install

```sh
npm install doujinshi
```

# Example code

```js
const doujinshi = require("doujinshi")

doujinshi("path_to_image")
  .then(result => {
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
doujinshi page0001.jpg
```

```bash
doujinshi https://example.com/page0001.jpg
```
