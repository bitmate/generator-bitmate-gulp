'use strict';

const bitmate = require('bitmate-generator');
const conf = require('./conf');

module.exports = bitmate.Base.extend({
    configuring: {
        pkg() {
            const pkg = {
                devDependencies: {
                    'del': '^2.0.2',
                    'gulp': 'gulpjs/gulp#4ed9a4a3275559c73a396eff7e1fde3824951ebb',
                    'gulp-hub': 'frankwallis/gulp-hub#d461b9c700df9010d0a8694e4af1fb96d9f38bf4',
                    'gulp-filter': '^4.0.0',
                    'gulp-util': '^3.0.7'
                },
                scripts: {
                    'serve': 'gulp serve',
                    'test': 'gulp test'
                }
            };

            if (this.options.client === 'angular1') {
                Object.assign(pkg.devDependencies, {
                    'gulp-angular-filesort': '^1.1.1',
                    'gulp-htmlmin': '^1.3.0',
                    'gulp-insert': '^0.5.0',
                    'gulp-ng-annotate': '^1.1.0'
                });
                if (this.options.modules !== 'webpack') {
                    Object.assign(pkg.devDependencies, {
                        'gulp-angular-templatecache': '^1.8.0'
                    });
                }
            }

            if (this.options.css === 'scss') {
                Object.assign(pkg.devDependencies, {
                    'gulp-sass': '^2.1.1'
                });
            }

            if (this.options.css === 'less') {
                Object.assign(pkg.devDependencies, {
                    'gulp-less': '^3.0.5'
                });
            }

            if (this.options.css === 'styl') {
                Object.assign(pkg.devDependencies, {
                    'gulp-stylus': '^2.4.0'
                });
            }

            this.mergeJson('package.json', pkg);
        }
    },

    writing() {
        this.copyTemplate(
            'gulpfile.js',
            'gulpfile.js',
            conf(this.options)
        )
    },

    install() {
        this.npmInstall();
    }
});