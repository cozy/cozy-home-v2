should = require 'should'
sinon = require 'sinon'

helpers = require './helpers'

checkUpdates = require "#{helpers.prefix}server/initializers/updates"
Application = require "#{helpers.prefix}server/models/application"
StackApplication = require "#{helpers.prefix}server/models/stack_application"
Notification = require "#{helpers.prefix}server/models/notification"
localizationManager = require "#{helpers.prefix}server/lib/localization_manager"

describe 'Update notifications', ->

    describe 'Update notifications should be unique for a given app', ->

        before ->
            @sandbox = sinon.sandbox.create()
            application = new Application
                name: 'RandomApp'
                slug: 'randomapp'
            @sandbox.stub application, 'checkForUpdate', (callback) ->
                callback null, true
            @sandbox.stub Application, 'all', (callback) ->
                callback null, [application]
            @sandbox.stub StackApplication, 'all', (callback) ->
                callback null, []

            @sandbox.stub localizationManager, 't', ->
                return 'localized message'

        after -> @sandbox.restore()

        it 'Given there is an update notification for an app', (done) ->
            @timeout 3000
            checkUpdates()
            setTimeout ->
                Notification.all (err, notifications) ->
                    should.not.exist err
                    should.exist notifications
                    notifications.length.should.equal 1
                    done()
            , 2000

        it 'When the update check is done again', (done) ->
            @timeout 2500
            checkUpdates()
            setTimeout done, 2000

        it 'Then there should be only one notification for that app', (done) ->
            Notification.all (err, notifications) ->
                should.not.exist err
                should.exist notifications
                notifications.length.should.equal 1
                done()
