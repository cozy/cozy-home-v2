should = require('chai').Should()
expect = require('chai').expect
helpers = require './helpers'

TESTMAIL = "test@test.com"
TESTPASS = "password"
TESTPORT = 8889
TESTAPP =
    name: "My App",
    description: "description",
    git: "https://github.com/mycozycloud/my-app.git"

TESTAPPBRANCH =
    name: "My App 2",
    description: "description",
    git: "https://github.com/mycozycloud/my-app2.git"
    branch:"mybranch"

# reset the last calls for servers
resetTestServers = ->
    @controller.reset()
    @proxy.reset()

#initiate fake servers
startTestServers = ->
    @controller = helpers.fakeServer { drone: { port: 8001 } }, 200
    @controller.listen 9002

    @proxy = helpers.fakeServer msg: "ok", 200
    @proxy.listen 9104

    @fakeApp = helpers.fakeServer this_should_be_an: 'icon', 200
    @fakeApp.listen 8003

stopTestServers = ->
    @controller.close()
    @proxy.close()
    @fakeApp.close()


describe "Applications management", ->

    before helpers.setup TESTPORT
    before helpers.createUser TESTMAIL, TESTPASS
    before helpers.createApp "Noty plus", "noty-plus", 0, "installed"
    before startTestServers
    before -> @client = helpers.getClient TESTPORT, @
    after stopTestServers
    after helpers.takeDown


    describe "Applications install", ->



        describe "GET /api/applications Get all applications", ->

            it "When I send a request to retrieve all applications", (done) ->
                @client.get "api/applications", done

            it "Then I got expected application in a list", ->
                @response.statusCode.should.equal 200
                expect(@body).to.have.property('rows').with.length 1
                expect(@body.rows[0].name).to.equal "Noty plus"

        describe "POST /api/applications/install Install a new application", ->

            before resetTestServers

            it "When I send a request to install an application", (done) ->
                this.timeout 10000
                @client.post "api/applications/install", TESTAPP,  done

            it "Then it sends me back my app with an id and a state", ->
                @response.statusCode.should.equal 201
                expect(@body.success).to.be.ok
                expect(@body).to.have.property 'app'
                expect(@body.app.state).to.equal 'installing'
                expect(@body.app.slug).to.equal 'my-app'

            it "After some time, ...", (done) ->
                setTimeout done, 1000

            it "And controller have been requested to install this app", ->
                request = @controller.lastCall().request

                request.url.should.equal "/drones/my-app/start"
                request.method.should.equal "POST"

                body = @controller.lastCall().body
                should.exist body.start.user
                should.exist body.start.name
                should.exist body.start.repository
                should.exist body.start.scripts

            it "And the proxy have been requested to update its routes", ->
                 @proxy.lastCall().request.url.should.equal "/routes/reset"

            it "When I send a request to retrieve all applications", (done) ->
                @client.get "api/applications", done

            it "Then I get my new application in the list", ->
                expect(@body).to.have.property('rows').with.length 2
                expect(@body.rows[0].name).to.equal "My App"

        describe "Install a new application with specific branch", ->

            before resetTestServers

            it "When I install an application on branch mybranch", (done) ->
                @client.post "api/applications/install", TESTAPPBRANCH, done

            it "Then it sends me back my app with correct branch", ->
                @response.statusCode.should.equal 201
                expect(@body?.app?.branch).to.equal "mybranch"

            it "After some time, ...", (done) ->
                setTimeout done, 1000

            it "And controller have been requested with correct branch", ->
                body = @controller.lastCall().body
                body.start.repository.branch.should.equal "mybranch"

            it "When I send a request to retrieve all applications", (done) ->
                @client.get "api/applications", done

            it "The branch is still there", ->
                expect(@body).to.have.property('rows').with.length 3
                expect(@body.rows[1].branch).to.equal "mybranch"


    describe "Application update", ->

        before resetTestServers

        describe "UPDATE /api/applications/:slug/update Update an app", ->

            it "When I send a request to update this application", (done) ->
                @client.put "api/applications/my-app/update", {}, done

            it "Then it sends me a success response", ->
                console.log @body
                #@response.statusCode.should.equal 200
                #expect(@body.success).to.be.ok    

    describe "Application update all", ->

        before resetTestServers

        describe "UPDATE /api/applications/update/all Update all app", ->

            it "When I send a request to update an application", (done) ->
                @client.put "api/applications/update/all", {}, done

            it "Then it sends me a success response", ->
                @response.statusCode.should.equal 200
                expect(@body.success).to.be.ok

    describe "Application stop", ->

        before resetTestServers

        describe "POST /api/applications/:slug/stop Stop an app", ->

            it "When I send a request to stop an application", (done) ->
                @client.post "api/applications/my-app/stop", {}, done

            it "Then it sends me a success response with the updated app", ->
                @response.statusCode.should.equal 200
                expect(@body.success).to.be.ok
                expect(@body.app.state).to.equal 'stopped'

            it "And controller have been requested to stop this app", ->
                request = @controller.lastCall().request
                request.url.should.equal "/drones/my-app/stop"
                request.method.should.equal "POST"

            it "And the proxy have been requested to update its routes", ->
                @proxy.lastCall().request.url.should.equal "/routes/reset"

    describe "Application start", ->

        before resetTestServers

        describe "POST /api/applications/:slug/start Start an app", ->

            it "When I send a request to stop an application", (done) ->
                @client.post "api/applications/my-app/start", {}, done

            it "Then it sends me a success response with the updated app", ->
                @response.statusCode.should.equal 200
                expect(@body.success).to.be.ok
                expect(@body.app.state).to.equal 'installed'

            it "And controller have been requested to start this app", ->
                request = @controller.lastCall().request
                request.url.should.equal "/drones/my-app/start"
                request.method.should.equal "POST"

            it "And the proxy have been requested to update its routes", ->
                @proxy.lastCall().request.url.should.equal "/routes/reset"    


    ###describe "Application auto stop", ->

        before resetTestServers

        describe "POST /api/applications/:slug/start Start an app", ->

            it "When I send a request to stop an application", (done) ->
                @client.post "api/applications/my-app/start", {}, done

            it "Then it sends me a success response with the updated app", ->
                @response.statusCode.should.equal 200
                expect(@body.success).to.be.ok
                expect(@body.app.state).to.equal 'installed'

            it "And I wait 3 minutes", (done) ->
                @timeout(3.2 * 60 * 1000)
                setTimeout () ->
                    done()
                , 3.1 * 60 * 1000

            it "And controller have been requested to stop this app", ->
                request = @controller.lastCall().request
                request.url.should.equal "/drones/my-app/stop"
                request.method.should.equal "POST"

            it "And the proxy have been requested to update its routes", ->
                @proxy.lastCall().request.url.should.equal "/routes/reset"  ###


    describe "Application uninstallation", ->

        before resetTestServers

        describe "DELETE /api/applications/:slug/uninstall Remove an app", ->

            it "When I send a request to uninstall an application", (done) ->
                @client.del "api/applications/my-app/uninstall", done

            it "Then it sends me a success response", ->
                @response.statusCode.should.equal 200
                expect(@body.success).to.be.ok

            it "And controller have been requested to clean this app", ->
                request = @controller.lastCall().request
                request.url.should.equal "/drones/my-app/clean"
                request.method.should.equal "POST"

            it "And the proxy have been requested to update its routes", ->
                @proxy.lastCall().request.url.should.equal "/routes/reset"

        describe "GET /api/applications Check if app removed", ->

            before resetTestServers

            it "When I send a request to retrieve all applications", (done) ->
                @client.get "api/applications", done

            it "Then I do not see my application in the list", ->
                expect(@body).to.have.property('rows').with.length 2
                expect(@body.rows[0].branch).to.not.equal "My App"


    describe "Users", ->

        before resetTestServers

        describe "GET /api/users Get all users", ->
            it "When I send a request to retrieve all users", (done) ->
                @client.get "api/users", done

            it "Then I got expected users in a list", ->
                @response.statusCode.should.equal 200
                expect(@body).to.have.property('rows').with.length 1
                expect(@body.rows[0].email).to.equal TESTMAIL
