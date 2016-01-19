should = require('chai').Should()
expect = require('chai').expect
Client = require('request-json').JsonClient

helpers = require '../helpers'
appHelpers = require "#{helpers.prefix}../server/lib/applications"
Application = require "#{helpers.prefix}../server/models/application"

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


# Reset the last calls for servers.
resetTestServers = ->
    @controller.reset()
    @proxy.reset()


# Initiate fake servers.
startTestServers = ->
    controllerFn = (req, body) ->
        if req.url is '/drones/running' then {app: {}}
        else { drone: { port: 8001 } }

    @controller = helpers.fakeServer controllerFn, 200
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

    describe 'createAccessToken', ->

        it 'returns a 32 chars random token', ->
            token = appHelpers.createAccessToken()
            should.exist token
            token.length.should.equal 32

        it 'and it should be unique', ->
            token = appHelpers.createAccessToken()
            token2 = appHelpers.createAccessToken()
            token3 = appHelpers.createAccessToken()
            token.should.not.equal token2
            token.should.not.equal token3
            token2.should.not.equal token3


    describe 'markBroken', ->
        app = new Application TESTAPP
        testErr = new Error 'Test error'
        testErr.code = 123

        before (done) ->
            Application.create app, (err, newApp) ->
                app = newApp
                appHelpers.markBroken app, testErr, done

        after (done) ->
            app.destroy done

        it 'sets app state as broken', ->
            app.state.should.equal 'broken'

        it 'saves error code in a dedicated field of the model', ->
            should.exist app.errorcode
            app.errorcode.should.equal testErr.code

        it 'saves error message in a dedicated field of the model', ->
            app.errormsg.should.equal "#{testErr.message}:\n #{testErr.stack}"


    describe 'markInstalled', ->
        app = new Application TESTAPP
        app.port = 9132

        before (done) ->
            Application.create app, (err, newApp) ->
                app = newApp
                appHelpers.markInstalled app, (err) ->
                    done()

        after (done) ->
            app.destroy done

        it 'sets app state as installed', ->
            app.state.should.equal 'installed'
        it 'sets app save port on which app is running', ->
            app.port.should.equal 9132


    describe 'setIcon', ->
        app = new Application TESTAPP
        app.port = 9132

        before (done) ->
            Application.create app, (err, newApp) ->
                app = newApp
                appHelpers.setIcon app, (err, app) ->
                    done()

        after (done) ->
            app.destroy done

        it.skip 'attaches the icon file to the app document', (done) ->
            Application.find app.id, (err, app) ->
                console.log app.attachments
                done()
        it.skip 'saves the icon at the app level', ->

    describe "install", ->
        app = new Application TESTAPP
        app.port = 9132

        before (done) ->
            Application.create app, (err, newApp) ->
                app = newApp
                appHelpers.install app, (err, app) ->
                    setTimeout done, 1000

        after (done) ->
            app.destroy done

        it 'requests controller for installation', ->
            request = @controller.lastCall().request
            request.url.should.equal "/drones/my-app/start"
            request.method.should.equal "POST"
            body = @controller.lastCall().body
            should.exist body.start.user
            should.exist body.start.name
            should.exist body.start.repository
            should.exist body.start.scripts

        it 'requests the proxy to update its routes', ->
            @proxy.lastCall().request.url.should.equal "/routes/reset"

        it 'sets app state as installed', ->
            app.state.should.equal 'installed'
