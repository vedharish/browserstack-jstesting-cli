#!/usr/bin/env node

var fs = require('fs');
var log = require('npmlog');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var BrowserStackTunnel = require('browserstacktunnel-wrapper');

var asyncMode = false;
var pidFileName = 'browserStackLocal.pid';
var pidFile = path.resolve(__dirname, pidFileName);

if(typeof(argv.logLevel) !== 'undefined' && argv.logLevel) {
  log.level = argv.logLevel;
} else {
  log.level = 'info';
}
log.verbose("Using log level: " + log.level);
delete argv.logLevel;

if(argv._.indexOf('async') > -1) {
  asyncMode = true;
  log.verbose("Running in async mode");
}
delete argv._;

if(typeof(argv.key) !== 'string' || argv.key === '') {
  argv.key = process.env.BROWSERSTACK_KEY;
  log.silly("Using BrowserStack accessKey from environment");
}
if(typeof(argv.pidFile) !== 'undefined' && argv.pidFile) {
  pidFile = argv.pidFile;
}

if(typeof(argv.hosts) !== 'undefined' && argv.hosts !== '') {
  var hostsArr = argv.hosts.split(",");
  argv.hosts = [];
  if(hostsArr.length % 3 !== 0) {
    log.error("hosts must be in the format: name1,port1,sslFlag1,name2,port2,sslFlag2...");
    process.exit(1);
  }
  for(iter = 0; iter<hostsArr.length; iter = iter+3) {
    argv.hosts.push({
      name: hostsArr[iter],
      host: hostsArr[iter + 1],
      sslFlag: hostsArr[iter + 2]
    });
  }
  log.info(JSON.stringify(argv.hosts));
}

log.verbose("Starting browserStackTunnel with options: " + JSON.stringify(argv));
var browserStackTunnel = new BrowserStackTunnel(argv);

if(asyncMode === false) {
  process.on('SIGINT', function() {
    if (browserStackTunnel !== null && browserStackTunnel.state === 'started') {
      browserStackTunnel.stop(function(error) {
        if (error) {
          log.error(error);
        } else {
          log.info('BrowserStackLocal disconnected');
          process.exit();
        }
      });
    }
  });
}

browserStackTunnel.start(function(error) {
  browserStackTunnel.tunnel.stdout.on('data', function(data) {
    log.silly("Data:\n" + data);
  });
  browserStackTunnel.tunnel.stderr.on('data', function(data) {
    log.silly("Error:\n " + data);
  });
  if (error) {
    log.error(error);
  } else {
    log.info("Tunnel started");
    if(asyncMode === true) {
      log.verbose("Writing pid to file " + pidFile + " and exiting.");
      fs.writeFileSync(pidFile, browserStackTunnel.tunnel.pid, 'utf8');
      process.exit();
    }
  }
});
