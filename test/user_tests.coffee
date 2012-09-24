should = require('chai').Should()
Client = require('request-json').JsonClient
app = require('../server')

email = "test@test.com"
password = "password"

client = new Client("http://localhost:8888/")

# Initializers 

clearDb = (callback) ->

    destroyApplications = ->
        Application.destroyAll callback

    destroyUsers = ->
        User.destroyAll (error) ->
            if error
                 callback()
            else
                 destroyApplications()
            
    destroyUsers()


describe "Modify account failure", ->

    before (done) ->
        app.listen(8888)
        clearDb ->
            User.create
                email: email
                password: password
                , ->
                    done()

    after (done) ->
        app.close()
        done()

    it "When I change my account with a wrong string as email", (done) ->
        data = email: "wrongemail"
        client.post "api/user", data, (error, response, body) =>
            @response = response
            @body = body
            done()

    it "Then an error response is returned.", ->
        @response.statusCode.should.equal 400
        @body.error.should.equal true

    it "When I send a register request with a too short password", (done) ->
        data = password1: "pas"
        client.post "api/user", data, (error, response, body) =>
            @response = response
            @body = body
            done()

    it "Then an error response is returned.", ->
        @response.statusCode.should.equal 400

    it "When I send a register request with two different passwords", (done) ->
        data = password1: "password", password2: "blabla"
        client.post "api/user", data, (error, response, body) =>
            @response = response
            @body = body
            done()

    it "Then an error response is returned.", ->
        @response.statusCode.should.equal 400


describe "Modify account success", ->
    
    before (done) ->
        app.listen(8888)
        clearDb ->
            User.create
                email: email
                password: password
                , ->
                    done()

    after (done) ->
        app.close()
        done()


    it "When I change my account with right data", (done) ->
        data =
            email: "test@test.fr"
            password1: "password2"
            password2: "password2"
        client.post "api/user", data, (error, response, body) =>
            @response = response
            @body = body
            done()

    it "Then success response is returned.", ->
        @response.statusCode.should.equal 200


    it "And user data should be updated", ->
        User.all (err, users) ->
            user = users[0]
            user.email.should.equal "test@test.fr"
            user.password1.should.equal "password2"
            user.password2.should.equal "password2"
