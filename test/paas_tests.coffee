should = require('chai').Should()
sinon = require 'sinon'
helpers = require './helpers'

{AppManager} = require "#{helpers.prefix}server/lib/paas"

fakeApp = {}

describe 'Paas', ->

    describe 'Blocking action (install, update, delete) queue', ->
        before ->
            @manager = new AppManager()
            @spies = []
            waiter = (app, callback) ->
                setTimeout callback, 1000
            @install = sinon.stub @manager, 'processInstall', waiter
            @update = sinon.stub @manager, 'processUpdate', waiter
            @uninstall = sinon.stub @manager, 'processUninstall', waiter

        it 'Queue should be empty', ->
            @manager.queue.length().should.equal 0

        it 'When I install two applications', ->
            # install the fake app
            spy = sinon.spy()
            @spies.push spy
            @manager.installApp fakeApp, spy

            # update the fake app
            spy = sinon.spy()
            @spies.push spy
            @manager.updateApp fakeApp, spy

            # uninstall the fake app
            spy = sinon.spy()
            @spies.push spy
            @manager.uninstallApp fakeApp, spy

        it 'Only "processInstall" should be called', ->
            @install.called.should.be.ok
            @update.called.should.not.be.ok
            @uninstall.called.should.not.be.ok
            @manager.queue.length().should.equal 2
            @manager.queue.running().should.equal 1

        it "And callbacks should not be called", ->
            @spies[0].called.should.not.be.ok
            @spies[1].called.should.not.be.ok
            @spies[2].called.should.not.be.ok

        it "Then I wait for 1s", (done) ->
            @timeout 1500
            setTimeout done, 1000

        it "And installApp's callback should be called", ->
            @spies[0].called.should.be.ok

        it 'And "updateApp" should be called', ->
            @update.called.should.be.ok
            @uninstall.called.should.not.be.ok
            @manager.queue.length().should.equal 1
            @manager.queue.running().should.equal 1

        it "And callbacks should not be called", ->
            @spies[1].called.should.not.be.ok
            @spies[2].called.should.not.be.ok

        it "Then I wait for 1s", (done) ->
            @timeout 1500
            setTimeout done, 1000

        it "And updateApp's callback should be called", ->
            @spies[1].called.should.be.ok

        it 'And "uninstallApp" should be called', ->
            @uninstall.called.should.be.ok
            @manager.queue.length().should.equal 0
            @manager.queue.running().should.equal 1

        it "And callback should not be called", ->
            @spies[2].called.should.not.be.ok

        it "Then I wait for 1s", (done) ->
            @timeout 1500
            setTimeout done, 1000

        it "And uninstallApp's callback should be called", ->
            @spies[2].called.should.be.ok
