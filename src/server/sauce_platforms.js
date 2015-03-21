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
  ['Mac 10.10', 'safari', '8'],
  ['Mac 10.9', 'safari', '7'],
  ['Mac 10.8', 'safari', '6'],
  ['Mac 10.6', 'safari', '5']
];

platforms.internetExplorer = [
  ['Windows 2012 R2', 'internet explorer', '11'],
  ['Windows 2012', 'internet explorer', '10'],
  ['Windows 2008', 'internet explorer', '9']
];

platforms.iOS = [
  ['Mac 10.10', 'iphone', '8.1'],
  ['Mac 10.10', 'iphone', '7.1']
];

platforms.android = [
  ['Linux', 'android', '5.0'],
  ['Linux', 'android', '4.4'],
  ['Linux', 'android', '4.3'],
  ['Linux', 'android', '4.1'],
  ['Linux', 'android', '4.0']
];

platforms.firefox = [
  ['Windows 2012 R2', 'firefox', '35'],
  ['Windows 2012 R2', 'firefox', '36'],
  ['Windows 2012 R2', 'firefox', '34']
];

platforms.chrome = [
  ['Windows 2012 R2', 'chrome', '40'],
  ['Windows 2012 R2', 'chrome', '39'],
  ['Windows 2012 R2', 'chrome', '37'],
  ['Windows 2012 R2', 'chrome', '31']
];

// ~85-90% of global web usage per Feb 2015 statcounter.com
platforms.all = []
  .concat(platforms.safari)
  .concat(platforms.internetExplorer)
  .concat(platforms.iOS)
  .concat(platforms.android)
  .concat(platforms.firefox)
  .concat(platforms.chrome);

// ~75% of global web usage per Feb 2015 statcounter.com
// only missing IE8, whoch our test infrastucture doesn't like
platforms.cheapCoverage = [
  ['Windows 2012 R2', 'chrome', '40'],
  ['Windows 2012 R2', 'firefox', '35'],
  ['Windows 2012 R2', 'internet explorer', '11'],
  ['Mac 10.10', 'iphone', '8.1'],
  ['Windows 2012 R2', 'chrome', '39'],
  ['Windows 2008', 'internet explorer', '9'],
  ['Windows 2012', 'internet explorer', '10'],
  ['Linux', 'android', '5.0'],
  ['Linux', 'android', '4.4']
];

