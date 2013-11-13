Testem integration with BrowserStack
====================================

Running test using Testem on BrowserStack can be done by following the below steps:

Install browserstack-cli
------------------------
Testem depends internally on [browserstack-cli][1] for running the tests.

Please install and setup [browserstack-cli][1] before continuing. You should see something similar when setting up browserstack-cli.

	Username: <your-username>
	Password: <your-api-key/browserstack-password>
	Tunnel private key (see while logged in http://www.browserstack.com/local-testing): <your-tunnel-key>
	Tunnel API key (see while logged in http://www.browserstack.com/automated-browser-testing-api#automated-local-testing): <your-api-key>
	Wrote <your-home-directory>/.browserstack/browserstack.json

	Downloading BrowserStackTunnel.jar [===================] 100%

Installing testem
-----------------
Please install [testem][2]

Running Tests
-------------
From the root of this repository run:

	testem ci -l bs_chrome

P.S. All launchers are defined with 'launch_in_ci'. You will probably want to edit the testem.yml.

### Attribution

Most of the code in this repo is taken from samples in [testem][2] repository.


## Issues
If you are getting any errors with the tunnel setup. Then try downloading the [jar][3] again and placing it in <your-home-directory>/.browserstack location.


[1] https://github.com/dbrans/browserstack-cli
[2] https://github.com/airportyh/testem
[3] http://www.browserstack.com/BrowserStackTunnel.jar
