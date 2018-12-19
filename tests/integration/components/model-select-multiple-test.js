import { module } from 'qunit';
import test from 'ember-sinon-qunit/test-support/test';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { clickTrigger } from 'ember-power-select/test-support/helpers';
import defaultScenario from '../../../../dummy/mirage/scenarios/default';

module('Integration | Component | model-select-multiple', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders', async function(assert) {
    assert.expect(1);

    defaultScenario(this.server);

    await render(hbs`{{model-select-multiple modelName='user' labelProperty='name'}}`);
    await clickTrigger();

    await settled();

    assert.dom('.ember-power-select-option').exists({ count: 25 });
  });
});
