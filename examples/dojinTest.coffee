dojin = require("../dojin")

dojin "your_dojin_file.jpg", (err, res) ->
  console.log err if (err)
  console.log res
