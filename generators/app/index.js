/* eslint quote-props: 0 */  // --> OFF

const bitmate = require('@oligibson/bitmate-generator');
const conf = require('./conf');

module.exports = bitmate.Base.extend({
  configuring: {
    pkg() {
      const pkg = {
        devDependencies: {
          'del': '2.2.2',
          'gulp': 'gulpjs/gulp#4ed9a4a3275559c73a396eff7e1fde3824951ebb',
          'gulp-hub': 'frankwallis/gulp-hub#d461b9c700df9010d0a8694e4af1fb96d9f38bf4',
          'gulp-filter': '5.0.0',
          'gulp-util': '3.0.8'
        },
        scripts: {
          'build': 'gulp',
          'serve': 'gulp serve',
          'serve:dist': 'gulp serve:dist',
          'test': 'gulp test',
          'test:auto': 'gulp test:auto'
        }
      };

      if (this.options.modules !== 'webpack') {
        Object.assign(pkg.devDependencies, {
          'gulp-useref': '3.1.2',
          'lazypipe': '1.0.1',
          'gulp-postcss': '6.4.0',
          'autoprefixer': '6.7.7',
          'gulp-rev': '7.1.2',
          'gulp-rev-replace': '0.4.3',
          'gulp-sourcemaps': '2.5.1',
          'gulp-uglify': '2.1.2',
          'uglify-save-license': '0.4.1',
          'gulp-cssnano': '2.1.2',
          'gulp-htmlmin': '3.0.0'
        });
      }

      if (this.options.client === 'angular1') {
        Object.assign(pkg.devDependencies, {
          'gulp-angular-filesort': '1.1.1',
          'gulp-htmlmin': '3.0.0',
          'gulp-insert': '0.5.0',
          'gulp-ng-annotate': '2.0.0'
        });
        if (this.options.modules !== 'webpack') {
          Object.assign(pkg.devDependencies, {
            'gulp-angular-templatecache': '2.0.0'
          });
        }
      }

      if (this.options.css === 'scss') {
        Object.assign(pkg.devDependencies, {
          'gulp-sass': '3.1.0'
        });
      }

      if (this.options.css === 'less') {
        Object.assign(pkg.devDependencies, {
          'gulp-less': '3.3.0'
        });
      }

      if (this.options.css === 'styl') {
        Object.assign(pkg.devDependencies, {
          'gulp-stylus': '2.6.0'
        });
      }

      this.mergeJson('package.json', pkg);
    },

    gulp() {
      this.fs.copyTpl(
        this.templatePath('conf'),
        this.destinationPath('conf'),
        this.options
      );
    },

    babel() {
      if (this.options.js === 'babel') {
        this.mergeJson('.babelrc', {
          presets: ['es2015'],
          env: {
            test: {
              plugins: ['istanbul']
            }
          }
        });

        if (this.options.modules === 'webpack' && this.options.client !== 'angular1' && this.options.client !== 'angular2') {
          this.mergeJson('.babelrc', {
            env: {
              production: {
                presets: [
                  ['es2015', {modules: false}]
                ]
              }
            }
          });
        }
      }
    }

  },

  composing() {
    this.composeWith('bitmate-browsersync', {options: this.options}, {
      local: require.resolve('@oligibson/generator-bitmate-browsersync/generators/app')
    });
    this.composeWith('bitmate-karma', {options: this.options}, {
      local: require.resolve('@oligibson/generator-bitmate-karma/generators/app')
    });
    this.composeWith(`bitmate-${this.options.modules}`, {options: this.options}, {
      local: require.resolve(`@oligibson/generator-bitmate-${this.options.modules}/generators/app`)
    });
    this.composeWith('bitmate-eslint', {options: this.options}, {
      local: require.resolve('@oligibson/generator-bitmate-eslint/generators/app')
    });
  },

  writing() {
    this.copyTemplate(
      'gulpfile.js',
      'gulpfile.js',
      conf(this.options)
    );

    if (this.options.modules !== 'webpack') {
      this.copyTemplate(
        'gulp_tasks/build.js',
        'gulp_tasks/build.js',
        this.options
      );

      this.copyTemplate(
        'gulp_tasks/styles.js',
        'gulp_tasks/styles.js',
        this.options
      );
    }

    const extensions = this.getExtensions(this.options);
    const ignored = [this.options.css, extensions.js];

    if (this.options.client !== 'react') {
      ignored.push('html');
    }

    this.copyTemplate(
      'gulp_tasks/misc.js',
      'gulp_tasks/misc.js',
      Object.assign({}, this.options, {ignored: ignored.join(',')})
    );

    if (this.options.client === 'angular1' && this.options.modules !== 'webpack') {
      this.copyTemplate(
        'gulp_tasks/partials.js',
        'gulp_tasks/partials.js',
        this.options
      );
    }
  },

  install() {
    this.npmInstall();
  }
});
