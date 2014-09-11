/*
# mixin

Adds a set of new client-side development configuration methods to the GruntConfig class
provided by `thehelp-project`.
*/

'use strict';

var path = require('path');

var _ = require('lodash');
var chalk = require('chalk');

var Util = require('./util');
var PreambleRenderer = require('./preamble_renderer');
var saucePlatforms = require('./sauce_platforms');

module.exports = function mixin(GruntConfig) {

  GruntConfig.prototype.util = new Util();
  GruntConfig.prototype.saucePlatforms = saucePlatforms;

  // Before we replace `standardSetup` with our version which calls `registerConnect` we
  // save the previous method in an array.
  var previous =
    GruntConfig.prototype.previousSetup = GruntConfig.prototype.previousSetup || [];

  var parent = GruntConfig.prototype.standardSetup;
  previous.push(parent);

  GruntConfig.prototype.standardSetup = function(options) {
    options = options || {};

    parent.call(this, options);

    this.registerConnect(options.connect);
  };

  /*
  `registerConnect` sets up two targets for the `grunt-contrib-connect`
  task, which runs a basic file server. Two different targets are provided:

  + test: On port 3001, this server will stop as soon as the grunt run stops,
  which means that it is only useful for grunt-based testing.
  + keepalive: A server on 3000 that runs until explicitly stopped - good
  for active development.

  */
  GruntConfig.prototype.registerConnect = function(options) {
    this.loadLocalNpm('grunt-contrib-connect', __dirname);

    this.grunt.config('connect', options || {
      test: {
        options: {
          base: '.',
          port: 3001
        }
      },
      keepalive: {
        options: {
          base: '.',
          port: 3000,
          keepalive: true
        }
      }
    });
  };

  // `registerMocha` pulls in `grunt-mocha` which uses `phantomjs`
  // and a custom bridge to run in-browser tests on the command line. You're
  // just responsible for the collection of `urls` to hit. You might consider using
  // the port 3001 urls available with the `connect` task above.
  GruntConfig.prototype.registerMocha = function(options) {
    options = options || {};

    if (!options.urls) {
      throw new Error('Need to provide array of urls to registerMocha()!');
    }

    options.reporter = options.reporter || 'Spec';

    if (typeof options.run === 'undefined') {
      //default to allowing tests to run when they are ready
      options.run = false;
    }

    if (typeof options.log === 'undefined') {
      //default to piping browser console output back to the command line
      options.log = true;
    }

    this.loadLocalNpm('grunt-mocha', __dirname);

    this.grunt.config('mocha', {
      default: {
        options: options
      }
    });
  };

  /*
  `registerOptimizeLibrary` uses `grunt-requirejs` to produce one concatenated file,
  optimized and including source maps by default.

  _Sadly, `preserveLicenseComments` is incompatible with `generateSourceMaps`. So we've
  opted for source maps._
  */
  GruntConfig.prototype.registerOptimize = function(options) {
    /*jshint maxcomplexity: 12 */

    if (!this.requirejsRegistered) {
      this.loadLocalNpm('grunt-requirejs', __dirname);
      this.requirejsRegistered = true;
    }

    options = options || {};
    options = _.cloneDeep(options);
    var config = options.config;

    if (!config) {
      throw new Error('Need to provide options.config with requirejs options!');
    }

    if (!options.source) {
      throw new Error('Need to provide options.source!');
    }

    if (options.standalone) {
      config.almond = true;
    }

    options.target = options.target || options.source;
    config.name = options.source;
    config.out = config.out || options.target;

    if (!config.out) {
      throw new Error('Need to provide options.target or options.config.out!');
    }

    //turning on source maps unless explictly configured
    if (typeof config.optimize === 'undefined' &&
      typeof config.generateSourceMaps === 'undefined' &&
      typeof config.preserveLicenseComments === 'undefined') {

      config.optimize = 'uglify2';
      config.generateSourceMaps = true;
      config.preserveLicenseComments = false;
    }

    if (options.empty) {
      _.forEach(options.empty, function(module) {
        config.paths[module] = 'empty:';
      });
    }

    var name = config.out || '';
    name = name.replace(/\./g, '_');
    var taskName = 'requirejs.' + name + '.options';
    this.grunt.config(taskName, config);
  };

  /*
  `registerOptimizeLibrary` uses `grunt-requirejs` to produce both optimized
  and unoptimized versions of a given library using the r.js optimizer.
  If specified, `standalone` versions of that library can be produced as well
  (using almond), resulting in four total files:

  + library.js
  + library.min.js
  + standalone/library.js
  + standalone/library.min.js

  */
  GruntConfig.prototype.registerOptimizeLibrary = function(options) {
    options = options || {};
    options = _.cloneDeep(options);
    var config = options.config || {};
    var targetPath = options.targetPath || 'dist/js';
    var target = options.target || options.source;
    var standalone = options.standalone;

    //turn off source maps by default, since we're providing unminified files
    if (typeof config.generateSourceMaps === 'undefined') {
      config.generateSourceMaps = false;
      config.preserveLicenseComments = true;
    }

    options.standalone = false;

    //not minified, needs requirejs
    config.optimize = 'none';
    config.out = path.join(targetPath, target + '.js');
    this.registerOptimize(options);

    //minified, needs requirejs
    delete config.optimize;
    config.out = path.join(targetPath, target + '.min.js');
    this.registerOptimize(options);

    if (standalone) {
      options.standalone = true;

      //not minified, standalone with almond.js
      config.optimize = 'none';
      config.out = path.join(targetPath, 'standalone', target + '.js');
      this.registerOptimize(options);

      //minified, standalone with almond.js
      delete config.optimize;
      config.out = path.join(targetPath, 'standalone', target + '.min.js');
      this.registerOptimize(options);
    }
  };

  /*
  `registerSauce` pulls in the `grunt-saucelabs` package and sets up its subtask,
  `saucelabs-mocha` with a number of defaults to make it easy. It pulls values from
  'env.json' and 'package.json' in the current working directory, so if you run the
  `grunt` command from another directory than the root of your project, you'll get
  different behavior.

  _Note: by default this plugin uses
  [Sauce Connect](https://docs.saucelabs.com/reference/sauce-connect/) to make local URLs
  available to the Sauce Labs infrastructure. Set `tunneled = false` to disable that
  behavior._

  ```
  config.registerSauce({
    // required
    urls: [
      'can be local URLs, since sauce connect is used'
    ],

    // optional; defaults are:
    username: 'SAUCE_USERNAME from env.json',
    key: 'SAUCE_ACCESS_KEY from env.json',
    testname: 'name from package.json',
    build: 'version from package.json',
    browsers: [
      'a small subset of supported sauce labs platform that gives good coverage'
    ],
    sauceConfig: {
      // test results are available via their unique url to anyone who has it
      public: 'share'
    },
    pollInterval: 750,
    throttling: 2
  });
  ```

  Check [./sauce_platforms.html](sauce_platforms.js) for more information on the sauce
  platform subsets available. [More information on options you can pass to
  the `grunt-saucelabs` tasks](https://github.com/axemclion/grunt-saucelabs#usage)

  */
  GruntConfig.prototype.registerSauce = function(options) {
    /*jshint maxcomplexity: 13 */

    this.loadLocalNpm('grunt-saucelabs', __dirname);

    options = options || {};

    var env = this.util.getEnv();
    options.username = options.username || env.SAUCE_USERNAME;
    options.key = options.key || env.SAUCE_ACCESS_KEY;

    var pkg = options.pkg || this.util.getPkg();
    options.testname = options.testname || pkg.name;
    options.build = options.build || pkg.version;

    options.browsers = options.browsers || this.saucePlatforms.cheapCoverage;

    if (!options.urls) {
      throw new Error('Need to provide the urls to test!');
    }

    options.sauceConfig = options.sauceConfig || {};
    options.sauceConfig.public = options.sauceConfig.public || 'share';

    options.pollInterval = options.pollInternval || 750;
    options.throttled = options.throttled || 2;

    this.grunt.config('saucelabs-mocha', {
      default: {
        options: options
      }
    });

    this.grunt.registerTask('sauce', ['saucelabs-mocha']);
  };

  /*
  `registerPreambleForDist` installs a task called 'preamble-for-dist' which injects
  project version/license/author information into the top of files in the dist folder. By
  default, it applies to all javascript files under your project 'dist' directory.

  It will attempt to load your project's 'package.json' by loading the file by that name
  at `process.cwd()`. You can override this lookup by providing your own `pkg` object on
  `options`. Otherwise, be careful where you run the `grunt` command.

  ```
  grunt.registerPreambleForDist({
    // this key will override package.json from disk
    pkg: {
      // these keys are required, either from pkg or from your package.json
      name: 'project-name',
      version: '1.4',
      homepage: 'http://my.homepage',
      author: 'Someone',

      // optional; both contributor formats supported
      contributors: [
        'Person 1 <email>',
        {name: 'Person', email: 'email'}
      ],

      // only required if no LICENSE.txt is found and licenseContent not provided
      license: 'a short name, like MIT'
    },

    // optional; the set of files to process
    src: ['dist/js/public/*.js', 'dist/library.css'],

    // optional; overrides LICENSE.text from working directory
    licenseContent: 'complete license text',

    // optional
    comments: {
      library1: 'Library 1 uses components from X, Y and X packages.',
      '*': 'This project is a labor of love'
    }
  });
  ```

  _Note: keys in the `comments` object are regular expressions. If a file matches more
  than one key, each message will be included._

  */
  GruntConfig.prototype.registerPreambleForDist = function(options) {
    var grunt = this.grunt;
    var renderer = new PreambleRenderer({
      util: this.util
    });

    grunt.registerMultiTask('preamble-for-dist', function() {
      var files = this.filesSrc;
      var options = this.options();

      options = options || {};
      options.date = options.date || new Date();

      _.forEach(files, function(file) {
        var contents = grunt.file.read(file);

        contents = renderer.go(file, options) + contents;

        grunt.file.write(file, contents);

        grunt.log.writeln('File ' + chalk.cyan(file) + ' updated.');
      });
    });

    options = options || {};
    options.src = options.src || ['dist/**/*.js'];

    this.grunt.config('preamble-for-dist', {
      default: {
        src: options.src,
        options: options
      }
    });
  };
};
