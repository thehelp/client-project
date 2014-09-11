// # PreambleRenderer
// The logic for rendering a complete file premble, split out into bite-sized chunks.

'use strict';

var _ = require('lodash');

var Util = require('./util');

function PreambleRenderer(options) {
  options = options || {};

  this.util = options.util || new Util();
}

module.exports = PreambleRenderer;

PreambleRenderer.prototype.renderComments = function(comments, file) {
  var result = '';

  if (comments) {
    _(comments).keys().forEach(function(key) {
      var r = new RegExp(key);
      if (r.test(file)) {
        result += comments[key] + '\n\n';
      }
    });
  }

  return result;
};

PreambleRenderer.prototype.renderContributors = function(contributors) {
  var result = '';

  if (contributors) {
    result += 'Contributors:\n';
    _.forEach(contributors, function(contributor) {
      if (typeof contributor === 'string') {
        result += '  ' + contributor + '\n';
      }
      else {
        result += '  ' + contributor.name + ' <' + contributor.email + '>\n';
      }
    });
  }

  return result;
};

PreambleRenderer.prototype.renderLicense = function(licenseName, licenseContent) {
  var result;

  var content = licenseContent || this.util.getLicenseContent();

  if (content) {
    result = '\n\n' + content + '\n';
  }
  else {
    result = '\nLicense: https://spdx.org/licenses/' + licenseName + '\n';
  }

  return result;
};

PreambleRenderer.prototype.go = function(file, options) {
  var result = '';
  var pkg = options.pkg || this.util.getPkg();

  result +=
    '/*' + '\n' +
    pkg.name + ' v' + pkg.version + '\n' +
    options.date + '\n\n';

  result += pkg.homepage + '\n\n';

  result += this.renderComments(options.comments, file);

  result +=
    'Author: ' + pkg.author + '\n';

  result += this.renderContributors(pkg.contributors);

  result += this.renderLicense(pkg.license, options.licenseContent);

  result += '*/\n\n';

  return result;
};
