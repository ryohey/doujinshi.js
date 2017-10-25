const dojin = require("../lib/dojin")
const args = process.argv.slice(2)

const fileOrUrl = args[0]

if (!fileOrUrl) {
  console.error("You must provide a file path or an URL")
  return
}

dojin(fileOrUrl)
  .then(result => console.log(result))
  .catch(error => console.error(error.message))
