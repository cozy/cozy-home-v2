should = require('chai').Should()
Client = require('request-json').JsonClient
app = require('../server')

client = new Client("http://localhost:8888/")

describe "Get sys data", ->

    before ->
        app.listen(8888)

    after ->
        app.close()

    it "When I load sys data", (done) ->
        client.get "api/sys-data", (error, response, body) =>
            @response = response
            @body = body
            done()

    it "Then I have no error", ->
        @response.statusCode.should.equal 200
        
    it "And body should contain disk and ram infos", ->
        console.log @body
        
        should.exist @body.freeMem
        should.exist @body.totalMem
        should.exist @body.freeDiskSpace
        should.exist @body.totalDiskSpace
