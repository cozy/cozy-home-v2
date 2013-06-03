Client = require("request-json").JsonClient

client = new Client "http://localhost:9101/"


module.exports = class Adapter

    updateKeys: (pwd, callback) ->
        if process.env.NODE_ENV is "production"
            name = process.env.name
            token = process.env.token
            client.setBasicAuth name, token
        client.put "accounts/password/", password: pwd, (err, res, body) =>
            if err
                callback err
            else
                callback()