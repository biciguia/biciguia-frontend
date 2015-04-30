module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: '<json:package.json>',
        qunit: {
            files: ['tests/tests.html']
        },
        //qunit: {
        //    all: {
        //        options: {
        //            urls: ['tests/index.html'],
        //            noGlobals: true
        //        }
        //    }
        //}
    });

    // Load plugin
    grunt.loadNpmTasks('grunt-contrib-qunit');

    // Task to run tests
    grunt.registerTask('test', [
        'qunit'
    ]);
};
