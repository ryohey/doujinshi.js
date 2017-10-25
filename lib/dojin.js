const fs = require("fs")
const cheerio = require("cheerio")
const _ = require("underscore")
const FormData = require("form-data")
const rp = require("request-promise-native")

const POST_URL = "https://www.doujinshi.org/IMGSERV/socket.php"

const ERROR_RESPONSES = [
  { resp: "Uploading URLERRR NO FUCKING PICTURE, FUCK OFF", msg: "Uploading URL Error" },
  { resp: "Uploading URLError downloading file from host,", msg: "Uploading URL Error" },
  { resp: "No file was uploaded", msg: "No file was uploaded" }
]

module.exports = (path) => {
  let form
  try {
    form = resolveFormData(path)
  } catch (e) {
    return Promise.reject(e)
  }
  return httpRequest(form)
}

/*
 * true  : path is the jpg, jpeg, png, gif
 * false : otherwise
 */
function isFile(path) {
  return /[jpg|jpeg|png|gif]$/.test(path)
}

function isUrl(path) {
  return /^https?:\/\//.test(path)
}

function resolveFormData(path) {
  const form = new FormData()
  if (isUrl(path)) {
    return { URL: path }
  } else if (isFile(path)) {
    if (!fs.existsSync(path)) {
      throw new Error(`file is not exist at ${path}`)
    }
    const size = fs.statSync(path).size
    return {
      COLOR: 4, // auto detect
      img: {
        value: fs.createReadStream(path),
        options: {
          header: {
            "Content-Length": size
          }
        }
      }
    }
  } else {
    throw new Error("Invalid path")
  }
  return form
}

function httpRequest(form) {
  return rp.post({
    url: POST_URL,
    followAllRedirects: true,
    formData: form,
    headers: { "Cookie": "LANG=1; AGE=18" /* LANG=1 is English.*/ },
  })
    .then(content => {
      // Check error.
      // Because it cannot determine the http status code, to determine the content
      const errorResponse = _.find(ERROR_RESPONSES, (er) => er.resp === content)
      if (errorResponse) {
        return Promise.reject(new Error(errorResponse.msg))
      }

      const results = scraping(content)
      if (results.length === 0) {
        return Promise.reject(new Error("Empty results"))
      }

      return results
    })
}

function scraping(contents) {
  const $ = cheerio.load(contents)
  // scraping
  return Array.from($("#main .round_middle,#main .round_middle2").map((i, elem) => {

    const bookinfo = $(elem).find(".bookinfo2")

    // Pick up the keys.
    const keys = bookinfo.find("span.L0").map((i, elem) => {
      return $(elem).text().toLowerCase().replace(/:$/, "")
    })

    // Pick up the values.
    const values = bookinfo.find("span.LPEXACT1").map((i, elem) => {
      return $(elem).text()
    })

    // Don't forget the cover image URL.
    const coverURL = $(elem).find("[alt='cover']").attr("src")

    const pear = _.object(Array.from(keys), Array.from(values))
    return {
      ...pear,
      cover: coverURL
    }
  }))
}
