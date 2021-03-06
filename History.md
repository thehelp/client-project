## 0.5.0 (2013-03-21)

* `config.saucePlatforms.cheapCoverage` and `config.saucePlatforms.all` updated per [February 2015 statcounter data](http://gs.statcounter.com/) (select mobile browsers as well as specific browser versions, download the CSV).
* Major version updates: `lodash` (2.x to 3.x), `chalk` (0.5.1 to 1.x)
* Minor version updates: `grunt-contrib-connect`, `grunt-saucelabs`
* Update dev dependencies

## 0.4.0 (2014-09-10)

* `grunt-saucelabs` now included with install, set up with `GruntConfig.registerSauce()`
* New 'preamble-for-dist' multi-task to add version number, author, and license information into dist js files. Set up with `GruntConfig.registerPreambleForDist()`

## 0.3.0 (2014-08-28)

* Breaking: removed `registerCopyFromDist()` and `registerCopyFromBower()`; no real need to copy into local repo. Will do it on a case-by-case basis when a project requires a build step.
* Breaking: `registerOptimize()` parameter names made more friendly `name`->`source`, `outName`->`target`, `basePath`->`targetPath`
* travis-ci support
* Documentation updates
* Update `thehelp-project` dev dependency
* Remove `blanket` dev dependency and configuration; we weren't really using it
* Remove `thehelp-test` (circular) dev dependency, add `sinon` and `chai` as replacements
* Full integration test

## 0.2.0 (2014-06-25)

* `registerOptimizeLibrary()` turns off source maps, since they're really big
* Minor version update: `grunt-contrib-connect`
* Update dev dependencies

## 0.1.0 (2014-06-07)

* Six core functions available:
  * `registerConnect()`
  * `registerMocha()`
  * `registerOptimize()`
  * `registerOptimizeLibrary()`
  * `registerCopyFromBower()`
  * `registerCopyFromDist()`
