fs = require 'fs'

# Grab test files
walk = (dir, fileList) ->
  list = fs.readdirSync(dir)
  if list
    for file in list
      if file
        filename = dir + '/' + file
        stat = fs.statSync(filename)
        if stat and stat.isDirectory()
          walk(filename, fileList)
        else if filename.substr(-6) == "coffee"
          fileList.push(filename)
  fileList

{exec} = require 'child_process'
testFiles = walk("test", [])
uiTestFiles = walk("client/test", [])

task 'tests', 'run tests through mocha', ->
    runTests testFiles

task 'tests:client', 'run tests through mocha', ->
    runTests uiTestFiles

runTests = (fileList) ->
  console.log "Run tests with Mocha for " + fileList.join(" ")
  command = "mocha " + fileList.join(" ") + " --reporter spec "
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
  console.log "Run tests with Mocha for " + file
  command = "mocha " + file + " --reporter spec "
  command += "--compilers coffee:coffee-script --colors"
  exec command, (err, stdout, stderr) ->
    if err
      console.log "Running mocha caught exception: \n" + err
    console.log stdout

task "xunit", "Run tests and save result in a file called xunit.xml", ->
  process.env.TZ = "Europe/Paris"
  command = "mocha "
  command += " --compilers coffee:coffee-script -R xunit > xunit.xml"
  exec command, (err, stdout, stderr) ->
    console.log stdout

task "xunit:client", "", ->
  process.env.TZ = "Europe/Paris"
  command = "mocha client/test/*"
  command += " --compilers coffee:coffee-script -R xunit > xunitclient.xml"
  exec command, (err, stdout, stderr) ->
    console.log stdout

task "lint", "Run coffeelint on backend files", ->
    process.env.TZ = "Europe/Paris"
    command = "coffeelint "
    command += "  -f coffeelint.json -r app/ lib/ config/ test/"
    exec command, (err, stdout, stderr) ->
        console.log err
        console.log stdout
