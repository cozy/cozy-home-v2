bcrypt = require 'bcrypt'
should = require('chai').Should()
Client = require('request-json').JsonClient
app = require '../server'
helpers = require './helpers'

email = 'test@test.com'
password = 'password'

client = new Client 'http://localhost:8889/'

# Initializers 


describe 'Modify account failure', ->

    before (done) ->
        app.listen 8889
        helpers.clearDb ->
            User.create
                email: email
                password: password
                , ->
                    done()

    after (done) ->
        app.close()
        done()

    it 'When I change my account with a wrong string as email', (done) ->
        data = email: 'wrongemail'
        client.post 'api/user', data, (error, response, body) =>
            @response = response
            @body = body
            done()

    it 'Then an error response is returned.', ->
        @response.statusCode.should.equal 400
        @body.error.should.equal true

    it 'When I send a register request with a too short password', (done) ->
        data = password1: 'pas'
        client.post 'api/user', data, (error, response, body) =>
            @response = response
            @body = body
            done()

    it 'Then an error response is returned.', ->
        @response.statusCode.should.equal 400

    it 'When I send a register request with two different passwords', (done) ->
        data = password1: 'password', password2: 'blabla'
        client.post 'api/user', data, (error, response, body) =>
            @response = response
            @body = body
            done()

    it 'Then an error response is returned.', ->
        @response.statusCode.should.equal 400


describe 'Modify account success', ->
    
    before (done) ->
        app.listen 8889
        helpers.clearDb ->
            User.create
                email: email
                password: password
                , ->
                    done()

    after (done) ->
        app.close()
        done()


    it 'When I change my account with right data', (done) ->
        data =
            email: 'test@test.fr'
            password1: 'password2'
            password2: 'password2'
        client.post 'api/user', data, (error, response, body) =>
            @response = response
            @body = body
            done()

    it 'Then success response is returned.', ->
        @response.statusCode.should.equal 200


    it 'And user data should be updated', (done) ->
        User.all (err, users) ->
            user = users[0]
            user.email.should.equal 'test@test.fr'
            bcrypt.compare 'password2', user.password,  (err, res) ->
                res.should.be.ok
                done()


describe 'Modify domain success', ->
 
    before ->
        app.listen 8889

    after ->
        app.close()

    it 'When I change my domain', (done) ->
        data = domain: 'domain.new'
        client.post 'api/instance', data, (err, res, body) =>
            @response = res
            done()

    it 'Then success response is returned.', ->
        @response.statusCode.should.equal 200

    it 'And instance data should be updated', (done) ->
        client.get 'api/instances', (err, res, instances) ->
            instance = instances.rows[0]
            instance.domain.should.equal 'domain.new'
            done()

    it 'When I change my domain again', (done) ->
        data = domain: 'domain.newnew'
        client.post 'api/instance', data, (err, res, body) =>
            @response = res
            done()

    it 'Then instance data should be updated', (done) ->
        client.get 'api/instances', (err, res, instances) ->
            instance = instances.rows[0]
            instance.domain.should.equal 'domain.newnew'
            done()


