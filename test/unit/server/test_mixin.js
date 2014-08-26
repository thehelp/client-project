
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

  it('now has registerOptimize key', function() {
    expect(GruntConfig).to.have.deep.property('prototype.registerOptimize').that.exist;
  });

  it('now has registerOptimizeLibrary key', function() {
    expect(GruntConfig).to.have.deep.property('prototype.registerOptimizeLibrary')
      .that.exist;
  });

  it('now has registerConnect key', function() {
    expect(GruntConfig).to.have.deep.property('prototype.registerConnect').that.exist;
  });

  it('now has registerMocha key', function() {
    expect(GruntConfig).to.have.deep.property('prototype.registerMocha').that.exist;
  });

});
