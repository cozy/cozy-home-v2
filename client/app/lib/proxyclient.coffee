request = require('lib/request')
exports.get = (url, callback) ->
    request.request('get', 'api/proxy', url, callback)