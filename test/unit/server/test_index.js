
'use strict';

var chai = require('chai');
var expect = chai.expect;

var index = require('../../../src/server/index');

describe('thehelp-client-project', function() {

  it('has mixin key', function() {
    expect(index).to.have.property('mixin').that.exist;
  });

});

