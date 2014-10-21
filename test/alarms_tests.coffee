should = require('chai').Should()
sinon = require 'sinon'
moment = require 'moment-timezone'
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
        @sandbox = sinon.sandbox.create()
        @sandbox.useFakeTimers moment().unix(), 'setTimeout'
        @spy = @sandbox.spy @app.alarmManager, 'handleNotification'

    after -> @sandbox.restore()

    after helpers.takeDown


    it "When I create 3 Alarms", (done) ->

        now = moment().tz 'UTC'

        date = moment(now).add 5, 's'
        @alarm1 = new Alarm
            action: 'DISPLAY'
            trigg: date.format()
            description: 'alarm1'
            timezone: 'Europe/Moscow'

        date = moment(now).subtract 1, 'd'
        @alarm2 = new Alarm
            action: 'EMAIL'
            trigg: date.format()
            rrule: 'FREQ=DAILY'
            description: 'alarm2'
            timezone: 'Europe/Paris'

        date = moment(now).add 10, 's'
        @alarm3 = new Alarm
            action: 'BOTH'
            trigg: date.format()
            description: 'alarm3'
            timezone: 'Europe/Paris'

        @alarm1.save (err) =>
            return done err if err
            @alarm2.save (err) =>
                return done err if err
                @alarm3.save done

    it "handleNotification shouldn't have been called", ->
        @spy.callCount.should.equal 0

    it "Then I wait for 6s", ->
        @sandbox.clock.tick 6000

    it "And handleNotification should have been called once with the 1st alarm", ->
        @spy.callCount.should.equal 1
        alarm = @spy.firstCall.args[0]
        should.exist alarm
        alarm.description.should.equal @alarm1.description

    it "Then I wait 15 more second", ->
        @sandbox.clock.tick 15000

    it "And handleNotification has been called a second time with the 3rd alarm", ->
        @spy.callCount.should.equal 2
        alarm = @spy.secondCall.args[0]
        should.exist alarm
        alarm.description.should.equal @alarm3.description

