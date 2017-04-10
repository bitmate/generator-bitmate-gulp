const test = require('ava');
const Utils = require('@oligibson/bitmate-generator').TestUtils;

let context;

test.before(() => {
  context = Utils.mock('app');
  require('../../generators/app/index');
});

test.beforeEach(() => {
  context.mergeJson['.babelrc'] = {};
});

test(`Configure .babelrc when js is 'babel' and modules is 'webpack'`, t => {
  const expected = {
    presets: ['es2015'],
    env: {
      production: {presets: [['es2015', {modules: false}]]},
      test: {plugins: ['istanbul']}
    }
  };
  Utils.call(context, 'configuring.babel', {js: 'babel', modules: 'webpack'});
  t.deepEqual(context.mergeJson['.babelrc'], expected);
});

test(`Configure .babelrc when js is 'babel' and modules is 'systemjs'`, t => {
  const expected = {
    presets: ['es2015'],
    env: {
      test: {plugins: ['istanbul']}
    }
  };
  Utils.call(context, 'configuring.babel', {js: 'babel', modules: 'systemjs'});
  t.deepEqual(context.mergeJson['.babelrc'], expected);
});

test(`Configure .babelrc when js is 'js'`, t => {
  Utils.call(context, 'configuring.babel', {js: 'js'});
  t.deepEqual(context.mergeJson['.babelrc'], {});
});
