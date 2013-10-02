should = require('chai').Should()
expect = require('chai').expect
helpers = require('./helpers')

TESTPORT = 8889

describe 'External Notification API', ->

    before helpers.clearDb
    before helpers.init TESTPORT
    before ->
        @client = helpers.getClient TESTPORT, @

    after ->
        @app.server.close()

    describe 'Temporary Notifications', ->

        notif1 =
            text: 'test'

        notif2 =
            text: 'test'
            url: '/apps/todos/#3615'

        notif3 =
            text: 'test'
            app: 'todos'
            url: '#3615'


        it "can create temporary notifications", (done) ->
            @client.post 'notifications', notif1, done

        it "Then I have no error", ->
            @response.statusCode.should.equal 201

        it "can create other notifications", (done) ->
            @client.post 'notifications', notif2, (err) =>
                return done err if err
                @client.post 'notifications', notif3, done

        it "should have created 3 notifications", (done) ->
            @client.get 'api/notifications', done

        it "with proper resources ", ->
            expect(@body).to.be.an 'array'
            expect(@body).to.have.length 3
            expect(@body[1]).to.have.deep.property 'resource.url', '/apps/todos/#3615'
            expect(@body[2]).to.have.deep.property 'resource.app', 'todos'
            expect(@body[2]).to.have.deep.property 'resource.url', '#3615'

    describe 'Persistent Notifications', ->

        it "can create persistent notifications", (done) ->
            @notif = text: 'test'
            @client.put 'notifications/mails/unreadcounter', @notif, done

        it "Then I have no error", ->
            @response.statusCode.should.equal 201

        it "When i GET notifications", (done) ->
            @client.get 'api/notifications', done

        it "Should have been created", ->
            expect(@body).to.have.length 4
            expect(@body[3].text).to.equal 'test'
            expect(@body[3]).to.have.deep.property 'resource.app', 'mails'
            expect(@body[3]).to.have.deep.property 'resource.url', '/'

        it "can update persistent notifications", (done) ->
            @notif.text = 'test2'
            @client.put 'notifications/mails/unreadcounter', @notif, done

        it "Then I have no error", ->
            @response.statusCode.should.equal 200

        it "When i GET notifications", (done) ->
            @client.get 'api/notifications', done

        it  "Should have been created", ->
            expect(@body).to.have.length 4
            expect(@body[3].text).to.equal 'test2'
            expect(@body[3]).to.have.deep.property 'resource.app', 'mails'
            expect(@body[3]).to.have.deep.property 'resource.url', '/'


describe 'Home Client Notification API', ->

    before helpers.init TESTPORT
    before ->
        @HKclient = helpers.getClient TESTPORT, @

    after ->
        @app.server.close()

    # all not tested because used above

    it "When i GET notifications", (done) ->
        @client.get 'api/notifications', done

    it "Should send me a list", ->
        expect(@body).to.be.an 'array'
        expect(@body).to.have.length 4
        @id = @body[0].id

    it "When I GET a specific notification", (done) ->
        @client.get "api/notifications/#{@id}", done

    it "Should send me one notification", ->
        expect(@body).to.have.property 'text'
        expect(@body).to.have.property 'id', @id

    it "When I DELETE a notification", (done) ->
        @client.del "api/notifications/#{@id}", done

    it "Should not throw", ->
        expect(@response).to.have.property 'statusCode', 204

    it "When I GET the deleted notification", (done) ->
        @client.get "api/notifications/#{@id}", done

    it  "I get 404", ->
        expect(@response).to.have.property 'statusCode', 404

