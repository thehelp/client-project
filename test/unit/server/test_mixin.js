
'use strict';

var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

var GruntConfig = require('thehelp-project').GruntConfig;
var mixin = require('../../../src/server/mixin');

describe('mixin for GruntConfig', function() {

  var grunt, fs, config;

  beforeEach(function() {
    grunt = {
      loadTasks: sinon.stub()
    };
    config = new GruntConfig(grunt);
    config.fs = fs = {};
    mixin(GruntConfig);
  });

  describe('#registerCopyFromBower', function() {
    it('honors special cases', function() {
      var dirs = ['lodash', 'async'];
      var expected = {
        files: {
          'lib/vendor/lodash.compat.js': 'bower_components/lodash/dist/lodash.compat.js',
          'lib/vendor/async.js': 'bower_components/async/lib/async.js'
        }
      };

      grunt.config = sinon.spy(function(name, data) {
        expect(data).to.deep.equal(expected);
      });

      fs.readdirSync = sinon.stub().returns(dirs);
      fs.statSync = sinon.stub().returns({
        isFile: sinon.stub().returns(true)
      });

      config.registerCopyFromBower();

      expect(grunt.config).to.have.property('callCount', 1);
    });
  });

  describe('#registerCopyFromDist', function() {
    it('creates just one task including all modules', function() {
      var modules = ['thehelp-core', 'thehelp-test'];
      var expected = {
        files: [{
          expand: true,
          cwd: 'node_modules/thehelp-core/dist',
          src: ['**/*'],
          dest: 'lib/vendor'
        },
        {
          expand: true,
          cwd: 'node_modules/thehelp-test/dist',
          src: ['**/*'],
          dest: 'lib/vendor'
        }]
      };

      grunt.config = sinon.spy(function(name, data) {
        expect(data).to.deep.equal(expected);
      });

      config.registerCopyFromDist({
        modules: modules
      });

      expect(grunt.config).to.have.property('callCount', 1);
    });
  });

});
