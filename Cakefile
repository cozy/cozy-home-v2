fs = require 'fs'
{exec} = require 'child_process'

# Grab test files
walk = (dir, fileList) ->
    list = fs.readdirSync dir
    if list
        for file in list
            filename = dir + '/' + file
            stat = fs.statSync filename
            if stat and stat.isDirectory()
                walk filename, fileList
            else if filename.substr(-6) is "coffee"
                fileList.push filename
    fileList

testFiles = walk "test", []

task 'tests', 'run tests through mocha', ->
    runTests testFiles

runTests = (fileList) ->
    console.log "Run tests with Mocha for #{fileList.join(" ")}"
    command = "mocha #{fileList.join(" ")} --reporter spec "
    command += "--compilers coffee:coffee-script --colors"
    exec command, (err, stdout, stderr) ->
        console.log stdout
        if err
            console.log "Running mocha caught exception: \n" + err
            process.exit 1
        else
            process.exit 0


option '-f', '--file [FILE]', 'test file to run'

task 'tests:file', 'run test through mocha for a given file', (options) ->
    file = options.file
    console.log "Run tests with Mocha for #{file}"
    command = "mocha #{file} --reporter spec "
    command += "--compilers coffee:coffee-script --colors"
    exec command, (err, stdout, stderr) ->
        if err
            console.log "Running mocha caught exception: \n" + err
            process.exit 1
        console.log stdout

task "lint", "Run coffeelint on backend files", ->
    process.env.TZ = "Europe/Paris"
    command = "coffeelint -f coffeelint.json -r server.coffee server/"
    exec command, (err, stdout, stderr) ->
        console.log err
        console.log stdout


task 'convert', 'convert from coffee to JS', ->
    files = walk "server", []
    console.log "Convert to JS..."
    command = "coffee -cb server.coffee #{files.join ' '} "
    exec command, (err, stdout, stderr) ->
        console.log stdout
        if err
            console.log "Running convertion caught exception: \n" + err
            process.exit 1
        else
            console.log "Convertion succeeded."
            process.exit 0
