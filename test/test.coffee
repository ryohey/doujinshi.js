"use strict"

dojin = require "../dojin"
expect = require("chai").expect

testJpg = __dirname + "/img/white.jpg"
testJpeg = __dirname + "/img/white.jpeg"
testPng = __dirname + "/img/white.png"
testGif = __dirname + "/img/white.gif"

remotePngUrl = "http://nodejs.org/images/logo.png"
textUrl = "http://google.com"
invalidUrl = "http://aaaaaaaaaaaaa";

# Tests that do not involve communication.
describe "local test", ->
  describe "Check error", ->

   it "Has error when the file doesn't exists.", (done) ->
     dojin "illegal_name.jpg", (err, response) ->
       expect(err).to.exist
       expect(err).to.have.property("code", "ENOENT")
       done()

   it "Has error when the invalid file extentions.", (done) ->
     dojin "invalid_extentions.hoge", (err, response) ->
       expect(err).to.exist
       done()

   it "Has Error when invalid url.", (done) ->
     dojin "invalid://hogehoge.com", (err, response) ->
       expect(err).to.exist
       done()

# Tests with communication
describe "http test", ->
  # Load reduction.
  beforeEach (done) ->
    setTimeout(done, 5000)

  describe "Submit a local image file", ->

    it "JPG File", (done) ->
      dojin testJpg, (err, response) ->
        expect(err).to.not.exist
        expect(response).to.exist
        expect(response).to.be.instanceof(Array)
        expect(response).to.be.not.empty
        expect(response).to.have.deep.property("[0].romanized")
        expect(response).to.have.deep.property("[0].original")
        expect(response).to.have.deep.property("[0].circle")
        expect(response).to.have.deep.property("[0].author")
        expect(response).to.have.deep.property("[0].parody")
        expect(response).to.have.deep.property("[0].type")
        expect(response).to.have.deep.property("[0].score")
        expect(response).to.have.deep.property("[0].cover")
        done()

    it "JPEG File", (done) ->
      dojin testJpeg, (err, response) ->
        expect(err).to.not.exist
        expect(response).to.exist
        expect(response).to.be.instanceof(Array)
        expect(response).to.be.not.empty
        expect(response).to.have.deep.property("[0].romanized")
        expect(response).to.have.deep.property("[0].original")
        expect(response).to.have.deep.property("[0].circle")
        expect(response).to.have.deep.property("[0].author")
        expect(response).to.have.deep.property("[0].parody")
        expect(response).to.have.deep.property("[0].type")
        expect(response).to.have.deep.property("[0].score")
        expect(response).to.have.deep.property("[0].cover")
        done()

    it "PNG File", (done) ->
      dojin testPng, (err, response) ->
        expect(err).to.not.exist
        expect(response).to.exist
        expect(response).to.be.instanceof(Array)
        expect(response).to.be.not.empty
        expect(response).to.have.deep.property("[0].romanized")
        expect(response).to.have.deep.property("[0].original")
        expect(response).to.have.deep.property("[0].circle")
        expect(response).to.have.deep.property("[0].author")
        expect(response).to.have.deep.property("[0].parody")
        expect(response).to.have.deep.property("[0].type")
        expect(response).to.have.deep.property("[0].score")
        expect(response).to.have.deep.property("[0].cover")
        done()

    it "GIF File", (done) ->
      dojin testGif, (err, response) ->
        expect(err).to.not.exist
        expect(response).to.exist
        expect(response).to.be.instanceof(Array)
        expect(response).to.be.not.empty
        expect(response).to.have.deep.property("[0].romanized")
        expect(response).to.have.deep.property("[0].original")
        expect(response).to.have.deep.property("[0].circle")
        expect(response).to.have.deep.property("[0].author")
        expect(response).to.have.deep.property("[0].parody")
        expect(response).to.have.deep.property("[0].type")
        expect(response).to.have.deep.property("[0].score")
        expect(response).to.have.deep.property("[0].cover")
        done()


  describe "Submit a image url", ->
    it "PNG URL", (done) ->
      dojin remotePngUrl, (err, response) ->
        expect(err).to.not.exist
        expect(response).to.exist
        expect(response).to.be.instanceof(Array)
        expect(response).to.be.not.empty
        expect(response).to.have.deep.property("[0].romanized")
        expect(response).to.have.deep.property("[0].original")
        expect(response).to.have.deep.property("[0].circle")
        expect(response).to.have.deep.property("[0].author")
        expect(response).to.have.deep.property("[0].parody")
        expect(response).to.have.deep.property("[0].type")
        expect(response).to.have.deep.property("[0].score")
        expect(response).to.have.deep.property("[0].cover")
        done()

    it "The URL is not in the image", (done) ->
      dojin textUrl, (err, response) ->
        expect(err).to.exist
        done()

    it "Invalid URL", (done) ->
      dojin invalidUrl, (err, response) ->
        expect(err).to.exist
        done()


