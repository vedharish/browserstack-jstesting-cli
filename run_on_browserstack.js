#!/usr/bin/env node

var log = require('npmlog');
var argv = require('minimist')(process.argv.slice(2));
var BrowserStack = require('browserstack');

var name = null
var WORKER_ID = 0;
var hardTimeout = 600000;

if(typeof(argv.logLevel) !== 'undefined' && argv.logLevel) {
  log.level = argv.logLevel;
} else {
  log.level = 'info';
}
log.verbose("Using log level: " + log.level);
delete argv.logLevel;
delete argv._;

var existsVariable = function(checkVariable) {
  return typeof(checkVariable) !== 'undefined' && checkVariable;
}
if(existsVariable(argv.hardTimeout)) {
  hardTimeout = argv.hardTimeout;
  delete argv.hardTimeout;
}

var getCreateClientOptions = function(argv) {
  var createClientOptions = {}
  var userFromEnvironment = process.env.BROWSERSTACK_USERNAME;
  var keyFromEnvironment = process.env.BROWSERSTACK_ACCESS_KEY;

  var keys = ['version', 'server'];
  for(index in keys) {
    var key = keys[index];
    if(existsVariable(argv[key])) {
      createClientOptions[key] = argv[key];
      delete argv[key];
    }
  }
  if(existsVariable(argv.username)) {
    log.silly("Using BrowserStack user from options");
    createClientOptions.username = argv.username;
    delete argv.username;
  } else if(existsVariable(userFromEnvironment)) {
    log.silly("Using BrowserStack user from environment variable BROWSERSTACK_USERNAME");
    createClientOptions.username = userFromEnvironment;
  } else {
    log.error("BrowserStack username not provided");
    process.exit(1);
  }
  if(existsVariable(argv.password)) {
    log.silly("Using BrowserStack key from options");
    createClientOptions.password = argv.password;
    delete argv.password;
  } else if(existsVariable(keyFromEnvironment)) {
    log.silly("Using BrowserStack key from environment variable BROWSERSTACK_ACCESS_KEY");
    createClientOptions.password = keyFromEnvironment;
  } else {
    log.error("BrowserStack key not provided");
    process.exit(1);
  }
  log.silly("Running tests with config: " + JSON.stringify(createClientOptions));
  return createClientOptions;
}

var client = BrowserStack.createClient(getCreateClientOptions(argv));

if(existsVariable(argv.tunnel)) {
  delete argv.tunnel;
  argv["browserstack.local"] = true;
}

['SIGINT', 'SIGTERM', 'SIGHUP'].forEach(function(evt) {
  process.on(evt, function() {
    log.info("Closed BrowserStack Worker process "+evt);
    if (client !== null) {
      client.terminateWorker(WORKER_ID, function() {
        process.exit();
      });
    }
  });
});

log.silly("Creating BrowserStack worker with additional settings: " + JSON.stringify(argv));
client.createWorker(argv, function(error, worker) {
  if (error) log.error(error);
  WORKER_ID = worker.id
  log.info("Worker Created");
});

log.verbose("Setting hard timeout for the test to " + hardTimeout + " milliseconds");
setTimeout(function() {
  log.info("Worker Timed out");
  client.terminateWorker(WORKER_ID);
}, hardTimeout);
