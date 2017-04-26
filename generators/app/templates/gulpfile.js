const gulp = require('gulp');
const HubRegistry = require('gulp-hub');
const browserSync = require('browser-sync');

const conf = require('./conf/gulp.conf');

// Load some files into the registry
const hub = new HubRegistry(['gulp_tasks/*.js']);

// Tell gulp to use the tasks just loaded
gulp.registry(hub);

<% if (modules === 'bower') { -%>
gulp.task('inject', gulp.series(gulp.parallel('styles', 'scripts'), 'inject'));
<% } -%>
gulp.task('build', <%- buildTask %>);
gulp.task('test', <%- testTask %>);
gulp.task('test:auto', <%- testAutoTask %>);
gulp.task('serve', <%- serveTask %>);
<% if (server === 'express') { -%>
gulp.task('serve:dist', gulp.series('default', 'browsersync:dist', 'nodemon:dist'));
<% } else { -%>
gulp.task('serve:dist', gulp.series('default', 'browsersync:dist'));
<% } -%>
gulp.task('default', gulp.series('clean', 'build'));
gulp.task('watch', watch);
function reloadBrowserSync(cb) {
  browserSync.reload();
  cb();
}

function watch(done) {
<% if (modules === 'bower') { -%>
  gulp.watch([
    conf.path.client('index.html'),
    'bower.json'
  ], gulp.parallel('inject'));
  <% } -%>
  <% if (client !== 'react' && modules !== 'webpack') { -%>
  <%   if (modules !== 'systemjs') { -%>
  gulp.watch(conf.path.client('app/**/*.html'), gulp.series('partials', reloadBrowserSync));
  <%   } else { -%>
  gulp.watch(conf.path.client('**/*.html'), reloadBrowserSync);
  <%   } -%>
  <% } else if (modules === 'webpack') {-%>
  gulp.watch(conf.path.tmp('index.html'), reloadBrowserSync);
  <% } else { -%>
  gulp.watch(conf.path.client('index.html'), reloadBrowserSync);
  <% } -%>
  <% if (modules !== 'webpack') { -%>
  gulp.watch([
    <%   if (css !== 'css') { -%>
  conf.path.client('**/*.<%- css %>'),
  <%   } -%>
  conf.path.client('**/*.css')
  ], gulp.series('styles'));
  <% } -%>
  <% if (modules === 'bower') { -%>
  gulp.watch(conf.path.client('**/*.<%- extensions.js %>'), gulp.series('inject'));
  <% } else if (modules === 'systemjs') { -%>
  gulp.watch(conf.path.client('**/*.<%- extensions.js %>'), gulp.series('scripts'));
  <% } -%>
  done();
}
