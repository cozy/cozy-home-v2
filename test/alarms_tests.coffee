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
        date = new time.Date now.getTime() + 2000, 'America/Bogota'
        date.setTimezone 'UTC'
        alarm1 = new Alarm
            action: 'DISPLAY'
            trigg: date.toString().slice(0, 24)
            description: 'alarm1'
            timezone: 'America/Bogota'

        date = new time.Date now.getTime() + 2500 - oneDay, 'Europe/Paris'
        date.setTimezone 'UTC'
        alarm2 = new Alarm
            action: 'EMAIL'
            trigg: date.toString().slice(0, 24)
            rrule: 'FREQ=DAILY'
            description: 'alarm2'
            timezone: 'Europe/Paris'

        date = new time.Date now.getTime() + 3000, 'Europe/Paris'
        date.setTimezone 'UTC'
        alarm3 = new Alarm
            action: 'BOTH'
            trigg: date.toString().slice(0, 24)
            description: 'alarm3'
            timezone: 'Europe/Paris'

        alarm1.save (err) ->
            return done err if err
            alarm2.save (err) ->
                return done err if err
                alarm3.save done


    it "Then I wait 20s", (done) ->
        @timeout 22000
        setTimeout done, 20 * 1000

    it "And handleNotification has been called 3 times", ->
        @counter.should.equal 3

