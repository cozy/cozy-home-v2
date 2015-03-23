should = require 'should'
sinon = require 'sinon'
Client = require('request-json').JsonClient
helpers = require './helpers'

AutostopManager = require "#{helpers.prefix}server/lib/autostop"
{AppManager} = require "#{helpers.prefix}server/lib/paas"
Application = require "#{helpers.prefix}server/models/application"

getFixture = ->
    new Application
        slug: 'test'
        state: 'installed'
        password: '1235'
        errormsg: ''
        isStoppable: true

TESTPORT = 8889

minute = 60 * 1000

describe "Auto-stop manager", ->

    describe ".markBroken()", ->

        describe "Success case", ->

            before ->
                @sandbox = sinon.sandbox.create()
                @fixture = getFixture()
                @sandbox.stub @fixture, 'updateAttributes', (data, callback) =>
                    @fixture[field] = value for field, value of data
                    callback()

            after ->
                @sandbox.restore()

            it "When .markBroken() is called", ->
                error = new Error 'error!'
                @subject = AutostopManager.markBroken.bind null, @fixture, error

            it "It should not throw", ->
                @subject.should.not.throw()

            it "And application's document should be updated", ->
                @fixture.state.should.equal 'broken'
                @fixture.errormsg.should.equal 'error!'
                should.not.exist @fixture.password


        describe "Error case (non regression)", ->

            before ->
                @sandbox = sinon.sandbox.create()
                @fixture = getFixture()
                stub = @sandbox.stub @fixture, 'updateAttributes'
                stub.callsArgWithAsync 1, 'some error'

            after -> @sandbox.restore()

            it "When .markBroken() is called", ->
                error = new Error 'error!'
                @subject = AutostopManager.markBroken.bind null, @fixture, error

            it "It should not throw", ->
                @subject.should.not.throw()

            it "And application's document should not be updated", ->
                @fixture.state.should.equal 'installed'
                @fixture.errormsg.should.equal ''
                should.exist @fixture.password


    describe ".stopApp()", ->

        describe "Success case", ->

            before ->
                @sandbox = sinon.sandbox.create()

                @stopApp = @sandbox.stub AppManager.prototype, 'stop'
                @stopApp.callsArgWithAsync 1, null

                @resetProxy = @sandbox.stub AppManager.prototype, 'resetProxy'
                @resetProxy.callsArgWithAsync 0, null

                @fixture = getFixture()
                @sandbox.stub @fixture, 'updateAttributes', (data, callback) =>
                    @fixture[field] = value for field, value of data
                    callback()

            after -> @sandbox.restore()

            it "When .peut-stopApp() is called", ->
                AutostopManager.stopApp @fixture

            it "The AppManager should stop the application", ->
                @stopApp.callCount.should.equal 1
                @stopApp.getCall(0).calledWith(@fixture).should.be.ok

            it "And the application's document should be updated", ->
                @fixture.state.should.equal "stopped"
                @fixture.port.should.equal 0

            it "And the proxy should be reset", ->
                @resetProxy.callCount.should.equal 1

        describe "Error case - the AppManager triggers an error", ->

            before ->
                @sandbox = sinon.sandbox.create()

                @stopApp = @sandbox.stub AppManager.prototype, 'stop'
                @stopApp.callsArgWithAsync 1, 'unexpected error'

                @resetProxy = @sandbox.stub AppManager.prototype, 'resetProxy'
                @resetProxy.callsArgWithAsync 0, null

                @markBroken = @sandbox.stub AutostopManager, 'markBroken'

                @fixture = getFixture()
                @sandbox.stub @fixture, 'updateAttributes', (data, callback) =>
                    @fixture[field] = value for field, value of data
                    callback()

            after -> @sandbox.restore()

            it "When .stopApp() is called", ->
                AutostopManager.stopApp @fixture

            it "The AppManager should be called", ->
                @stopApp.callCount.should.equal 1
                @stopApp.getCall(0).calledWith(@fixture).should.be.ok

            it "And the proxy should not be reset", ->
                @resetProxy.callCount.should.equal 0

            it "And the application should be marked as broken", ->
                @markBroken.callCount.should.equal 1
                @markBroken.getCall(0).calledWithExactly(@fixture, 'unexpected error').should.be.ok

        describe "Error case - the Proxy triggers an error", ->

            before ->
                @sandbox = sinon.sandbox.create()

                @stopApp = @sandbox.stub AppManager.prototype, 'stop'
                @stopApp.callsArgWithAsync 1

                @resetProxy = @sandbox.stub AppManager.prototype, 'resetProxy'
                @resetProxy.callsArgWithAsync 0, 'unexpected error'

                @markBroken = @sandbox.stub AutostopManager, 'markBroken'

                @fixture = getFixture()
                @sandbox.stub @fixture, 'updateAttributes', (data, callback) =>
                    @fixture[field] = value for field, value of data
                    callback()

            after -> @sandbox.restore()

            it "When .stopApp() is called", ->
                AutostopManager.stopApp @fixture

            it "The AppManager should stop the application", ->
                @stopApp.callCount.should.equal 1
                @stopApp.getCall(0).calledWith(@fixture).should.be.ok

            it "And the Proxy should be called", ->
                @resetProxy.callCount.should.equal 1

            it "And the application should be marked as broken", ->
                @markBroken.callCount.should.equal 1
                @markBroken.getCall(0).calledWithExactly(@fixture, 'unexpected error').should.be.ok

        describe "Error case - the document is not updated (non regression)", ->
            before ->
                @sandbox = sinon.sandbox.create()

                @stopApp = @sandbox.stub AppManager.prototype, 'stop'
                @stopApp.callsArgWithAsync 1, null

                @resetProxy = @sandbox.stub AppManager.prototype, 'resetProxy'
                @resetProxy.callsArgWithAsync 0, null

                @markBroken = @sandbox.stub AutostopManager, 'markBroken'

                @fixture = getFixture()
                update = @sandbox.stub @fixture, 'updateAttributes'
                update.callsArgWithAsync 1, 'unexpected error'

            after -> @sandbox.restore()

            it "When .peut-stopApp() is called", ->
                AutostopManager.stopApp @fixture

            it "The AppManager should stop the application", ->
                @stopApp.callCount.should.equal 1
                @stopApp.getCall(0).calledWith(@fixture).should.be.ok

            it "And the proxy should not be reset", ->
                @resetProxy.callCount.should.equal 0

            it "And the application should be marked as broken", ->
                @markBroken.callCount.should.equal 1
                @markBroken.getCall(0).calledWithExactly(@fixture, 'unexpected error').should.be.ok


    describe ".startTimetout()", ->

        describe "The application is auto-stoppable", ->

            before ->
                @sandbox = sinon.sandbox.create useFakeTimers: true
                @fixture = getFixture()
                stub = @sandbox.stub Application, 'all'
                stub.callsArgWithAsync 1, null, [@fixture]

                @stopApp = @sandbox.stub AutostopManager, 'stopApp'

            after -> @sandbox.restore()

            it "When .startTimeout() is called", ->
                AutostopManager.startTimeout 'test'

            it "Then after 4 minutes", ->
                @sandbox.clock.tick 4 * minute

            it "It should still be running", ->
                @stopApp.callCount.should.equal 0

            it "Then after one more minute", ->
                @sandbox.clock.tick 1 * minute

            it "It should be stopped", ->
                @stopApp.callCount.should.equal 1
                @stopApp.getCall(0).calledWithExactly(@fixture).should.be.ok

        describe "The application is not auto-stoppable", ->

            before ->
                @sandbox = sinon.sandbox.create useFakeTimers: true

                fixture = getFixture()
                fixture.isStoppable = false
                stub = @sandbox.stub Application, 'all'
                stub.callsArgWithAsync 1, null, [fixture]

                @stopApp = @sandbox.stub AutostopManager, 'stopApp'

            after -> @sandbox.restore()

            it "When .startTimeout() is called", ->
                AutostopManager.startTimeout 'test'

            it "Then after 5 minutes", ->
                @sandbox.clock.tick 5 * minute

            it "Nothing should have been done", ->
                @stopApp.callCount.should.equal 0

        describe "The application is not running", ->

            before ->
                @sandbox = sinon.sandbox.create useFakeTimers: true

                fixture = getFixture()
                fixture.state = 'stopped'
                stub = @sandbox.stub Application, 'all'
                stub.callsArgWithAsync 1, null, [fixture]

                @stopApp = @sandbox.stub AutostopManager, 'stopApp'

            after -> @sandbox.restore()

            it "When .startTimeout() is called", ->
                AutostopManager.startTimeout 'test'

            it "Then after 5 minutes", ->
                @sandbox.clock.tick 5 * minute

            it "Nothing should have been done", ->
                @stopApp.callCount.should.equal 0

        describe "The application is Home", ->

            before ->
                @sandbox = sinon.sandbox.create useFakeTimers: true

                fixture = getFixture()
                fixture.slug = 'fixture'
                stub = @sandbox.stub Application, 'all'
                stub.callsArgWithAsync 1, null, [fixture]

                @stopApp = @sandbox.stub AutostopManager, 'stopApp'

            after -> @sandbox.restore()

            it "When .startTimeout is called", ->
                AutostopManager.startTimeout 'home'

            it "Then after 5 minutes", ->
                @sandbox.clock.tick 5 * minute

            it "Nothing should have been done", ->
                @stopApp.callCount.should.equal 0

        describe "The application is Proxy", ->

            before ->
                @sandbox = sinon.sandbox.create useFakeTimers: true

                fixture = getFixture()
                fixture.slug = 'proxy'
                stub = @sandbox.stub Application, 'all'
                stub.callsArgWithAsync 1, null, [fixture]

                @stopApp = @sandbox.stub AutostopManager, 'stopApp'

            after -> @sandbox.restore()

            it "When .startTimeout is called", ->
                AutostopManager.startTimeout 'proxy'

            it "Then after 5 minutes", ->
                @sandbox.clock.tick 5 * minute

            it "Nothing should have been done", ->
                @stopApp.callCount.should.equal 0

    describe ".restartTimeout()", ->

        describe "The application has a timeout running", ->

            before ->
                @sandbox = sinon.sandbox.create useFakeTimers: true

                @fixture = getFixture()
                @sandbox
                    .stub Application, 'all'
                    .callsArgWithAsync 1, null, [@fixture]

                @stopApp = @sandbox.stub AutostopManager, 'stopApp'

            after -> @sandbox.restore()

            it "When the application has a timeout running", ->
                AutostopManager.startTimeout 'test'

            it "Then after 3 minutes", ->
                @sandbox.clock.tick 3 * minute

            it "It should still be running", ->
                @stopApp.callCount.should.equal 0

            it "When .restartTimeout() is called", ->
                AutostopManager.restartTimeout 'test'

            it "Then after 4 minutes", ->
                @sandbox.clock.tick 4 * minute

            it "It should still be running", ->
                @stopApp.callCount.should.equal 0

            it "Then after one more minute", ->
                @sandbox.clock.tick 100 * minute

            it "It should be stopped", ->
                @stopApp.callCount.should.equal 1
                @stopApp.getCall(0).calledWithExactly(@fixture).should.be.ok

        describe "The application doesn't have a timeout running", ->

            before ->
                @sandbox = sinon.sandbox.create useFakeTimers: true

                @fixture = getFixture()
                @sandbox
                    .stub Application, 'all'
                    .callsArgWithAsync 1, null, [@fixture]

                @stopApp = @sandbox.stub AutostopManager, 'stopApp'

            after -> @sandbox.restore()

            it "When .restartTimeout() is called", ->
                AutostopManager.restartTimeout 'test'

            it "Then after 4 minutes", ->
                @sandbox.clock.tick 4 * minute

            it "It should still be running", ->
                @stopApp.callCount.should.equal 0

            it "Then after one more minute", ->
                @sandbox.clock.tick 100 * minute

            it "It should be stopped", ->
                @stopApp.callCount.should.equal 1
                @stopApp.getCall(0).calledWithExactly(@fixture).should.be.ok

    describe ".init()", ->

        before ->
            @sandbox = sinon.sandbox.create()
            @fixture1 = getFixture()
            @fixture2 = getFixture()
            @fixture3 = getFixture()
            @fixture4 = getFixture()
            @fixture2.slug = 'test2'
            @fixture3.slug = 'test3'
            @fixture3.isStoppable = false
            @fixture4.slug = 'test4'
            @fixture4.state = 'stopped'

            @sandbox
                .stub Application, 'all'
                .callsArgWithAsync 0, null, [@fixture1, @fixture2, @fixture3, @fixture4]

            @startTimeout = @sandbox.stub AutostopManager, 'startTimeout'

        after -> @sandbox.restore()

        it "When .init() is called", (done) ->
            AutostopManager.init done

        it "Then all auto-stoppable running applications should have a timeout running", ->
            @startTimeout.callCount.should.equal 2


    describe "Functional test", ->

        before helpers.setup TESTPORT
        before helpers.createUser 'test@cozycloud.cc', 'testtest'

        #initiate fake servers
        before ->
            @controller = helpers.fakeServer { drone: { port: 8001 } }, 200
            @controller.listen 9002
            @proxy = helpers.fakeServer msg: "ok", 200
            @proxy.listen 9104

        before ->
            @client = helpers.getClient TESTPORT, @
            @sandbox = sinon.sandbox.create useFakeTimers: true

        after -> @sandbox.restore()
        after ->
            @controller.close()
            @proxy.close()
        after helpers.takeDown

        it "When I start an auto-stoppable application", (done) ->
            creator = helpers.createApp "Test App", "test-app", 0, "installed"
            creator done

        it "Then I wait for 4 minutes", ->
            @sandbox.clock.tick 4 * minute

        it "Then it should still be running", (done) ->
            Application.all key: 'test-app', (err, apps) ->
                should.not.exist err
                should.exist apps
                apps[0].state.should.equal 'installed'
                done()

        it "Then the application does a request to the Data System", (done) ->
            ds = new Client "http://localhost:9101/"
            ds.setBasicAuth 'test-app', 'test-app'
            data =
                docType: 'Event'
                description: 'blablabla'
            ds.post 'data/', data, (err, res, body) ->
                done()

        it "Then I wait for 4 minutes", ->
            @sandbox.clock.tick 4 * minute

        it "Then it should still be running", ->
            Application.all key: 'test-app', (err, apps) ->
                should.not.exist err
                should.exist apps
                apps[0].state.should.equal 'installed'

        it "Then I wait for one more minute", ->
            @sandbox.clock.tick 2 * minute
            @sandbox.clock.restore()

        it "Then after a while", (done) ->
            @timeout 4500
            setTimeout done, 4000

        it "Then the application should be stopped", (done) ->
            Application.all key: 'test-app', (err, apps) ->
                should.not.exist err
                should.exist apps
                apps[0].state.should.equal 'stopped'
                done()
