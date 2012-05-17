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


task 'tests', 'run tests through mocha', ->
  console.log "Run tests with Mocha for " + testFiles.join(" ")
  command = "mocha " + testFiles.join(" ") + " --reporter spec "
  command += "--require should --compilers coffee:coffee-script --colors"
  exec command, (err, stdout, stderr) ->
    if err
      console.log "Running mocha caught exception: \n" + err
    console.log stdout

option '-f', '--file [FILE]', 'test file to run'

task 'tests:file', 'run test through mocha for a given file', (options) ->
  file = options.file
  console.log "Run tests with Mocha for " + file
  command = "mocha " + file + " --reporter spec "
  command += "--require should --compilers coffee:coffee-script --colors"
  exec command, (err, stdout, stderr) ->
    if err
      console.log "Running mocha caught exception: \n" + err
    console.log stdout

task "xunit", "", ->
  process.env.TZ = "Europe/Paris"
  command = "mocha "
  command += " --require should --compilers coffee:coffee-script -R tap > test_result.tap"
  exec command, (err, stdout, stderr) ->
    console.log stdout

