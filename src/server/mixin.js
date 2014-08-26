/*
# mixin

Adds a set of new client-side development configuration methods to the GruntConfig class
provided by `thehelp-project`.
*/

'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports = function mixin(GruntConfig) {

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

  // `registerOptimizeLibrary` uses `grunt-requirejs` to produce one concatenated file,
  // by default optimized as well.
  GruntConfig.prototype.registerOptimize = function(options) {
    /*jshint maxcomplexity: 11 */

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

    if (!options.name) {
      throw new Error('Need to provide options.name!');
    }

    if (options.standalone) {
      config.almond = true;
    }

    options.outName = options.outName || options.name;
    config.name = options.name;
    config.out = config.out || options.outName;

    //turning on source maps unless explictly configured
    if (typeof config.generateSourceMaps === 'undefined') {
      config.optimize = 'uglify2';
      config.generateSourceMaps = true;
      config.preserveLicenseComments = false;
    }

    if (options.empty) {
      _.forEach(options.empty, function(module) {
        config.paths[module] = 'empty:';
      });
    }

    var taskName = 'requirejs.' + options.outName + (options.postfix || '') + '.options';
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
    var basePath = options.basePath || 'dist';
    var out = options.outName || options.name;

    //we never want source maps for libraries
    config.generateSourceMaps = false;
    config.preserveLicenseComments = true;

    //not minified, needs requirejs
    config.optimize = 'none';
    config.out = path.join(basePath, out + '.js');
    this.registerOptimize(options);

    //minified, needs requirejs
    delete config.optimize;
    options.postfix = '-min';
    config.out = path.join(basePath, out + '.min.js');
    this.registerOptimize(options);

    if (options.standalone) {

      //not minified, standalone with almond.js
      config.optimize = 'none';
      options.postfix = '-standalone';
      config.out = path.join(basePath, 'standalone', out + '.js');
      this.registerOptimize(options);

      //minified, standalone with almond.js
      delete config.optimize;
      options.postfix = '-standalone-min';
      config.out = path.join(basePath, 'standalone', out + '.min.js');
      this.registerOptimize(options);
    }
  };

};
