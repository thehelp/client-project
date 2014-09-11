// # Util

'use strict';

var path = require('path');
var fs = require('fs');

function Util() {}

module.exports = Util;

Util.prototype.getPkg = function getPkg() {
  if (this.pkg) {
    return this.pkg;
  }

  try {
    this.pkg = require(path.join(process.cwd(), './package.json'));
  }
  finally {
    this.pkg = this.pkg || {};
    return this.pkg;
  }
};

Util.prototype.getEnv = function getEnv() {
  if (this.env) {
    return this.env;
  }

  try {
    this.env = require(path.join(process.cwd(), './env.json'));
  }
  finally {
    this.env = this.env || {};
    return this.env;
  }
};

Util.prototype.getLicenseContent = function getLicenseContent() {
  if (this.licenseContent) {
    return this.licenseContent;
  }

  try {
    this.licenseContent = fs.readFileSync(path.join(process.cwd(), './LICENSE.txt'));
  }
  finally {
    this.licenseContent = this.licenseContent || '';
    return this.licenseContent;
  }
};
