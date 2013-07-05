"use strict"

dojin = require "../dojin"
expect = require("chai").expect

testJpg = __dirname + "/img/white.jpg"

# Tests that do not involve communication.
describe "local test", ->
  describe "Check error", ->
    # Load reduction.
    beforeEach (done) ->
      setTimeout(done, 5000)

   it "Has error when the file doesn't exists.", (done) ->
     dojin "illegal_name.jpg", (err, response) ->
       expect(err).to.exists
       expect(err).to.have.property("code", "ENOENT")
       done()

# Tests with communication
describe "http test", ->
  describe "request", ->
    it "The response has the properties of the minimum.", (done) ->
      dojin testJpg, (err, response) ->
        expect(err).to.not.exists
        expect(response).to.exists
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


