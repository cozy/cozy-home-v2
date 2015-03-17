request = require('request')

# a simple proxy...
module.exports.get = (req, res) ->
    req.pipe(request(req.query.url)).pipe(res)
