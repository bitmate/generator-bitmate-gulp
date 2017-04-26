const test = require('ava');

const gulpfileConf = require('../../generators/app/conf');

test('gulpfileConf with angular1/webpack', t => {
  const expected = {
    server: 'none',
    modules: 'webpack',
    client: 'angular1',
    buildTask: `gulp.series(gulp.parallel('other', 'webpack:dist'))`,
    serveTask: `gulp.series('webpack:watch', 'watch', 'browsersync')`,
    testTask: `gulp.series('karma:single-run')`,
    testAutoTask: `gulp.series('karma:auto-run')`
  };
  const result = gulpfileConf({server: expected.server, modules: expected.modules, client: expected.client});
  t.deepEqual(result, expected);
});

test('gulpfileConf with express/angular1/webpack', t => {
  const expected = {
    server: 'express',
    modules: 'webpack',
    client: 'angular1',
    buildTask: `gulp.series(gulp.parallel('other', 'webpack:dist', 'copy'))`,
    serveTask: `gulp.series('webpack:watch', 'watch', 'browsersync', 'nodemon')`,
    testTask: `gulp.series('karma:single-run', 'mocha:single-run')`,
    testAutoTask: `gulp.parallel('karma:auto-run', 'mocha:auto-run')`
  };
  const result = gulpfileConf({server: expected.server, modules: expected.modules, client: expected.client});
  t.deepEqual(result, expected);
});

test('gulpfileConf with angular1/systemjs', t => {
  const expected = {
    server: 'none',
    modules: 'systemjs',
    client: 'angular1',
    buildTask: `gulp.series('partials', gulp.parallel('systemjs', 'systemjs:html', 'styles', 'other'), 'build')`,
    serveTask: `gulp.series(gulp.parallel('scripts', 'styles'), 'watch', 'browsersync')`,
    testTask: `gulp.series('karma:single-run')`,
    testAutoTask: `gulp.series('karma:auto-run')`
  };
  const result = gulpfileConf({server: expected.server, modules: expected.modules, client: expected.client});
  t.deepEqual(result, expected);
});

test('gulpfileConf with react/bower', t => {
  const expected = {
    server: 'none',
    modules: 'bower',
    client: 'react',
    buildTask: `gulp.series(gulp.parallel('inject', 'other'), 'build')`,
    serveTask: `gulp.series('inject', 'watch', 'browsersync')`,
    testTask: `gulp.series('scripts', 'karma:single-run')`,
    testAutoTask: `gulp.series('watch', 'karma:auto-run')`
  };
  const result = gulpfileConf({server: expected.server, modules: expected.modules, client: expected.client});
  t.deepEqual(result, expected);
});

test('gulpfileConf with express/react/bower', t => {
  const expected = {
    server: 'express',
    modules: 'bower',
    client: 'react',
    buildTask: `gulp.series(gulp.parallel('inject', 'other', 'copy'), 'build')`,
    serveTask: `gulp.series('inject', 'watch', 'browsersync', 'nodemon')`,
    testTask: `gulp.series('scripts', 'karma:single-run', 'mocha:single-run')`,
    testAutoTask: `gulp.series('watch', 'karma:auto-run', 'mocha:auto-run')`
  };
  const result = gulpfileConf({server: expected.server, modules: expected.modules, client: expected.client});
  t.deepEqual(result, expected);
});

