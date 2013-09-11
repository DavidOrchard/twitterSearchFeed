module.exports = function(grunt) {
  grunt.initConfig({
    shell: {
      'heroku': {
        command: 'git mv package.json package.json2; git add .; git commit -m "move package.json" --no-edit; git push heroku master; heroku ps:scale web=1; git reset HEAD~1 --hard'
      },
      'github': {
        command: 'git push -f github master;'
      },
      'jsdoc' : {
        command: 'jsdoc js -r -c jsdocconf.json -d doc'
      },
      'removePhantomJSLocalStorage' : {
        command: 'rm ~/Library/Application\ Support/Ofi\ Labs/PhantomJS/http_localhost_0.localstorage'
      }
    },
    jshint: {
      all: [
      'Gruntfile.js',
      'js/*.js',
      'js/collections/**/*.js',
      'js/models/**/*.js',
      'js/routers/**/*.js',
      'js/templates/**/*.js',
      'js/test/**/*.js',
      'js/views/**/*.js',
      ],
    },
    casperjs: {
      options: {
        async: {
          parallel: false
        }
      },
      files: ['js/test/FTest.js']
    },
    jasmine : {
      src : ['js/**/*.js', '!js/lib/**/*.js', '!js/test/FTest.js', '!js/test/workInProgress/*'],
      options : {
        specs : 'js/test/specs/spec.js',
        template: require('grunt-template-jasmine-requirejs'),
        templateOptions: {
          baseUrl: 'js',
          requireConfigFile: 'js/mobile-main.js'
        }      
      }
    },
    requirejs: {
      production: {
        options: {
          baseUrl: "js",
          mainConfigFile: "js/mobile-main.js",
          out: "build/twitterfeed-require-min.js"
        }
      }
    },
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: ['js/**/*.js'],
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-casperjs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-shell');

  //  grunt.registerTask('test', ['jshint', 'jasmine']);
  grunt.registerTask('test', ['jasmine']);
  grunt.registerTask('jshint', ['jshint']);
  grunt.registerTask('jsdoc', ['shell:jsdoc']);

  grunt.registerTask('default', ['test']);
  grunt.registerTask('heroku', ['shell:heroku']);
  grunt.registerTask('github', ['shell:github']);
  grunt.registerTask('ftest', ['shell:removePhantomJSLocalStorage', 'casperjs']);
};