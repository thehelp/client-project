
'use strict';

var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

var PreambleRenderer = require('../../../src/server/preamble_renderer');

describe('PreambleRenderer', function() {
  var renderer;

  beforeEach(function() {
    renderer = new PreambleRenderer({
      util: {}
    });
  });

  describe('#renderComments', function() {
    it('handles nonexistent comments', function() {
      var comments;
      var expected = '';

      var actual = renderer.renderComments(comments);
      expect(actual).to.equal(expected);
    });

    it('returns only comments that match', function() {
      var comments = {
        blah: 'first comment',
        match: 'second comment',
        'match*': 'third comment'
      };
      var expected = 'second comment\n\n' +
        'third comment\n\n';

      var actual = renderer.renderComments(comments, 'match');
      expect(actual).to.equal(expected);
    });

    it('throws error when not a valid regex', function() {
      var comments = {
        '/\\': 'first comment'
      };

      expect(function() {
        renderer.renderComments(comments, 'match');
      }).to['throw'](/Invalid regular/);
    });
  });

  describe('#renderContributors', function() {
    it('handles nonexistent contributors', function() {
      var contributors;
      var expected = '';

      var actual = renderer.renderContributors(contributors);
      expect(actual).to.equal(expected);
    });

    it('handles both types of contributors in array', function() {
      var contributors = [
        {
          name: 'First',
          email: 'scott.nonnenberg@gmail.com'
        },
        'Second <scott@gammacorvi.com>'
      ];
      var expected = 'Contributors:\n' +
        '  First <scott.nonnenberg@gmail.com>\n' +
        '  Second <scott@gammacorvi.com>\n';

      var actual = renderer.renderContributors(contributors);
      expect(actual).to.equal(expected);
    });
  });

  describe('#renderLicense', function() {
    it('shows spdx link if license contant cannot be found', function() {
      renderer.util.getLicenseContent = sinon.stub().returns('');
      var license = 'MIT';
      var expected = '\nLicense: https://spdx.org/licenses/MIT\n';

      var actual = renderer.renderLicense(license);
      expect(actual).to.equal(expected);
    });

    it('shows full license if we\'re able to load it', function() {
      renderer.util.getLicenseContent = sinon.stub().returns('<<license content>>\n');
      var license = 'MIT';
      var expected = '\n\n<<license content>>\n\n';

      var actual = renderer.renderLicense(license);
      expect(actual).to.equal(expected);
    });

    it('uses user-provided license content if provided', function() {
      var license = 'MIT';
      var licenseContent = '<<license content>>\n';

      var expected = '\n\n<<license content>>\n\n';

      var actual = renderer.renderLicense(license, licenseContent);
      expect(actual).to.equal(expected);
    });
  });

  describe('#go', function() {
    it('uses provided pkg object', function() {
      renderer.renderLicense = sinon.stub().returns('');

      var options = {
        pkg: {
          name: 'test',
          version: '65.4',
          homepage: 'https://my.homepage',
          author: 'Someone Somewhere'
        },
        date: 'Today!'
      };
      var expected = '/*\n' +
        'test v65.4\n' +
        'Today!\n\n' +
        'https://my.homepage\n\n' +
        'Author: Someone Somewhere\n' +
        '*/\n\n';

      var actual = renderer.go('filename', options);
      expect(actual).to.equal(expected);
    });
  });
});
