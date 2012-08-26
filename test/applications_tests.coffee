http = require('http')
should = require('chai').Should()
client = require('../common/test/client')
server = require('../server')


email = "test@test.com"
password = "password"

client = new client.Client("http://localhost:8888/")

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


fakeServer = (json, code=200, callback=null) ->
    http.createServer (req, res) ->
        body = ""
        req.on 'data', (chunk) ->
            body += chunk
        req.on 'end', ->
            routeInfos = JSON.parse body
            res.writeHead code, 'Content-Type': 'application/json'
            if callback?
                callback(JSON.parse body)
            res.end(JSON.stringify json)


describe "Application installation", ->

    before (done) ->
        server.listen(8888)
        clearDb ->
            initDb ->
                client.post "login", password: password, \
                            (error, response, body) ->
                    done()

    before ->
        @haibu = fakeServer { drone: { port: 8001 } }, 200, (body) ->
            should.exist body.start.user
            should.exist body.start.name
            should.exist body.start.repository
            should.exist body.start.scripts
        @haibu.listen(9002)
        @proxy = fakeServer msg: "ok", 201, (body) ->
            should.exist body.route
            should.exist body.port
            body.route.should.equal "/apps/my-app"
            body.port.should.equal 8001
        @proxy.listen(4000)

    after ->
        @haibu.close()
        @proxy.close()


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

    describe "POST /api/applications/install Install a new application", ->
        it "When I send a request to install an application", (done) ->
            data =
                name: "My App",
                description: "description",
                git: "git@github.com:mycozycloud/my-app.git"
            client.post "api/applications/install", \
                        data, (error, response, body) =>
                @response = response
                @body = body
                done()

        it "Then it sends me back my app with an id and a state", ->
            @response.statusCode.should.equal 201
            should.exist @body.success
            should.exist @body.app
            should.exist @body.app.slug
            should.exist @body.app.port
            @body.success.should.ok
            @body.app.slug.should.equal "my-app"
            @body.app.port.should.equal 8001

        it "When I send a request to retrieve all applications", (done) ->
            client.get "api/applications", (error, response, body) =>
                @body = JSON.parse body
                done()

        it "Then I got expected application in a list", ->
            @body.rows.length.should.equal 2
            @body.rows[1].name.should.equal "My App"


describe "Application uninstallation", ->
    
    before ->
        @haibu = fakeServer msg: "ok" , 200, (body) ->
            should.exist body.user
            should.exist body.name
            should.exist body.repository
            should.exist body.scripts
        @haibu.listen 9002
        @proxy = fakeServer msg: "ok", 204, (body) ->
            should.exist body.route
            body.route.should.equal "/apps/my-app"
        @proxy.listen 4000

    after ->
        @haibu.close()
        @proxy.close()

    describe "DELETE /api/applications/:slug/uninstall Remove an app", ->
        
        it "When I send a request to uninstall an application", (done) ->
            client.delete "api/applications/my-app/uninstall", \
                          (error, response, body) =>
                @response = response
                @body = JSON.parse body
                done()

        it "Then it sends me a success response", ->
            @response.statusCode.should.equal 200
            should.exist @body.success
            @body.success.should.be.ok
            
        it "When I send a request to retrieve all applications", (done) ->
            client.get "api/applications", (error, response, body) =>
                @body = JSON.parse body
                done()

        it "Then I got not see my application in the list", ->
            @body.rows.length.should.equal 1
            @body.rows[0].name.should.not.equal "My App"


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

