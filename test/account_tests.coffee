bcrypt = require 'bcrypt'
should = require('chai').Should()
compoundInitiator = require '../server'
helpers = require './helpers'

TESTPORT = 8889
TESTMAIL = 'test@test.com'
TESTPASS = 'password'

describe 'Modify account failure', ->

    before helpers.init compoundInitiator
    before helpers.clearDb
    before helpers.createUser TESTMAIL, TESTPASS
    before ->
        @app.listen TESTPORT
        @client = helpers.getClient TESTPORT, @

    it 'When I change my account with a wrong string as email', (done) ->
        data = email: 'wrongemail'
        @client.post 'api/user', data, done

    it 'Then an error response is returned.', ->
        @response.statusCode.should.equal 400
        @body.error.should.equal true

    it 'When I send a register request with wrong old password', (done) ->
        data =
            password0: 'not-password'
            password1: 'pas'
        @client.post 'api/user', data, done

    it 'Then an error response is returned.', ->
        @response.statusCode.should.equal 400

    it 'When I send a register request with a too short password', (done) ->
        data =
            password0: TESTPASS
            password1: 'pas'
        @client.post 'api/user', data, done

    it 'Then an error response is returned.', ->
        @response.statusCode.should.equal 400

    it 'When I send a register request with two different passwords', (done) ->
        data =
            password0: TESTPASS
            password1: 'tatata',
            password2: 'tototo'
        @client.post 'api/user', data, done

    it 'Then an error response is returned.', ->
        @response.statusCode.should.equal 400


describe 'Modify account success', ->

    it 'When I change my account with right data', (done) ->
        data =
            email: 'test@test.fr'
            password0: TESTPASS
            password1: 'password2'
            password2: 'password2'
        @client.post 'api/user', data, done

    it 'Then success response is returned.', ->
        @response.statusCode.should.equal 200


    it 'And user data should be updated', (done) ->
        @app.compound.models.User.all (err, users) ->
            user = users[0]
            user.email.should.equal 'test@test.fr'
            bcrypt.compare 'password2', user.password,  (err, res) ->
                res.should.be.ok
                done()


describe 'Modify domain success', ->

    after ->
        @app.compound.server.close()

    it 'When I change my domain', (done) ->
        @client.post 'api/instance', domain: 'domain.new', done

    it 'Then success response is returned.', ->
        @response.statusCode.should.equal 200

    it 'When I retrieve instace data', (done) ->
        @client.get 'api/instances', done

    it 'it have beeen updated', ->
        @body.should.have.property('rows').with.length 1
        @body.rows[0].domain.should.equal 'domain.new'

    it 'When I change my domain again', (done) ->
        @client.post 'api/instance', domain: 'domain.newnew', done

    it 'When I retrieve instace data', (done) ->
        @client.get 'api/instances', done

    it 'it have beeen updated', ->
        @body.should.have.property('rows').with.length 1
        @body.rows[0].domain.should.equal 'domain.newnew'
