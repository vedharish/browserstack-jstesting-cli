Testem with BrowserStack
========================

Run your tests on various browsers hosted on Browserstack!

Instructions
------------

1. Get a [BrowserStack] account.
2. Install this package `npm install --save-dev browserstack-testem-integration`
3. Add start/stop and launcher configuration to your testem configuration, see instructions below
   and the examples in `testem.json`
4. For BrowserStack Authentication export the environment variables for the username and access key of your BrowserStack account. These can be found on the [automate accounts page on BrowserStack](https://www.browserstack.com/accounts/automate) `export BROWSERSTACK_USERNAME=<browserstack-username> && export BROWSERSTACK_KEY=<browserstack-access-key>`

### Start/Stop

You need to run the scripts `start-BrowserStackLocal` and `stop-BrowserStackLocal`, respectively
when starting/stopping the test run. Put this configuration in your `testem.json`:

```json
"on_start": {
  "command": "kill -9 $(ps -A | grep BrowserStackLocal | grep -v grep | cut -d ' ' -f2); $(npm bin)/start-BrowserStackLocal &",
  "wait_for_text": "Tunnel started",
  "wait_for_text_timeout": 300000
},
"on_exit": "$(npm bin)/stop-BrowserStackLocal.js `cat browserStackLocal.pid`; rm browserStackLocal.pid",
```

The command in `on_start` kills any running session of `browserstack` if there is one. **Note: This
means that you cannot run 2 concurrent test runs by the same time. Configure your CI system
accordingly!**

### Launcher

You need to configure the launchers manually in your testem configuration. Examples are given in
`testem.json`. It is basically using the script `run_on_browserstack.js` with the name of the
browser as argument.

```json
"launchers": {
  "bs_chrome": {
    "command": "$(npm bin)/run_on_browserstack Windows 10 chrome latest nil <url>",
    "protocol": "browser"
  }
}
```

`<url>` gets replaced with the proper test URL by testem.

The arguments of `run_on_browserstack` are

```
node run_on_browserstack <OS> <OS-Version> <browser> <browser-version> <device> <url>
```

You need to add quotes if one of the arguments contains a space (e.g. `'OS X' 'Mountain Lion'`).
You'll find further examples in `testem.json` of this repository.


#### Testem

Install [testem] globally by running `npm install testem -g`. This might be optional depending on
your project's test suite setup.

Use `testem ci -l bs_chrome` to test out the setup with just the Chrome browser, configured above.
Run `testem ci` to run it on all configured browsers - see `testem launchers` for the full list.

#### Optional: browserstack-cli

You can optionally install browserstack-cli in order to get a list of __all__ available browsers (as opposed to `testem launchers` which only lists the browsers, you have configured in `testem.json`), devices
and operating systems.

```sh
npm install -g browserstack-cli
browserstack setup # asks for your credentials and stores the information in $HOME/.browserstack
browserstack browsers | less -r
```

[BrowserStack]: http://www.browserstack.com
[testem]: https://github.com/testem/testem
