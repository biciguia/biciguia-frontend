module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    // task for running tests with blanket+phantomjs
    blanket_qunit: {
      test: {
        options: {
          urls: ['tests/tests.html?coverage=true&gruntReport'],
        }
      }
    },
    copy: {
      buildLibs: {
        files: [
        { src: 'bower_components/lodash/lodash.min.js',
          dest: 'build/assets/js/lodash.min.js' },
        { src: 'bower_components/jquery/dist/jquery.min.js',
          dest: 'build/assets/js/jquery.min.js' },
        { src: 'bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.min.css',
          dest: 'build/assets/css/material-design-iconic-font.min.css' },
        { src: 'bower_components/d3/d3.min.js',
          dest: 'build/assets/js/d3.min.js' },
        { src: 'bower_components/spin.js/spin.min.js',
          dest: 'build/assets/js/spin.min.js' },
        { src: 'bower_components/leaflet/dist/leaflet.js',
          dest: 'build/assets/js/leaflet.min.js' },
        { src: 'bower_components/Leaflet.contextmenu/dist/leaflet.contextmenu.js',
          dest: 'build/assets/js/leaflet.contextmenu.min.js' },
        { src: 'bower_components/leaflet.elevation/dist/Leaflet.Elevation-0.0.2.min.js',
          dest: 'build/assets/js/Leaflet.Elevation-0.0.2.min.js' },
        { src: 'bower_components/mapbox.js/mapbox.standalone.js',
          dest: 'build/assets/js/mapbox.standalone.min.js' },

        { src: 'bower_components/pure/pure-min.css',
          dest: 'build/assets/css/pure.min.css' },
        { src: 'bower_components/leaflet.elevation/dist/Leaflet.Elevation-0.0.2.css',
          dest: 'build/assets/css/Leaflet.Elevation-0.0.2.min.css' },
        { src: 'bower_components/mapbox.js/mapbox.standalone.css',
          dest: 'build/assets/css/mapbox.standalone.min.css' },
        ],
      },
      // and for tests.html
      testLibs: {
        files: [
        { src: 'bower_components/qunit/qunit/qunit.js',
          dest: 'tests/files/qunit.js' },
        { src: 'bower_components/qunit/qunit/qunit.css',
          dest: 'tests/files/qunit.css' },
        { src: 'node_modules/grunt-blanket-qunit/reporter/grunt-reporter.js',
          dest: 'tests/files/grunt-reporter.js' },
        { src: 'bower_components/blanket/dist/qunit/blanket.js',
          dest: 'tests/files/blanket.js' },
        { src: 'bower_components/sinon-js/sinon.js',
          dest: 'tests/files/sinon.js' },
        ],
      },
    },
    uglify: {
      options: {
        ASCIIOnly: true,
        screwIE8: true
      },
      libs: {
        files: [
        { expand: true, cwd: 'libs/', src: '*.js', dest: 'build/libs/' },
        { expand: true, cwd: 'assets/js/', src: '*.js', dest: 'build/assets/js/' },
        ]
      },
      thirdparty: {
        files: [
        { src: 'bower_components/Leaflet.MakiMarkers/Leaflet.MakiMarkers.js',
          dest: 'build/assets/js/Leaflet.MakiMarkers.min.js' },
        ]
      }
    },
    cssmin: {
      assets: {
        files: [{ expand: true, cwd: 'assets/css/', src: '*.css', dest: 'build/assets/css/' }]
      },
      thirdparty: {
        files: [
        { src: 'bower_components/leaflet/dist/leaflet.css',
          dest: 'build/assets/css/leaflet.min.css' },
        { src: 'bower_components/Leaflet.contextmenu/dist/leaflet.contextmenu.css',
          dest: 'build/assets/css/leaflet.contextmenu.min.css' },
        ]
      }
    },
    htmlmin: {
      index: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeIgnored: true
        },
        files: {'build/index.html': 'index.html'}
      }
    },
    // generate minified overlays
    shell: {
      minifyOverlays: {
        command: [
          'mkdir -p build/assets/overlays',
          'cd build/assets/overlays',
          'node ../../../tools/minify.js'
        ].join('&&')
      },
      cleanBuild: {
        command: [
          'rm -rf build tests/files',
          'rm -f assets/overlays',
        ].join('&&')
      },
      copyStaticFiles: {
        command: [
          'cp -r bower_components/mapbox.js/images build/assets/css/',
          'cp -r bower_components/material-design-iconic-font/dist/fonts build/assets/'
        ].join('&&')
      }
    }
  });

  // Load plugin
  grunt.loadNpmTasks('grunt-blanket-qunit');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('test', [
      'copy:testLibs', 'copy:buildLibs', 'uglify:thirdparty', 'blanket_qunit:test'
  ]);

  grunt.registerTask('clean', [
      'shell:cleanBuild'
  ]);

  grunt.registerTask('build', [
      'copy:buildLibs', 'shell:minifyOverlays',
      'uglify:libs', 'uglify:thirdparty', 'cssmin:assets', 'cssmin:thirdparty',
      'htmlmin:index', 'shell:copyStaticFiles'
  ]);
};

