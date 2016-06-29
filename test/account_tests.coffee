bcrypt = require 'bcrypt'
should = require('chai').Should()
helpers = require './helpers'

User = require "#{helpers.prefix}server/models/user"

TESTPORT = 8889
TESTMAIL = 'test@test.com'
TESTPASS = 'password'
TESTOTPKEY = '8b234fb156f8d39555ea0a7538db878b0d1357cc'
TESTOTPTOKEN = 'HBRDEMZUMZRDCNJWMY4GIMZZGU2TKZLBGBQTONJTHBSGEOBXHBRDAZBRGM2TOY3D'
TESTRECOVERYTOKENS = [
    24383427
    94122669
    66187413
    95999368
    955875
    34514463
    94504055
    61096172
    93430255
    63856009
]

describe 'Modify account failure', ->

    before helpers.createUser TESTMAIL, TESTPASS
    before helpers.setup TESTPORT
    before ->
        @client = helpers.getClient TESTPORT, @
        @dataClient = helpers.getClient 9101, @

    after helpers.takeDown

    it "When I send a request to log in", (done) ->
        @dataClient.post 'accounts/password/', password: TESTPASS , done

    it "And I disconnected user", (done) ->
        @dataClient.del "accounts/", done

    it 'And I try to change my password with user disconnected', (done) ->
        data =
            email: 'test@test.fr'
            password0: TESTPASS
            password1: 'password2'
            password2: 'password2'
        @client.post 'api/user', data, done

    it 'Then error response is returned.', ->
        @response.statusCode.should.equal 400

    it "When I send a request to log in", (done) ->
        data =
            password: TESTPASS
        @dataClient.post 'accounts/password/', password: TESTPASS , done

    it 'And I change my account with a wrong string as email', (done) ->
        data = email: 'wrongemail'
        @client.post 'api/user', data, done

    it 'Then an error response is returned.', ->
        @response.statusCode.should.equal 400
        # @body.error.length.should.equal 1

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

    before helpers.setup TESTPORT
    before helpers.createUser TESTMAIL, TESTPASS
    before ->
        @client = helpers.getClient TESTPORT, @
        @dataClient = helpers.getClient 9101, @

    after helpers.takeDown

    it 'When I change my account with right data', (done) ->
        data =
            email: 'test@test.fr'
            password0: TESTPASS
            password1: 'password2'
            password2: 'password2'
        @client.post 'api/user', data, done

    it 'Then success response should be returned.', ->
        @response.statusCode.should.equal 200

    it 'And user data should be updated', (done) ->
        User.all (err, users) ->
            should.not.exist err
            should.exist users
            user = users[0]
            user.email.should.equal 'test@test.fr'
            bcrypt.compare 'password2', user.password,  (err, res) ->
                res.should.be.ok
                done()


#describe 'Modify domain success', ->

    #after ->
        #@app.server.close()

    #it 'When I change my domain', (done) ->
        #@client.post 'api/instance', domain: 'domain.new', done

    #it 'Then success response is returned.', ->
        #@response.statusCode.should.equal 200

    #it 'When I retrieve instace data', (done) ->
        #@client.get 'api/instances', done

    #it 'it have beeen updated', ->
        #@body.should.have.property('rows').with.length 1
        #@body.rows[0].domain.should.equal 'domain.new'

    #it 'When I change my domain again', (done) ->
        #@client.post 'api/instance', domain: 'domain.newnew', done

    #it 'When I retrieve instace data', (done) ->
        #@client.get 'api/instances', done

    #it 'it have beeen updated', ->
        #@body.should.have.property('rows').with.length 1
        #@body.rows[0].domain.should.equal 'domain.newnew'


describe 'Modify 2FA settings', ->

    before helpers.setup TESTPORT
    before helpers.createUser TESTMAIL, TESTPASS
    before ->
        @client = helpers.getClient TESTPORT, @
        @dataClient = helpers.getClient 9101, @

    after helpers.takeDown

    it "When I send a request to log in", (done) ->
        @dataClient.post 'accounts/password/', password: TESTPASS , done


    it 'When I enable 2FA', (done) ->
        data =
            authType: 'hotp'
            encryptedOtpKey: TESTOTPKEY
            hotpCounter: 42
        @client.post 'api/user', data, done

    it 'Then success response should be returned', ->
        @response.statusCode.should.equal 200

    it 'And the fields should be correctly set', (done) ->
        User.all (err, users) ->
            should.not.exist err
            should.exist users
            user = users[0]
            user.authType.should.equal 'hotp'
            user.encryptedOtpKey.should.equal TESTOTPKEY
            user.hotpCounter.should.equal 42
            done()

    it 'When I request the OTP token', (done) ->
        @client.get 'api/user/2fa', done

    it 'Then success response should be returned', ->
        @response.statusCode.should.equal 200

    it 'And the right token should be returned', ->
        @body.should.have.property 'token'
        @body.token.should.equal TESTOTPTOKEN

    it 'When I reset the HOTP token', (done) ->
        data =
            authType: 'hotp'
            hotpCounter: 0
        @client.post 'api/user', data, done

    it 'Then success response should be returned', ->
        @response.statusCode.should.equal 200

    it 'And the counter is set to 0', (done) ->
        User.all (err, users) ->
            should.not.exist err
            should.exist users
            user = users[0]
            user.hotpCounter.should.equal 0
            done()

    it 'When I set 2FA recovery tokens', (done) ->
        data =
            recoveryCodes: TESTRECOVERYTOKENS
        @client.post 'api/user', data, done

    it 'Then success response should be returned', ->
        @response.statusCode.should.equal 200

    it 'And the recovery tokens are correctly set', (done) ->
        User.all (err, users) ->
            should.not.exist err
            should.exist users
            user = users[0]
            str = user.encryptedRecoveryCodes
            str.should.equal JSON.stringify TESTRECOVERYTOKENS
            done()

    it 'When I disable 2FA', (done) ->
        data =
            authType: null
        @client.post 'api/user', data, done

    it 'Then success response should be returned', ->
        @response.statusCode.should.equal 200

    it 'And 2FA is disabled', (done) ->
        User.all (err, users) ->
            should.not.exist err
            should.exist users
            user = users[0]
            (user.authType is undefined).should.be.true
            done()
