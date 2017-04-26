const path = require('path');
const test = require('ava');
const Utils = require('@oligibson/bitmate-generator').TestUtils;

let context;

test.before(() => {
  context = Utils.mock('app');
  require('../../generators/app/index');
  process.chdir(path.resolve(__dirname, '../../'));
});

test.beforeEach(() => {
  context.copyTemplate['gulpfile.js'] = null;
  context.copyTemplate['gulp_tasks/build.js'] = null;
  context.copyTemplate['gulp_tasks/styles.js'] = null;
});

test('Copy gulpfile.js', t => {
  Utils.call(context, 'writing', {server: 'none', client: 'react', modules: 'webpack'});
  t.true(context.copyTemplate['gulpfile.js'].length > 0);
});

test('Copy gulpfile.js, styles.js, nodemon.js and build.js', t => {
  const extensions = {js: 'js', css: 'css'};
  Utils.call(context, 'writing', {server: 'express', client: 'react', modules: 'systemjs', js: 'js', css: 'css', extensions});
  t.true(context.copyTemplate['gulpfile.js'].length > 0);
  t.true(context.copyTemplate['gulp_tasks/build.js'].length > 0);
  t.true(context.copyTemplate['gulp_tasks/styles.js'].length > 0);
  t.true(context.copyTemplate['gulp_tasks/nodemon.js'].length > 0);
});

test('Copy misc.js, gulpfile.js and partials.js', t => {
  const extensions = {js: 'js', css: 'css'};
  Utils.call(context, 'writing', {server: 'express', client: 'angular1', modules: 'systemjs', js: 'js', css: 'css', extensions});
  t.true(context.copyTemplate['gulp_tasks/misc.js'].length > 0);
  t.true(context.copyTemplate['gulpfile.js'].length > 0);
  t.true(context.copyTemplate['gulp_tasks/partials.js'].length > 0);
});
