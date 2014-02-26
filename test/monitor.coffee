should = require('chai').Should()
helpers = require './helpers'

TESTPORT = 8889

describe "Get sys data", ->

    before helpers.setup TESTPORT
    before -> @client = helpers.getClient TESTPORT, @
    after helpers.takeDown

    it "When I load sys data", (done) ->
        @client.get "api/sys-data", done

    it "Then I have no error", ->
        @response.statusCode.should.equal 200

    it "And body should contain disk and ram infos", ->
        should.exist @body.freeMem
        should.exist @body.totalMem
        should.exist @body.freeDiskSpace
        should.exist @body.totalDiskSpace
