const test = require('ava');
const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);
const Utils = require('@oligibson/bitmate-generator').TestUtils;

let context;

test.before(() => {
  context = Utils.mock('app');
  context.composeWith = () => {};
  require('../../generators/app/index');
});

test('Call this.composeWith 4 times', () => {
  const spy = chai.spy.on(context, 'composeWith');
  Utils.call(context, 'composing', {server: 'none', modules: 'bower'});
  expect(spy).to.have.been.called.exactly(4);
});

test('Call this.composeWith 5 times', () => {
  const spy = chai.spy.on(context, 'composeWith');
  Utils.call(context, 'composing', {server: 'express', modules: 'bower'});
  expect(spy).to.have.been.called.exactly(5);
});
