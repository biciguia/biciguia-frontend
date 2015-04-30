module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        qunit: {
            all: {
                options: {
                    urls: ['tests/index.html'],
                    noGlobals: true
                }
            }
        }
    });

    // Load plugin
    grunt.loadNpmTasks('grunt-contrib-qunit');

    // Task to run tests
    grunt.registerTask('test', [
        'qunit'
    ]);
};
