
'use strict';

var GruntConfig = require('thehelp-project').GruntConfig;
require('../../src/server/mixin')(GruntConfig);

var internals = {};

module.exports = function(grunt) {
  var config = new GruntConfig(grunt);

  config.standardSetup();
  config.standardDefault();

  internals.setupClientTesting(config, grunt);
  internals.setupDist(config, grunt);
};

internals.setupClientTesting = function(config, grunt) {
  config.registerMocha({
    urls: [
      'http://localhost:3001/test/integration/basic.html',
      'http://localhost:3001/test/integration/basic_standalone.html',
      'http://localhost:3001/test/integration/library.html',
      'http://localhost:3001/test/integration/library_standalone.html'
    ]
  });

  grunt.registerTask('client-test', ['connect:test', 'mocha']);
};

internals.setupDist = function(config, grunt) {
  var requireJsConfig = require('./src/client/config');

  config.registerOptimize({
    source: 'src/client/home',
    target: 'dist/js/home_standalone.js',
    standalone: true,
    config: requireJsConfig
  });

  config.registerOptimize({
    source: 'src/client/home',
    target: 'dist/js/home.js',
    config: requireJsConfig
  });

  config.registerOptimizeLibrary({
    source: 'library',
    targetPath: 'dist/js',
    standalone: true,
    config: requireJsConfig
  });

  grunt.registerTask('dist', ['requirejs']);
};
