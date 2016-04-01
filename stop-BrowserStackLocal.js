#!/usr/bin/env node

var fs = require('fs');
var log = require('npmlog');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));

var pid = "";
var pidFileName = 'browserStackLocal.pid';
var pidFile = path.resolve(__dirname, pidFileName);

if(typeof(argv.logLevel) !== 'undefined' && argv.logLevel) {
  log.level = argv.logLevel;
} else {
  log.level = 'info';
}
log.verbose("Using log level: " + log.level);

if(typeof(argv.pidFile) !== 'undefined' && argv.pidFile) {
  pidFile = argv.pidFile;
}

if(typeof(argv.pid) !== 'undefined' && argv.pid) {
  pid = argv.pid;
} else {
  log.silly("Reading from pidFile " + pidFile);
  pid = fs.readFileSync(pidFile, 'utf8').trim();
}

log.silly("Killing process with pid " + pid);
process.kill(pid, 'SIGTERM');

if(!argv.pid) {
  log.silly("Deleting pidFile " + pidFile);
  fs.unlinkSync(pidFile);
}
