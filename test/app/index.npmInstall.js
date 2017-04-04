const spies = require('chai-spies');
const chai = require('chai');
const expect = chai.expect;
chai.use(spies);
const test = require('ava');
const Utils = require('@oligibson/bitmate-generator').TestUtils;

let context;

test.before(() => {
  context = Utils.mock('app');
  require('../../generators/app/index');
});

test('Call this.npmInstall', () => {
  const spy = chai.spy.on(context, 'npmInstall');
  Utils.call(context, 'install');
  expect(spy).to.have.been.called.once();
});
