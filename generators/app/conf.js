/* eslint prefer-spread: 0 */
'use strict';

const _ = require('lodash');

function series() {
  const array = [];
  array.push.apply(array, arguments);
  array.type = 'series';
  return array;
}

function parallel() {
  const array = [];
  array.push.apply(array, arguments);
  array.type = 'parallel';
  return array;
}

function gulpTasksToString(tasks) {
  let result;
  if (_.isArray(tasks)) {
    result = `gulp.${tasks.type}(${tasks.map(gulpTasksToString).join(', ')})`;
  } else {
    result = `'${tasks}'`;
  }
  return result;
}

module.exports = function (generatorOptions) {
  const options = Object.assign({}, generatorOptions);

  if (options.modules === 'webpack') {
    options.buildTask = options.server === 'none' ? series(parallel('other', 'webpack:dist')) : series(parallel('other', 'webpack:dist', 'copy'));
  } else if (options.modules === 'bower') {
    options.buildTask = options.server === 'none' ? series(parallel('inject', 'other'), 'build') : series(parallel('inject', 'other', 'copy'), 'build');
  } else {
    options.buildTask = series(parallel('systemjs', 'systemjs:html', 'styles', 'other'), 'build');
  }

  if (options.client === 'angular1' && options.modules !== 'webpack') {
    options.buildTask.unshift('partials');
  }

  if (options.modules === 'bower') {
    options.serveTask = options.server === 'none' ? series('inject', 'watch', 'browsersync') : series('inject', 'watch', 'browsersync', 'nodemon');
  } else if (options.modules === 'webpack') {
    options.serveTask = options.server === 'none' ? series('webpack:watch', 'watch', 'browsersync') : series('webpack:watch', 'watch', 'browsersync', 'nodemon');
  } else {
    options.serveTask = series(parallel('scripts', 'styles'), 'watch', 'browsersync');
  }

  if (options.modules === 'bower') {
    options.testTask = options.server === 'none' ? series('scripts', 'karma:single-run') : series('scripts', 'karma:single-run', 'mocha:single-run');
    options.testAutoTask = options.server === 'none' ? series('watch', 'karma:auto-run') : series('watch', 'karma:auto-run', 'mocha:auto-run');
  } else {
    options.testTask = options.server === 'none' ? series('karma:single-run') : series('karma:single-run', 'mocha:single-run');
    options.testAutoTask = options.server === 'none' ? series('karma:auto-run') : parallel('karma:auto-run', 'mocha:auto-run');
  }

  ['buildTask', 'serveTask', 'testTask', 'testAutoTask'].forEach(task => {
    options[task] = gulpTasksToString(options[task]);
  });

  return options;
};

