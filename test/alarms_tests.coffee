should = require('chai').Should()
sinon = require 'sinon'
moment = require 'moment-timezone'
helpers = require './helpers'

Alarm = require "#{helpers.prefix}server/models/alarm"
Event = require "#{helpers.prefix}server/models/event"
NotificationsHelper = require 'cozy-notifications-helper'
AlarmManager = require "#{helpers.prefix}server/lib/alarm_manager"

TESTPORT = 8889
TESTMAIL = 'test@test.com'
TESTPASS = 'password'

DATE_UTC_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss.000[Z]'
DATE_ALLDAY_FORMAT = 'YYYY-MM-DD'

describe "Alarm manager handles event's alarms", ->

    before ->
        notifhelper = new NotificationsHelper 'home'
        @alarmManager = new AlarmManager
            timezone: 'Europe/Paris'
            notificationHelper: notifhelper

    before ->
        @sandbox = sinon.sandbox.create()
        @sandbox.useFakeTimers moment().unix(), 'setTimeout'
        @spy = @sandbox.spy @alarmManager, 'handleNotification'

    after -> @sandbox.restore()

    it "When I create two events", ->

        @now = moment().tz 'UTC'
        @startDate = moment(@now).add 1, 'days'
        endDate = moment(@startDate).add 1, 'hours'
        @punctualEvent = new Event
            _id: 1
            start: @startDate.format DATE_UTC_FORMAT
            end: endDate.format DATE_UTC_FORMAT
            place: ""
            details: ""
            description: "Client meeting"
            rrule: null
            tags: ["anniversaire"]
            attendees: []
            related: null
            alarms: [
                { id: 1, trigg: '-PT1H', action: 'DISPLAY' }
                { id: 2, trigg: '-PT15M', action: 'DISPLAY' }
            ]
            created: "2014-11-28T08:02:24.528Z"
            lastModification: "2014-11-28T09:11:43.476Z"

        @allDayEvent = new Event
            _id: 1
            start: @startDate.format DATE_ALLDAY_FORMAT
            end: endDate.format DATE_ALLDAY_FORMAT
            place: ""
            details: ""
            description: "Company team building day"
            rrule: null
            tags: ["anniversaire"]
            attendees: []
            related: null
            alarms: [
                { id: 1, trigg: '-PT10M', action: 'DISPLAY' }
            ]
            created: "2014-11-28T08:02:24.528Z"
            lastModification: "2014-11-28T09:11:43.476Z"

        @recurringEvent = new Event
            _id: 1
            start: @startDate.format DATE_UTC_FORMAT
            end: endDate.format DATE_UTC_FORMAT
            place: ""
            details: ""
            description: "Friend's birthday"
            rrule: null
            tags: ["anniversaire"]
            attendees: []
            related: null
            alarms: [
                { id: 1, trigg: '-PT5M', action: 'DISPLAY' }
            ]
            created: "2014-11-28T08:02:24.528Z"
            lastModification: "2014-11-28T09:11:43.476Z"

        @alarmManager.addEventCounters @punctualEvent
        @alarmManager.addEventCounters @allDayEvent
        @alarmManager.addEventCounters @recurringEvent

    it "handleNotification shouldn't have been called", ->
        @spy.callCount.should.equal 0

    it "Then I wait until the end of the day minus 10 minutes", ->
        dateWanted = moment(@startDate).startOf('day').subtract 10, 'minutes'
        timeToTick = dateWanted.valueOf() - @now.valueOf()
        @sandbox.clock.tick timeToTick
        @timeTicked = timeToTick

    it "And handleNotification has been called once with all day event's alarm", ->
        @spy.callCount.should.equal 1
        alarm = @spy.firstCall.args[0]
        should.exist alarm
        alarm.description.should.equal @allDayEvent.description

    it "Then I wait for 1 day minus 1 hour", ->
        # rewinds time to ease calculation
        @sandbox.clock.tick -@timeTicked

        dateWanted = moment(@startDate).subtract 1, 'hours'
        timeToTick = dateWanted.valueOf() - @now.valueOf()
        @sandbox.clock.tick timeToTick

    it "And handleNotification should have been called once with the 1st event's alarm", ->
        @spy.callCount.should.equal 2
        alarm = @spy.secondCall.args[0]
        should.exist alarm
        alarm.description.should.equal @punctualEvent.description

    it "Then I wait 45 more minutes", ->
        @sandbox.clock.tick 45 * 60 * 1000

    it "And handleNotification has been called a second time with the 2nd 1st event's alarm", ->
        @spy.callCount.should.equal 3
        alarm = @spy.thirdCall.args[0]
        should.exist alarm
        alarm.description.should.equal @punctualEvent.description

    it "Then I wait for 10 minutes", ->
        @sandbox.clock.tick 10 * 60 * 10000

    it "And handleNotification has been called a fourth time with the recurring event's alarm", ->
        @spy.callCount.should.equal 4
        alarm = @spy.getCall(3).args[0]
        should.exist alarm
        alarm.description.should.equal @recurringEvent.description
