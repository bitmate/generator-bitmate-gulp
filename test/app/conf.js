const test = require('ava');

const gulpfileConf = require('../../generators/app/conf');

test('gulpfileConf with angular1/webpack', t => {
  const expected = {
    modules: 'webpack',
    client: 'angular1',
    buildTask: `gulp.series(gulp.parallel('other', 'webpack:dist'))`,
    serveTask: `gulp.series('webpack:watch', 'watch', 'browsersync')`,
    testTask: `gulp.series('karma:single-run')`,
    testAutoTask: `gulp.series('karma:auto-run')`
  };
  const result = gulpfileConf({modules: expected.modules, client: expected.client});
  t.deepEqual(result, expected);
});

test('gulpfileConf with angular1/systemjs', t => {
  const expected = {
    modules: 'systemjs',
    client: 'angular1',
    buildTask: `gulp.series('partials', gulp.parallel('systemjs', 'systemjs:html', 'styles', 'other'), 'build')`,
    serveTask: `gulp.series(gulp.parallel('scripts', 'styles'), 'watch', 'browsersync')`,
    testTask: `gulp.series('karma:single-run')`,
    testAutoTask: `gulp.series('karma:auto-run')`
  };
  const result = gulpfileConf({modules: expected.modules, client: expected.client});
  t.deepEqual(result, expected);
});

test('gulpfileConf with react/bower', t => {
  const expected = {
    modules: 'bower',
    client: 'react',
    buildTask: `gulp.series(gulp.parallel('inject', 'other'), 'build')`,
    serveTask: `gulp.series('inject', 'watch', 'browsersync')`,
    testTask: `gulp.series('scripts', 'karma:single-run')`,
    testAutoTask: `gulp.series('watch', 'karma:auto-run')`
  };
  const result = gulpfileConf({modules: expected.modules, client: expected.client});
  t.deepEqual(result, expected);
});

