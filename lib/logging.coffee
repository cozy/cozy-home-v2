
fs = require 'fs'
path = require 'path'

exports.stream = null

exports.init = (compound, callback) =>
    app = compound.app
    logDir = path.join compound.root, 'log'
    logFile = path.join logDir, app.get('env') + '.log'

    fs.exists logDir, (exists) =>
        if exists
            options =
                flags: 'a',
                mode: 0o0666,
                encoding: 'utf8'
            exports.stream = fs.createWriteStream logFile, options
            callback exports.stream
        else
            callback null
	
exports.write = (text) =>
    stream = exports.stream || process.stdout
    stream.write text + '\n' || console.log text