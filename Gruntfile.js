// # Gruntfile
// Automation for the project.

'use strict';

var GruntConfig = require('thehelp-project').GruntConfig;

module.exports = function(grunt) {
  var config = new GruntConfig(grunt);

  config.standardSetup();
  config.standardDefault();

  //Run the full integration test via the shell
  grunt.config('shell.integration', {
    command: 'cd test/default && ./run.sh && find dist && ./clean.sh'
  });

  var tasks = config.defaultTasks.concat(['shell:integration']);
  grunt.registerTask('default', tasks);
};
