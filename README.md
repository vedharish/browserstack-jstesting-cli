Testem with BrowserStack
========================

Run your tests on various browsers hosted on Browserstack!

Instructions
------------

1. Get a [BrowserStack] account.
2. Install this package `npm install -g browserstack-jstesting-cli`
3. This package provides 3 binaries:
  - start-BrowserStackLocal : This starts the [BrowserStackLocal Binary] on the local machine.
  - run_on_browserstack     : This starts a browser instance on BrowserStack.
  - stop-BrowserStackLocal  : This stops a previously started BrowserStackLocal instance
4. For BrowserStack Authentication export the environment variables for the username and access key of your BrowserStack account.
   These can be found on the [automate accounts page on BrowserStack](https://www.browserstack.com/accounts/automate)
   `export BROWSERSTACK_USERNAME=<browserstack-username> && export BROWSERSTACK_KEY=<browserstack-access-key>`

   Alternatively, you can use command-line options as explained below.

## CLI Options

### Start Binary

#### Module - specific options

- `--logLevel value` : Specify the level of logging. This corresponds to [logging levels of the npmlog package](https://github.com/npm/npmlog#loglevelprefix-message-).
                       The binary output is also displayed at logLevel `silly`.
- `--async` : Start the binary in `async` mode. This means that the command will wait till the `BrowserStackLocal` binary starts successfully and then will return
              without stopping the binary. You can later stop the binary with `stop-BrowserStackLocal` script. In `sync` mode, stopping the command will stop the binary.
- `--pidFile file` : Specify a pidFile to write the `BrowserStackLocal` binary pid to. This is handled automatically and you do not need to specify this option.

#### Binary - specific options

You can pass in any option specified [here](https://github.com/pghalliday/node-BrowserStackTunnel#api) as `new BrowserStackTunnel` arguments. Any non-module level option 
is forwarded to this function.

If a `BrowserStack` access_key is not provided as an argument (`--key=access_key`) then the environment variable `BROWSERSTACK_ACCESS_KEY` is used.

The `--hosts` options requires a hash, This must be specified as `--hosts name1,port1,sslFlag1,name2,port2,sslFlag2` as the binary uses internally.

All `BrowserStackLocal` binary related modifiers are [listed here](https://www.browserstack.com/local-testing#modifiers)

### Stop Binary

#### Module - specific options

- `--logLevel value` : Specify the level of logging. This corresponds to [logging levels of the npmlog package](https://github.com/npm/npmlog#loglevelprefix-message-).
- `--pidFile file` : Specify a pidFile to write the `BrowserStackLocal` binary pid to. This is handled automatically and you do not need to specify this option.
- `--pid pid` : Specify a pid to kill.

### Run tests / Launch Browser

#### Module - specific options

- `--logLevel value` : Specify the level of logging. This corresponds to [logging levels of the npmlog package](https://github.com/npm/npmlog#loglevelprefix-message-).
- `--hardTimeout value` : The maximum amount of time the the tests should run. This is in conjuction with `BrowserStack` specific timeouts mentioned later.
                          The value should be in milliseconds. The default `hardTimeout` is 600000.

#### BrowserStack Client specific options

These option can be either from [here](https://github.com/scottgonzalez/node-browserstack#browserstackcreateclientsettings) or [here](https://github.com/scottgonzalez/node-browserstack#clientcreateworkersettings-callback).


- The `--timeout value` option specifies the worker specific timeout in seconds.
- The server host and port are specified as `--server.host https://api.browserstack.com --server.port 80`
- Currently, `--username`, `--pasword`, `--version`, `--server.host` and `--server.port` options are identified as `createClient` options. Others will be supplies to `createWorker` settings.

## Testem configuration

### Start/Stop

You need to run the scripts `start-BrowserStackLocal` and `stop-BrowserStackLocal`, respectively
when starting/stopping the test run. Put this configuration in your `testem.json`:

```json
"on_start": "$(npm bin)/start-BrowserStackLocal async",
"on_exit": "$(npm bin)/stop-BrowserStackLocal",
```

The command start-BrowserStackLocal will fail if it is not provided with a `localIdentifier` as an argument and
there is another BrowserStackLocal binary instance running.
You can use `--force` option to make any concurrently running binary to close connections.
Alternatively, pass `--localIdentifier=identifier` to create a new instance which is idetified by string `identifier`
and you can have multiple `BrowserStackLocal` binary instances, each with different identifiers.

### Launcher

You need to configure the launchers manually in your testem configuration. Examples are given in
`sample-testem.json`. It is basically using the script `run_on_browserstack.js` with the name of the
browser as argument.

```json
"launchers": {
  "bs_chrome": {
    "command": "$(npm bin)/run_on_browserstack --os Windows --os_version 10 --browser chrome  --browser_version latest --url <url>",
    "protocol": "browser"
  }
}
```

`<url>` gets replaced with the proper test URL by testem.

The arguments of `run_on_browserstack` are

You need to add single quotes if one of the arguments contains a space (e.g. `'OS X' 'Mountain Lion'`).
You'll find further examples in `sample-testem.json` of this repository.


## Running Testem

Install [testem] globally by running `npm install testem -g`. This might be optional depending on
your project's test suite setup.

Use `testem ci -l bs_chrome` to test out the setup with just the Chrome browser, configured above.
Run `testem ci` to run it on all configured browsers - see `testem launchers` for the full list.

## Optional: browserstack-cli

You can optionally install browserstack-cli in order to get a list of __all__ available browsers (as opposed to `testem launchers` which only lists the browsers, you have configured in `testem.json`), devices
and operating systems.

```sh
npm install -g browserstack-cli
browserstack setup # asks for your credentials and stores the information in $HOME/.browserstack
browserstack browsers | less -r
```

[BrowserStack]: http://www.browserstack.com
[BrowserStackLocal Binary]: https://www.browserstack.com/local-testing
[testem]: https://github.com/testem/testem
