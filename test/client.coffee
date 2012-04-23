request = require('request')

host = "http://localhost:3000/"

exports.get = (path, callback) ->
    request
        method: "GET"
        uri: host + path
        , callback

exports.post = (path, json, callback) ->
    request
        method: "POST"
        uri: host + path
        json: json
        , callback

exports.put = (path, json, callback) ->
    request
        method: "PUT"
        uri: host + path
        json: json
        , callback

exports.delete = (path, callback) ->
    request
        method: "DELETE"
        uri: host + path
        , callback

