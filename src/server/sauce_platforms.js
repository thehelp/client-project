/*
# sauce_platforms

Makes it easier to deal with the platforms offered by [Sauce Labs](http://saucelabs.com)
testing systems.

Loosely based on browsers with reasonable usage:
[http://caniuse.com/usage_table.php](http://caniuse.com/usage_table.php)

Sauce Labs current supported platforms:

+ [https://saucelabs.com/platforms](https://saucelabs.com/platforms)
+ (in JSON form) http://saucelabs.com/rest/v1/info/browsers/webdriver

*/

'use strict';

var platforms = module.exports = {};

platforms.safari = [
  ['OS X 10.9', 'safari', '7'],
  ['OS X 10.8', 'safari', '6'],
  ['OS X 10.6', 'safari', '5']
];

platforms.internetExplorer = [
  ['Windows 8.1', 'internet explorer', '11'],
  ['Windows 7', 'internet explorer', '11'],
  ['Windows 8', 'internet explorer', '10'],
  ['Windows 7', 'internet explorer', '10'],
  ['Windows 7', 'internet explorer', '9']
];

platforms.iOS = [
  ['OS X 10.9', 'iphone', '7.1'],
  ['OS X 10.9', 'ipad', '7.1'],
  ['OS X 10.8', 'iphone', '6.1'],
  ['OS X 10.8', 'ipad', '6.1']
];

platforms.android = [
  ['Linux', 'android', '4.4'],
  ['Linux', 'android', '4.3'],
  ['Linux', 'android', '4.1'],
  ['Linux', 'android', '4.0']
];

platforms.firefox = [
  ['linux', 'firefox', '31'],
  ['OS X 10.9', 'firefox', '30'], // newer firefox is not available on OSX
  ['Windows 8', 'firefox', '31'],
  ['Windows 8', 'firefox', '30'],
  ['Windows 7', 'firefox', '31'],
  ['Windows 7', 'firefox', '30']
];

platforms.chrome = [
  ['linux', 'chrome', '36'],
  ['OS X 10.9', 'chrome', '35'], // newer chrome is not available on OSX
  ['Windows 8', 'chrome', '37'],
  ['Windows 7', 'chrome', '37'],
  ['Windows 8', 'chrome', '36'],
  ['Windows 7', 'chrome', '36']
];

platforms.all = []
  .concat(platforms.safari)
  .concat(platforms.internetExplorer)
  .concat(platforms.iOS)
  .concat(platforms.android)
  .concat(platforms.firefox)
  .concat(platforms.chrome);

platforms.cheapCoverage = [
  ['Windows 7', 'chrome', '36'],
  ['Windows 7', 'firefox', '31'],
  ['Windows 7', 'internet explorer', '11'],
  ['OS X 10.9', 'iphone', '7.1'],
  ['Linux', 'android', '4.4'],
  ['Linux', 'android', '4.3']
];
