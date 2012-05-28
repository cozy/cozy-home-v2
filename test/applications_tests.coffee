should = require('should')
client = require('./client')
server = require('../server')


email = "test@test.com"
password = "password"


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


initDb = (callback) ->

    createUser = ->
        bcrypt = require('bcrypt')
        salt = bcrypt.genSaltSync(10)
        hash = bcrypt.hashSync(password, salt)

        user = new User
            email: email
            owner: true
            password: hash
            activated: true

        user.save (error) ->
            callback(error)

    createApp = ->
        app = new Application
            name: "Noty plus"
            state: "installed"
            index: 0
            slug: "noty-plus"

        app.save (error) ->
            createUser()
            
    createApp()


describe "Applications", ->

    before (done) ->
        server.listen(3000)
        clearDb ->
            initDb ->
                client.post "login", password: password, \
                            (error, response, body) ->
                    done()

    describe "GET /api/applications Get all applications", ->
        it "When I send a request to retrieve all applications", (done) ->
            client.get "api/applications", (error, response, body) ->
                storeResponse error, response, body, done

        it "Then I got expected application in a list", ->
            responseTest.statusCode.should.equal 200
            should.exist bodyTest
            bodyTest = JSON.parse bodyTest
            should.exist bodyTest.rows
            bodyTest.rows.length.should.equal 1
            bodyTest.rows[0].name.should.equal "Noty plus"


describe "Users", ->

    after (done) ->
        server.close()
        done()

    describe "GET /api/users Get all users", ->
        it "When I send a request to retrieve all users", (done) ->
            client.get "api/users", (error, response, body) ->
                storeResponse error, response, body, done

        it "Then I got expected users in a list", ->
            responseTest.statusCode.should.equal 200
            should.exist bodyTest
            bodyTest = JSON.parse bodyTest
            should.exist bodyTest.rows
            bodyTest.rows.length.should.equal 1
            bodyTest.rows[0].email.should.equal email

