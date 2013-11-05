should = require("should")
Browser = require("../../common/test/browser").Browser
helpers = require("./helpers")

app = require("../../server")

email = "test@mycozycloud.com"
newEmail = "newtest@mycozylcoud.com"
password = "password"
newPassword = "newpassword"

describe "Account", ->

    before (done) ->
        app.listen 3000
        helpers.init true, done

    before (done) ->
        @browser = new Browser()
        @browser.visit "http://localhost:3000/", =>
            done()

    describe "Browse account page", ->

        it "Given I am logged in", (done) ->
            @browser.fill "#login-password", password
            @browser.enterKeyUp "#login-password"
            helpers.waits done, 500

        it "When I click on account button", (done) ->
            @browser.click "#account-button"
            helpers.waits done, 500

        it "Account button is replaced by applications button", ->
            @browser.isVisible("#account-button").should.not.be.ok
            @browser.isVisible("#home-button").should.be.ok
            
        it "And account form is visible.", ->
            @browser.isVisible("#account-form").should.be.ok
            @browser.val("#account-email-field").should.be.equal email


    describe "Change password", ->
        it "When I change email / password form", ->
            @browser.fill("#account-email-field", newEmail)
            @browser.fill("#account-password1-field", newPassword)
            @browser.fill("#account-password2-field", newPassword)

        it "And I click on send changes", (done) ->
            @browser.click "#account-form-button"
            helpers.waits done, 500

        it "And I click on logout", (done) ->
            @browser.prompted("Data were correctly changed.").should.be.ok
            @browser.click "#logout-button"
            helpers.waits done, 500

        it "And I sign in with new password", (done) ->
            @browser.fill "#login-password", newPassword
            @browser.enterKeyUp "#login-password"
            helpers.waits done, 500

        it "Then I am logged in", ->
            @browser.isVisible("#app-list").should.be.ok

        it "When I click on account button", (done) ->
            @browser.click "#account-button"
            helpers.waits done, 500

        it "Then new email appeared in email account field", ->
            @browser.val("#account-email-field").should.be.equal newEmail


    after (done) ->
        helpers.clearAll ->
            app.close()
            done()
