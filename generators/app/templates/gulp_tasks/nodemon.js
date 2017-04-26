const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const conf = require('../conf/gulp.conf');

gulp.task('nodemon', nodemonSyncServe);
gulp.task('nodemon:dist', nodemonSyncDist);

function nodemonSyncServe(done) {
  let started = false;
  return nodemon({
    script: conf.path.server('app.js'),
    env: {NODE_ENV: 'development'}
  }).on('start', () => {
    if (!started) {
      done();
      started = true;
    }
  });
}

function nodemonSyncDist(done) {
  let started = false;
  return nodemon({
    script: conf.path.dist('server/app.js'),
    env: {NODE_ENV: 'production'}
  }).on('start', () => {
    if (!started) {
      done();
      started = true;
    }
  });
}
