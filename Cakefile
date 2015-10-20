{exec} = require 'child_process'
fs     = require 'fs'
logger = require('printit')
    date: false
    prefix: 'cake'

option '-f', '--file [FILE*]' , 'List of test files to run'
option '-d', '--dir [DIR*]' , 'Directory of test files to run'
option '-e' , '--env [ENV]', 'Run tests with NODE_ENV=ENV. Default is test'
option '' , '--use-js', 'If enabled, tests will run with the built files'

options =  # defaults, will be overwritten by command line options
    file        : no
    dir         : no

# Grab test files of a directory recursively
walk = (dir, excludeElements = []) ->
    fileList = []
    list = fs.readdirSync dir
    if list
        for file in list
            if file and file not in excludeElements
                filename = "#{dir}/#{file}"
                stat = fs.statSync filename
                if stat and stat.isDirectory()
                    fileList2 = walk filename, excludeElements
                    fileList = fileList.concat fileList2
                else if filename.substr(-6) is "coffee"
                    fileList.push filename
    return fileList

taskDetails = '(default: ./tests, use -f or -d to specify files and directory)'
task 'tests', "Run tests #{taskDetails}", (opts) ->
    logger.options.prefix = 'cake:tests'
    files = []
    options = opts

    if options.dir
        dirList   = options.dir
        files = walk(dir, files) for dir in dirList
    if options.file
        files  = files.concat options.file
    unless options.dir or options.file
        files = walk "test", ['photo-set']

    env = if options['env'] then "NODE_ENV=#{options.env}" else "NODE_ENV=test"
    env += " USE_JS=true" if options['use-js']? and options['use-js']
    env += " NAME=home TOKEN=token"
    logger.info "Running tests with #{env}..."
    command = "#{env} mocha " + files.join(" ") + " --reporter spec --colors "
    command += "--compilers coffee:coffee-script/register "
    command += "--timeout 10000 " # longer timeout before test failure
    exec command, (err, stdout, stderr) ->
        console.log stdout
        if err?
            console.log "Running mocha caught exception:\n#{err}"
            setTimeout (-> process.exit 1), 100
        else if stderr?.length > 0
            console.log "Errors output to stderr during tests:\n#{stderr}"
            setTimeout (-> process.exit 1), 100
        else
            console.log "Tests succeeded!"
            process.exit 0


task "lint", "Run Coffeelint", ->
    process.env.TZ = "Europe/Paris"
    command = "coffeelint "
    command += " -f coffeelint.json -r server/"
    logger.options.prefix = 'cake:lint'
    logger.info 'Start linting...'
    exec command, (err, stdout, stderr) ->
        if err
            logger.error err
        else
            console.log stdout

# convert JSON lang files to JS
buildJsInLocales = ->
    path = require 'path'
    for file in fs.readdirSync './client/app/locales/'
        filename = './client/app/locales/' + file
        template = fs.readFileSync filename, 'utf8'
        exported = "module.exports = #{template};\n"
        name     = file.replace '.json', '.js'
        fs.writeFileSync "./build/client/app/locales/#{name}", exported
        # add locales at the end of app.js
    for file in fs.readdirSync './server/locales/'
        filename = './server/locales/' + file
        template = fs.readFileSync filename, 'utf8'
        exported = "module.exports = #{template};\n"
        name     = file.replace '.json', '.js'
        fs.writeFileSync "./build/server/locales/#{name}", exported
        # add locales at the end of app.js

    exec "rm -rf build/client/app/locales/*.json"
    exec "rm -rf build/server/locales/*.json"

buildJade = ->
    jade = require 'jade'
    path = require 'path'
    for file in fs.readdirSync './server/views/'
        return unless path.extname(file) is '.jade'
        filename = "./server/views/#{file}"
        template = fs.readFileSync filename, 'utf8'
        output = "var jade = require('jade/runtime');\n"
        output += "module.exports = " + jade.compileClient template, {filename}
        name = file.replace '.jade', '.js'
        fs.writeFileSync "./build/server/views/#{name}", output

task 'build', 'Build CoffeeScript to Javascript', ->
    logger.options.prefix = 'cake:build'
    logger.info "Start compilation..."
    command = "coffee -cb --output build/server server && " + \
              "coffee -cb --output build/ server.coffee  && " + \
              "mkdir -p build/client/app/locales/ && " + \
              "rm -rf build/client/app/locales/* && " + \
              "rm -rf build/client/public && " + \
              "mkdir -p build/client/public/ && " + \
              "mkdir -p build/server/locales/ && " + \
              # does not work when brunch is not launched
              "cp -rf client/public/* build/client/public && " + \
              "cp -rf server/locales/*.json build/server/locales && " + \
              "mkdir -p build/server/views/"
    exec command, (err, stdout, stderr) ->
        if err
            logger.error "An error has occurred while compiling:\n" + err
            process.exit 1
        else
            buildJade()
            buildJsInLocales()
            logger.info "Compilation succeeded."
            process.exit 0

SVGIMAGES = 'client/app/assets/img/apps'

task 'build-icons', "Sprite the icons in #{SVGIMAGES}", ->
    Iconizr = require 'iconizr'
    out = 'client/app/assets/app-icons'
    Iconizr.createIconKit SVGIMAGES, out,
        render: css: true
    , (err, result) ->
        console.log err if err
        console.log result
