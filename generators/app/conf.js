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

module.exports = function gulpfileConf(generatorOptions) {
  const options = Object.assign({}, generatorOptions);

  if (options.modules === 'bower') {
    options.buildTask = series(parallel('inject', 'other'), 'build');
  }

  if (options.modules === 'bower') {
    options.serveTask = series('inject', 'watch', 'browsersync');
  }

  if (options.modules === 'bower') {
    options.testTask = series('scripts', 'karma:single-run');
    options.testAutoTask = series('watch', 'karma:auto-run');
  }

  ['buildTask', 'serveTask', 'testTask', 'testAutoTask'].forEach(task => {
    options[task] = gulpTasksToString(options[task]);
  });

  return options;
};
