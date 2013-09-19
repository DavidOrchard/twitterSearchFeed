module.exports = function(grunt) {
  grunt.initConfig({
    shell: {
      'heroku': {
        command: 'git mv package.json package.json2; git add .; git commit -m "move package.json" --no-edit; git push heroku master; heroku ps:scale web=1; git reset HEAD~1 --hard'
      },
      'github': {
        command: 'git push -f github master;'
      },
      'removePhantomJSLocalStorage' : {
        command: 'rm ~/Library/Application\ Support/Ofi\ Labs/PhantomJS/http_localhost_0.localstorage'
      },
      'minify' : {
        command: 'node r.js -o baseUrl=./js name=mobile-main paths.jquery=lib/jquery paths.backbone=lib/backbone paths.underscore=lib/underscore  paths.backboneLocalStorage=lib/backbone.localStorage dir=dist removeCombined=true'
      }
    },
    jsdoc : {
      dist : {
        src: [
        'README.md',
        'js/*.js',
        'js/collections/**/*.js',
        'js/models/**/*.js',
        'js/routers/**/*.js',
        'js/templates/**/*.js',
        'js/views/**/*.js'
        ], 
        options: {
          destination: 'doc',
        }
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
      'js/views/**/*.js'
      ],
      options: {
        ignores: ['js/r.js', 'js/test/workInProgress/*','js/text.js'],
        '-W044': true, // extra escaping in command-line is needed
        '-W103': true, // proto is needed to remove localStorage complely from a model or collection
      }
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
      src : ['js/**/*.js', '!js/r.js', '!js/lib/**/*.js', '!js/test/**/*.js'],
      options : {
        specs : 'js/test/specs/spec.js',
        template: require('grunt-template-jasmine-requirejs'),
        templateOptions: {
          baseUrl: 'js',
          requireConfigFile: 'js/mobile-main.js'
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
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('unittest', ['jasmine']);

  grunt.registerTask('default', ['test']);
  grunt.registerTask('heroku', ['shell:heroku']);
  grunt.registerTask('github', ['shell:github']);
  grunt.registerTask('minify', ['shell:minify']);
  grunt.registerTask('ftest', ['shell:removePhantomJSLocalStorage', 'casperjs']);
  //  grunt.registerTask('test', ['jshint', 'jasmine']);
  grunt.registerTask('test', ['jshint', 'unittest', 'ftest']);
};