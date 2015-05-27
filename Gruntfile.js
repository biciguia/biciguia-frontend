module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        blanket_qunit: {
            all: {
                options: {
                    urls: ['tests/index.html?coverage=true&gruntReport'],
                }
            }
        },
    });

    // Load plugin
    grunt.loadNpmTasks('grunt-blanket-qunit');

    // Task to run tests
    grunt.registerTask('test', [
        'blanket_qunit'
    ]);
};
