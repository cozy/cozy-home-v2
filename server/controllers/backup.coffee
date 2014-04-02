Client = require('request-json').JsonClient
RemoteCozy = require '../models/remotecozy'

module.exports.create = (req, res) ->
    targetUrl = req.body.targetUrl or null
    targetPassword = req.body.targetPassword or null

    if targetUrl? and targetPassword?
        target = new Client targetUrl
        params =
            login: 'cozy-backup'
            type: 'cozy'
        target.setBasicAuth 'owner', targetPassword
        target.post 'device/', params, (err, resp, body) ->
            err = err or body.error
            if err?
                status = resp?.statusCode or 500
                res.send status, error: true, msg: err
            else
                remote =
                    url: targetUrl
                    password: body.password
                RemoteCozy.create remote, -> res.send 200, success: true
    else
        msg = 'targetUrl and targetPassword parameters are mandatory.'
        res.send 400, error: msg

module.exports.list = (req, res) ->
    RemoteCozy.all (err, remotes) ->
        if err?
            res.send 500, error: err
        else
            res.send 200, remotes

module.exports.fetch = (req, res, next) ->
    if req.params.id?
        RemoteCozy.find req.params.id, (err, remote) ->
            if err? or not remote?
                res.send 500, err
            else
                req.remote = remote
                next()
    else
        res.send 400, error: "id parameter is mandatory"

module.exports.delete = (req, res) -> req.remote.destroy -> res.send 204

module.exports.process = (req, res) ->

    # normalize url
    url = req.remote.url
    url += "/" if url.substring(url.length - 1) isnt "/"

    isHttps = url.indexOf('https') is 0

    prefix = if isHttps then 'https://' else 'http://'

    url = url.replace 'https://', ''
    url = url.replace 'http://', ''

    ds = new Client "http://localhost:9101/"
    ds.setBasicAuth process.env.NAME, process.env.TOKEN

    target = "#{prefix}cozy-backup:#{req.remote.password}@#{url}cozy"
    params = target: target
    ds.post 'replicate', params, (err, resp, body) ->
        err = err or body?.error
        if err?
            status = resp?.statusCode or 500
            res.send status, error: err
        else
            res.send 204

