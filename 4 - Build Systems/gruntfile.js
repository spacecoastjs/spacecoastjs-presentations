
module.exports = function (grunt) {
  
    grunt.initConfig({
        jshint: {
            files: ['gruntfile.js', 'src/**/*.js', 'tests/**/*.js'],
        },
        concat: {
            dist: {
                src: ['src/calculator.js', 'src/ui.js'],
                dest: 'build/client.js',
            },
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('build', ['jshint', 'concat']);
    grunt.registerTask('default', ['build']);
};