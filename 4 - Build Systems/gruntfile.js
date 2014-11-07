
module.exports = function (grunt) {
  
    grunt.initConfig({
      jshint: {
          files: ['gruntfile.js', 'src/**/*.js', 'tests/**/*.js'],
      }
    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
};