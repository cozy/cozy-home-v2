should = require('should')
client = require('../common/test/client')
app = require('../server')


email = "test@test.com"
password = "password"

client = new client.Client("http://localhost:3000/")

## Helpers

responseTest = null
bodyTest = null

storeResponse = (error, response, body, done) ->
    responseTest = null
    bodyTest = null
    if error
        false.should.be.ok()
    else
        responseTest = response
        bodyTest = body
    done()

handleResponse = (error, response, body, done) ->
    if error
        false.should.be.ok()
    done()

testAuthentication = (isAuthenticated, isUser) ->
    responseTest.statusCode.should.equal 200
    should.exist bodyTest
    bodyTest = JSON.parse bodyTest
    if isAuthenticated
        bodyTest.success.should.equal true
    else
        bodyTest.error.should.equal true
        bodyTest.nouser.should.equal not isUser


# Initializers 

clearDb = (callback) ->

    destroyApplications = ->
        Application.destroyAll (error) ->
             if error
                 callback()
             else
                 callback()

    destroyUsers = ->
        User.destroyAll (error) ->
            if error
                 callback()
            else
                 destroyApplications()
            
    destroyUsers()


describe "Register", ->

    before (done) ->
        app.listen(3000)
        clearDb done

    after (done) ->
        app.close()
        done()

    it "When I send a request to check authentication", (done) ->
        client.get "authenticated", (error, response, body) ->
            storeResponse error, response, body, done

    it "Then I got a response telling me that no user is registered", ->
        testAuthentication false, false

    it "When I send a request to register", (done) ->
        data = email: email, password: password
        client.post "register", data, (error, response, body) ->
            storeResponse error, response, body, done

    it "Then I got a success response", ->
        responseTest.statusCode.should.equal 200
        should.exist bodyTest
        bodyTest.success.should.equal true

    it "When I send a request to check authentication", (done) ->
        client.get "authenticated", (error, response, body) ->
            storeResponse error, response, body, done

    it "Then I got a response telling me that user is registered but not 
        authenticated", ->
        testAuthentication false, true

    it "When I send a request to login", (done) ->
        client.post "login", password: password, (error, response, body) ->
            storeResponse error, response, body, done

    it "And I send a request to check authentication", (done) ->
        client.get "authenticated", (error, response, body) ->
            storeResponse error, response, body, done

    it "Then I got a response telling me that user is authenticated", ->
        testAuthentication true, true

    it "When I send a request to logout", (done) ->
        client.get "logout", (error, response, body) ->
            storeResponse error, response, body, done

    it "And I send a request to check authentication", (done) ->
        client.get "authenticated", (error, response, body) ->
            storeResponse error, response, body, done

    it "Then I got a response telling me that user is not authenticated", ->
        testAuthentication false, true
