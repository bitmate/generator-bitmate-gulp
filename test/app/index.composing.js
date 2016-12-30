const test = require('ava');
const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);
const Utils = require('bitmate-generator').TestUtils;

let context;

test.before(() => {
  context = Utils.mock('app');
  context.composeWith = () => {};
  require('../../generators/app/index');
});

test('Call this.composeWith 4 times', () => {
  const spy = chai.spy.on(context, 'composeWith');
  Utils.call(context, 'composing', {modules: 'bower'});
  expect(spy).to.have.been.called.exactly(4);
});
