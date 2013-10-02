should = require('chai').Should()
compoundInitiator = require('../server')
helpers = require('./helpers')

TESTPORT = 8889

describe "Get sys data", ->

    before helpers.init TESTPORT
    before helpers.clearDb
    before ->
        @client = helpers.getClient TESTPORT, @

    after ->
        @app.server.close()

    after helpers.clearDb

    it "When I load sys data", (done) ->
        @client.get "api/sys-data", done

    it "Then I have no error", ->
        @response.statusCode.should.equal 200

    it "And body should contain disk and ram infos", ->
        should.exist @body.freeMem
        should.exist @body.totalMem
        should.exist @body.freeDiskSpace
        should.exist @body.totalDiskSpace
