module.exports = function (grunt) {
    grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),


            clean: {
                'default': ['dist/*', 'tmp'],
                'bower': ['client/bower_components/*'],
                'tmp': 'tmp'
            },

            copy: {
                server: {
                    expand: true,
                    cwd: "server",
                    src: '**',
                    dest: "dist/"
                },

                client: {
                    expand: true,
                    cwd: "client",
                    src: '**/*.{html,json}',
                    dest: "dist/static"
                }
            },

            less: {
                development: {
                    options: {
                        compress: true
                    },
                    files: {
                        "dist/static/lib/css/frontend.css": "client/style/frontend.less"
                    }
                }
            },

            "bower-install-simple": {
                dev: {}
            },

            bower: {
                dev: {
                    options: {
                        expand: true,
                        packageSpecific: {
                            'react': {
                                files: [
                                    'react-with-addons.js'
                                ]
                            }
                        }
                    },
                    dest: 'dist/static/lib/',
                    js_dest: 'dist/static/lib/js/',
                    css_dest: 'dist/static/lib/css/',
                    fonts_dest: 'dist/static/lib/fonts/', //covers font types ['svg','eot', 'ttf', 'woff', 'woff2', 'otf']
                    images_dest: 'dist/static/lib/images/', //covers image types ['jpeg', 'jpg', 'gif', 'png']
                }
            },

            concat: {
                options: {
                    separator: '\n\n;\n\n'
                },

                'default': {
                    src: [
                        'client/js/calendar/*.{jsx,js}',
                        'client/js/calendar/calendar.js',
                        'client/js/calendar-ui/*.{jsx,js}',
                        'client/js/tm-calendar.jsx',
                        'client/js/global.js'
                    ],
                    dest: 'tmp/calendar.jsx.js'
                },

                'test': {
                    'src': 'test/spec/**/*.{jsx,js}',
                    'dest': 'tmp/test.jsx.js'
                }
            },

            babel: {
                dist: {
                    files: {
                        'tmp/calendar.jsx.js': 'tmp/calendar.jsx.js',
                    }
                },
                dev: {
                    files: {
                        'dist/static/js/calendar.js': 'tmp/calendar.jsx.js'
                    }
                },
                test: {
                    files: {
                        'tmp/test-babel.jsx.js': 'tmp/test.jsx.js'
                    }
                }
            },

            uglify: {
                calendar: {
                    files: {
                        'dist/static/js/calendar.min.js': 'tmp/calendar.jsx.js'
                    }
                }
            },

            injector: {
                options: {
                    relative: true,
                    addRootSlash: false,
                    min: true
                },
                dependencies: {
                    files: {
                        'dist/static/index.html': [
                            'dist/static/lib/js/jquery/**/*',
                            'dist/static/lib/**/*',

                            'dist/static/js/**/*',
                            'dist/static/css/**/*'
                        ]
                    }
                }
            },


            express: {
                options: {
                    port: process.env.PORT || 9000,
                    debug: 5858,
                    delay: 1500
                },
                dev: {
                    options: {
                        script: 'dist/app.js',
                        debug: 5858
                    }
                },
                prod: {
                    options: {
                        script: 'dist/app.js'
                    }
                }
            },

            watch: {
                prod: {
                    files: [
                        '{client,server}/**/*.{js,json,jsx,less,html}'
                    ],
                    tasks: ['build', 'express:prod'],
                    options: {
                        livereload: true,
                        nospawn: true //Without this option specified express won't be reloaded
                    }
                },
                dev: {
                    files: [
                        '{client,server}/**/*.{js,json,jsx,less,html}'
                    ],
                    tasks: ['build:dev', 'express:dev'],
                    options: {
                        livereload: true,
                        nospawn: true //Without this option specified express won't be reloaded
                    }
                },
                dev2: {
                    files: [
                        '{client,server}/**/*.{js,json,jsx,less,html}'
                    ],
                    tasks: ['build:dev2', 'express:dev'],
                    options: {
                        livereload: true,
                        nospawn: true //Without this option specified express won't be reloaded
                    }
                }
            },

            jasmine: {
                calendar: {
                    src: 'dist/static/js/**/*.js',
                    options: {
                        specs: 'tmp/test-babel.jsx.js',
                        vendor: 'dist/static/lib/**/*.js',
                        helper: 'node_modules/jasmine-react/lib/jasmine_react.js'
                    }
                }
            }
        }
    );

    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks("grunt-bower-install-simple");
    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-injector');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-redis');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask('build', ['copy', 'less', 'bower-install-simple', 'bower', 'concat', 'concat:test', 'babel:dist', 'bable:test', 'uglify', 'injector', 'clean:tmp']);
    grunt.registerTask('build:dev', ['copy', 'less', 'bower-install-simple', 'bower', 'concat', 'babel:dev', 'injector', 'clean:tmp']);
    grunt.registerTask('build:test', ['build:dev', 'concat:test', 'babel:test']);

    grunt.registerTask('test', ['clean', 'clean:bower', 'build', 'jasmine']);
    grunt.registerTask('test:dev', ['clean', 'build:test', 'jasmine']);
    grunt.registerTask('test:fast', ['build:test', 'jasmine']);

    grunt.registerTask('serv', ['clean', 'build', 'express:prod', 'watch:prod']);
    grunt.registerTask('serv:dev', ['clean', 'build:dev', 'express:dev', 'watch:dev']);

};