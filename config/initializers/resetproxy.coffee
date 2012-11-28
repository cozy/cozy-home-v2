Client = require('request-json').JsonClient

client = new Client 'http://localhost:9104/'

client.get 'routes/reset/', (err, res, body) ->
    if res.statusCode is 200
        console.log 'Proxy successfuly reseted.'
    else
        console.log 'Something went wrong while reseting proxy.'
