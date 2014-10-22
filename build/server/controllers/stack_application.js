// Generated by CoffeeScript 1.8.0
var StackApplication, fs, log, request, sendError, slugify, spawn;

request = require("request-json");

fs = require('fs');

slugify = require('cozy-slug');

spawn = require('child_process').spawn;

log = require('printit')({
  prefix: "applications"
});

StackApplication = require('../models/stack_application');

sendError = function(res, err, code) {
  if (code == null) {
    code = 500;
  }
  if (err == null) {
    err = {
      stack: null,
      message: "Server error occured"
    };
  }
  console.log("Sending error to client :");
  console.log(err.stack);
  return res.send(code, {
    error: true,
    success: false,
    message: err.message,
    stack: err.stack
  });
};

module.exports = {
  get: function(req, res, next) {
    return StackApplication.all(function(err, apps) {
      if (err) {
        return next(err);
      } else {
        return res.send({
          rows: apps
        });
      }
    });
  },
  update: function(req, res, next) {
    var updateStack;
    updateStack = spawn('cozy-monitor', ['update-all-cozy-stack', process.env.TOKEN], {
      'detached': true
    });
    updateStack.on('close', function(code) {
      if (err) {
        return sendError(res, err);
      }
    });
    updateStack.stdout.setEncoding('utf8');
    updateStack.stdout.on('data', function(data) {
      return console.log(data);
    });
    updateStack.stderr.setEncoding('utf8');
    return updateStack.stderr.on('data', function(data) {
      return console.log(data);
    });
  }
};