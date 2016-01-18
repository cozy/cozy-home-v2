#!/usr/bin/env node

var spawn = require('child_process').spawn;
var major = process.versions.node.split('.')[0];
var bcrypt = 'bcrypt@0.8.5';

if (major === '0') {
  bcrypt = 'bcrypt@0.8.1';
}
spawn('npm', ['install', bcrypt], { stdio: 'inherit' });
