const path = require('path');

const gulp = require('gulp');
const del = require('del');
const filter = require('gulp-filter');
<% if (modules === 'systemjs') { -%>
  const rename = require('gulp-rename');
<% } -%>

const conf = require('../conf/gulp.conf');

gulp.task('clean', clean);
gulp.task('other', other);
<% if (server === 'express') { -%>
gulp.task('copy', copy);
<% } -%>

function clean() {
  return del([conf.paths.dist, conf.paths.tmp]);
}

function other() {
  const fileFilter = filter(file => file.stat.isFile());
<% if (modules === 'systemjs') { -%>
  const jsonFilter = path => {
    if (path.extname === '.json') {
      path.dirname = `src/${path.dirname}`;
    }
  };
  <% } -%>

  return gulp.src([
    path.join(conf.paths.client, '/**/*'),
<% if (modules === 'bower') { -%>
    path.join(`!${conf.paths.client}`, '/bower_components/**/*'),
<% } -%>
    path.join(`!${conf.paths.client}`, '/**/*.{<%- ignored %>}')
  ])
  .pipe(fileFilter)
    <% if (modules === 'systemjs') { -%>
  .pipe(rename(jsonFilter))
    <% } -%>
<% if (server === 'none') { -%>
  .pipe(gulp.dest(conf.paths.dist));
<% } else { -%>
  .pipe(gulp.dest(conf.path.dist('client')));
<% } -%>
}

<% if (server === 'express') { -%>
function copy(done) {
  gulp.src(conf.path.server('**/*'), {dot: true})
    .pipe(gulp.dest(conf.path.dist('server')));
  gulp.src('package.json', {dot: true})
    .pipe(gulp.dest(conf.paths.dist));
  done();
}
<% } -%>
