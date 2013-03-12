http = require('http')
should = require('chai').Should()
Client = require('request-json').JsonClient
server = require('../server')


email = "test@test.com"
password = "password"

client = new Client("http://localhost:8888/")

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
            res.writeHead code, 'Content-Type': 'application/json'
            if callback?
                data = JSON.parse body if body? and body.length > 0
                callback data
            res.end(JSON.stringify json)


describe "Application installation", ->

    fakeHaibuLastBody = {}

    before (done) ->
        server.listen(8888)
        clearDb ->
            initDb ->
                client.post "login", password: password, \
                            (error, response, body) ->
                    done()

    before ->
        @haibu = fakeServer { drone: { port: 8001 } }, 200, (body) =>
            fakeHaibuLastBody = body
            should.exist body.start.user
            should.exist body.start.name
            should.exist body.start.repository
            should.exist body.start.scripts
        @haibu.listen(9002)

        @proxy = fakeServer msg: "ok", 200, (body) ->

        @proxy.listen 9104

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
            bodyTest = bodyTest
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
                @body = body
                done()

        it "Then I got expected application in a list", ->
            @body.rows.length.should.equal 2
            @body.rows[0].name.should.equal "My App"

    describe "Install a new application with specific branch", ->
        it "When I send a request to install an application on branch mybranch", \
                     (done) ->
            data =
                name: "My App 2",
                description: "description",
                git: "git@github.com:mycozycloud/my-app2.git"
                branch:"mybranch"
            client.post "api/applications/install", \
                        data, (error, response, body) =>
                @response = response
                @body = body
                done()

        it "Then it sends me back my app with correct branch", ->
            @response.statusCode.should.equal 201
            should.exist @body.success
            should.exist @body.app.branch
            @body.app.branch.should.equal "mybranch"
            fakeHaibuLastBody.start.repository.branch.should.equal "mybranch"
            @body.app.port.should.equal 8001

        it "When I send a request to retrieve all applications", (done) ->
            client.get "api/applications", (error, response, body) =>
                @body = body
                done()

        it "The branch is still there", ->
            @body.rows.length.should.equal 3
            @body.rows[1].branch.should.equal "mybranch"


describe "Application update", ->
    
    before ->
        @haibu = fakeServer { drone: { port: 8001 } }, 200, (body) ->

        @haibu.listen 9002
        @proxy = fakeServer msg: "ok", 200, (body) ->

        @proxy.listen 9104

    after ->
        @haibu.close()
        @proxy.close()

    describe "UPDATE /api/applications/:slug/update Update an app", ->
        
        it "When I send a request to update an application", (done) ->
            client.put "api/applications/my-app/update", {}, \
                          (error, response, body) =>
                @response = response
                @body = body
                done()

        it "Then it sends me a success response", ->
            @response.statusCode.should.equal 200
            should.exist @body.success
            @body.success.should.be.ok

describe "Application stop", ->
    
    before ->
        @haibu = fakeServer { drone: { port: 8001 } }, 200, (body) ->

        @haibu.listen 9002
        @proxy = fakeServer msg: "ok", 200, (body) ->

        @proxy.listen 9104

    after ->
        @haibu.close()
        @proxy.close()

    describe "POST /api/applications/:slug/stop Stop an app", ->
        
        it "When I send a request to stop an application", (done) ->
            client.post "api/applications/my-app/stop", {}, \
                          (error, response, body) =>
                @response = response
                @body = body
                done()

        it "Then it sends me a success response", ->
            @response.statusCode.should.equal 200
            should.exist @body.success
            @body.success.should.be.ok

        it "which contains the updated app", ->
            should.exist @body.app
            @body.app.state.should.equal 'stopped'

describe "Application start", ->
    
    before ->
        @haibu = fakeServer { drone: { port: 8001 } }, 200, (body) ->

        @haibu.listen 9002
        @proxy = fakeServer msg: "ok", 200, (body) ->

        @proxy.listen 9104

    after ->
        @haibu.close()
        @proxy.close()

    describe "POST /api/applications/:slug/start Start an app", ->
        
        it "When I send a request to start an application", (done) ->
            client.post "api/applications/my-app/start", {}, \
                          (error, response, body) =>
                @response = response
                @body = body
                done()

        it "Then it sends me a success response", ->
            @response.statusCode.should.equal 200
            should.exist @body.success
            @body.success.should.be.ok

        it "which contains the updated app", ->
            should.exist @body.app
            @body.app.state.should.equal 'installed'
            

describe "Application uninstallation", ->
    
    before ->
        @haibu = fakeServer msg: "ok" , 200, (body) ->
            should.exist body.user
            should.exist body.name
            should.exist body.repository
            should.exist body.scripts
        @haibu.listen 9002
        @proxy = fakeServer msg: "ok", 200, (body) ->
        @proxy.listen 9104

    after ->
        @haibu.close()
        @proxy.close()

    describe "DELETE /api/applications/:slug/uninstall Remove an app", ->
        
        it "When I send a request to uninstall an application", (done) ->
            client.del "api/applications/my-app/uninstall", \
                          (error, response, body) =>
                @response = response
                @body = body
                done()

        it "Then it sends me a success response", ->
            @response.statusCode.should.equal 200
            should.exist @body.success
            @body.success.should.be.ok
            
        it "When I send a request to retrieve all applications", (done) ->
            client.get "api/applications", (error, response, body) =>
                @body = body
                done()

        it "Then I do not see my application in the list", ->
            @body.rows.length.should.equal 2
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
            bodyTest = bodyTest
            should.exist bodyTest.rows
            bodyTest.rows.length.should.equal 1
            bodyTest.rows[0].email.should.equal email
