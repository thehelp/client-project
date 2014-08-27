
if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function() {

  'use strict';

  var baseUrl = './';
  if (typeof window !== 'undefined') {
    baseUrl = window.host || '/';
  }

  module.exports = {
    baseUrl: baseUrl,
    paths: {
      jquery: 'bower_components/jquery/dist/jquery',
      lodash: 'bower_components/lodash/dist/lodash.compat'
    }
  };

});
