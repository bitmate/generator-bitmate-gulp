const gulp = require('gulp');
const filter = require('gulp-filter');
const useref = require('gulp-useref');
const lazypipe = require('lazypipe');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const htmlmin = require('gulp-htmlmin');
const sourcemaps = require('gulp-sourcemaps');
const uglifySaveLicense = require('uglify-save-license');
<% if (client === 'angular1' && modules === 'bower') { -%>
const inject = require('gulp-inject');
<% } -%>
<% if (client === 'angular1') { -%>
const ngAnnotate = require('gulp-ng-annotate');
<% } -%>

const conf = require('../conf/gulp.conf');

gulp.task('build', build);

function build() {
<% if (client === 'angular1' && modules === 'bower') { -%>
  const partialsInjectFile = gulp.src(conf.path.tmp('templateCacheHtml.js'), {read: false});
  const partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: conf.paths.tmp,
    addRootSlash: false
  };

<% } -%>
  const htmlFilter = filter(conf.path.tmp('*.html'), {restore: true});
  const jsFilter = filter(conf.path.tmp('**/*.js'), {restore: true});
  const cssFilter = filter(conf.path.tmp('**/*.css'), {restore: true});

  return gulp.src(conf.path.tmp('/index.html'))
<% if (client === 'angular1' && modules === 'bower') { -%>
    .pipe(inject(partialsInjectFile, partialsInjectOptions))
<% } -%>
    .pipe(useref({}, lazypipe().pipe(sourcemaps.init, {loadMaps: true})))
    .pipe(jsFilter)
<% if (client === 'angular1') { -%>
    .pipe(ngAnnotate())
<% } -%>
    .pipe(uglify({preserveComments: uglifySaveLicense})).on('error', conf.errorHandler('Uglify'))
    .pipe(rev())
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(cssnano())
    .pipe(rev())
    .pipe(cssFilter.restore)
    .pipe(revReplace())
    .pipe(sourcemaps.write('maps'))
    .pipe(htmlFilter)
    .pipe(htmlmin())
    .pipe(htmlFilter.restore)
<% if (server === 'none') { -%>
    .pipe(gulp.dest(conf.path.dist()));
<% } else { -%>
    .pipe(gulp.dest(conf.path.dist('client')));
<% } -%>
}
