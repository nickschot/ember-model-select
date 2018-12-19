import { module } from 'qunit';
import test from 'ember-sinon-qunit/test-support/test';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { selectChoose } from 'ember-power-select/test-support';
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

    assert.dom('.ember-power-select-option').exists({ count: 25 });
  });

  test('you can select multiple items', async function(assert) {
    assert.expect(2);

    defaultScenario(this.server);

    this.set('selected', null);

    await render(hbs`{{model-select-multiple modelName='user' labelProperty='name' selectedModel=selected onchange=(action (mut selected))}}`);

    await selectChoose('.ember-model-select-multiple-trigger', '.ember-power-select-option', 1);
    await selectChoose('.ember-model-select-multiple-trigger', '.ember-power-select-option', 2);

    assert.equal(this.selected.length, 2, 'two options have been selected');
    assert.dom('.ember-power-select-multiple-option').exists({ count: 2 });
  })
});
