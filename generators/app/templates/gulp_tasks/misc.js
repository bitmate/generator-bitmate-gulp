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
    path.join(`!${conf.paths.client}`, '/**/*.{<%- ignored %>}')
  ])
  .pipe(fileFilter)
    <% if (modules === 'systemjs') { -%>
  .pipe(rename(jsonFilter))
    <% } -%>
  .pipe(gulp.dest(conf.paths.dist));
}