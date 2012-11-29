Client = require('request-json').JsonClient

client = new Client 'http://localhost:9104/'

if process.env.NODE_ENV != "test"
    client.get 'routes/reset/', (err, res, body) ->
        if res.statusCode is 200
            console.info 'Proxy successfuly reseted.'
        else
            console.info 'Something went wrong while reseting proxy.'
