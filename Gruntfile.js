// # Gruntfile
// Automation for the project.

'use strict';

var GruntConfig = require('thehelp-project').GruntConfig;

// We simply create an instance of the `GruntConfig` class from
// `thehelp-project`, then call the register functions we need.
module.exports = function(grunt) {
  var config = new GruntConfig(grunt);

  config.standardSetup();
  config.standardDefault();

  grunt.config('shell.integration', {
    command: 'cd test/default && ./run.sh && ./clean.sh'
  });

  var tasks = config.defaultTasks.concat(['shell:integration']);
  grunt.registerTask('default', tasks);
};
