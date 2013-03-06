Client = require("request-json").JsonClient

client = new Client "http://localhost:9101/"


module.exports = class Adapter

    updateKeys: (pwd, callback) ->
        client.put "accounts/password/", password: pwd, (err, res, body) =>
            if err
                callback err
            else
                callback()