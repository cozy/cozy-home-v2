should = require("should")
Browser = require("../../common/test/browser").Browser
helpers = require("./helpers")

app = require("../../server")

email = "test@mycozycloud.com"
password = "password"


describe "Register", ->

    before (done) ->
        app.listen 3000
        helpers.init done

    before (done) ->
        @browser = new Browser()
        @browser.visit "http://localhost:3000/", =>
            done()

    it "When I connect the first time on my newebe", ->

    it "Then I expect that register form is displayed", ->
        should.exist @browser.query("#register-email")
        should.exist @browser.query("#register-password")
        @browser.isVisible("#buttons").should.not.be.ok

    it "When I fill form with default credentials", ->
        @browser.fill "#register-email", email
        @browser.fill "#register-password", password

    it "And submit it", (done) ->
        @browser.enterKeyUp "#register-password"
        helpers.waits done, 600

    it "Navigation buttons and application list are displayed", ->
        @browser.isVisible("#buttons").should.be.ok
        @browser.isVisible("#home-view").should.be.ok

    after (done) ->
        helpers.clearAll ->
            app.close()
            done()

