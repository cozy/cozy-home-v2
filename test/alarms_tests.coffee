time = require 'time'
should = require('chai').Should()
helpers = require './helpers'

Alarm = require "#{helpers.prefix}server/models/alarm"

TESTPORT = 8889
TESTMAIL = 'test@test.com'
TESTPASS = 'password'

describe 'Alarm manager handles alarms', ->

    before helpers.createUser TESTMAIL, TESTPASS
    before helpers.setup TESTPORT
    before ->
        @client = helpers.getClient TESTPORT, @
        @dataClient = helpers.getClient 9101, @

    before helpers.wait 2000
    before ->
        @counter = 0
        # console.log @app
        @noConflictHN = @app.alarmManager.handleNotification
        @app.alarmManager.handleNotification = =>
            @counter = @counter + 1
    after ->
        @app.alarmManager.handleNotification = @noConflictHN
    after helpers.takeDown


    it "When I create 3 Alarms", (done) ->

        now = new time.Date()
        oneDay = 24*60*60*1000

        alarm1 = new Alarm
            action: 'DISPLAY'
            trigg: new time.Date(now.getTime() + 2000)
            description: 'alarm1'

        alarm2 = new Alarm
            action: 'EMAIL'
            trigg: new time.Date(now.getTime() + 2500 - oneDay)
            rrule: 'FREQ=DAILY'
            description: 'alarm2'

        alarm3 = new Alarm
            action: 'BOTH'
            trigg: new time.Date(now.getTime() + 3000)
            description: 'alarm3'

        alarm1.save (err) ->
            return done err if err
            alarm2.save (err) ->
                return done err if err
                alarm3.save done


    it "Then I wait 5s", (done) ->
        @timeout 10000
        setTimeout done, 8000

    it "And handleNotification has been called 3 times", ->
        @counter.should.equal 3

