should = require("should")
Browser = require("../../common/test/browser").Browser
helpers = require("./helpers")

app = require("../../server")

email = "test@mycozycloud.com"
password = "password"

describe "Login & logout", ->

    before (done) ->
        app.listen 3000
        helpers.init true, done

    before (done) ->
        @browser = new Browser()
        @browser.visit "http://localhost:3000/", =>
            done()

    describe "Login", ->
        it "When I connect on my already registered cozy", ->

        it "Then I expect that sign in form is displayed", ->
            should.exist @browser.query("#login-password")

        it "When I fill form with default credentials", ->
            @browser.fill "#login-password", password

        it "And submit it", (done) ->
            @browser.enterKeyUp "#login-password"
            helpers.waits done, 500

        it "Navigation buttons and application list are displayed", ->
            @browser.isVisible("#buttons").should.be.ok
            @browser.isVisible("#app-list").should.be.ok

    describe "Logout", ->
        it "When I click on logout button", (done) ->
            @browser.click "#logout-button"
            helpers.waits done, 500

        it "Then I expect that sign in form is displayed", ->
            @browser.isVisible("#login-password").should.be.ok
 
        it "And that navigation buttons and application list are hidden", ->
            @browser.isVisible("#buttons button").should.not.be.ok
            @browser.isVisible("#app-list").should.not.be.ok

    after (done) ->
        helpers.clearAll ->
            app.close()
            done()

