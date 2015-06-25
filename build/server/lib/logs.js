// Generated by CoffeeScript 1.9.3
var async, fs, logs, path;

fs = require('fs');

path = require('path');

async = require('async');

module.exports = logs = {
  colors: /(\x1B\[\d+m)/g,
  getLogPath: function(slug) {
    var backuppath, filename, filepath;
    filename = slug + ".log";
    filepath = path.join('/', 'usr', 'local', 'var', 'log', 'cozy', filename);
    backuppath = filepath + "-backup";
    if ((!fs.existsSync(filepath)) && fs.existsSync(backuppath)) {
      return backuppath;
    } else {
      return filepath;
    }
  },
  getLogs: function(slug, callback) {
    var logPath;
    logPath = logs.getLogPath(slug);
    return fs.readFile(logPath, function(err, logContent) {
      return callback(err, logContent != null ? logContent.toString().replace(logs.colors, '') : void 0);
    });
  },
  getManyLogs: function(slugs, callback) {
    var logContents;
    logContents = {};
    return async.eachSeries(slugs, function(slug, next) {
      var logPath;
      logPath = logs.getLogPath(slug);
      return fs.readFile(logPath, function(err, logContent) {
        var content;
        content = logContent != null ? logContent.toString() : void 0;
        logContents[slug] = content != null ? content.replace(logs.colors, '') : void 0;
        return next();
      });
    }, function() {
      return callback(null, logContents);
    });
  }
};
