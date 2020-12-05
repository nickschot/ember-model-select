import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import sinon from 'sinon';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';
import {selectChoose, selectSearch} from 'ember-power-select/test-support';
import { clickTrigger, removeMultipleOption } from 'ember-power-select/test-support/helpers';
import defaultScenario from '../../../../dummy/mirage/scenarios/default';

module('Integration | Component | model-select-multiple', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders', async function(assert) {
    assert.expect(1);

    defaultScenario(this.server);

    this.noop = () => {};

    await render(hbs`{{model-select-multiple modelName='user' labelProperty='name' onChange=this.noop}}`);
    await clickTrigger();

    assert.dom('.ember-power-select-option').exists({ count: 25 });
  });

  test('you can select multiple items', async function(assert) {
    assert.expect(2);

    defaultScenario(this.server);

    this.set('selected', null);

    await render(hbs`{{model-select-multiple modelName='user' labelProperty='name' selectedModel=selected onChange=(action (mut selected))}}`);

    await selectChoose('.ember-model-select-multiple-trigger', '.ember-power-select-option', 1);
    await selectChoose('.ember-model-select-multiple-trigger', '.ember-power-select-option', 2);

    assert.equal(this.selected.length, 2, 'two options have been selected');
    assert.dom('.ember-power-select-multiple-option').exists({ count: 2 });
  });

  test('you can unselect items', async function(assert) {
    assert.expect(2);

    defaultScenario(this.server);

    this.set('selected', null);

    await render(hbs`{{model-select-multiple modelName='user' labelProperty='name' selectedModel=selected onChange=(action (mut selected))}}`);

    await selectChoose('.ember-model-select-multiple-trigger', '.ember-power-select-option', 1);
    await selectChoose('.ember-model-select-multiple-trigger', '.ember-power-select-option', 2);

    await removeMultipleOption('.ember-model-select-multiple-trigger', this.selected[0].get('name'));

    assert.equal(this.selected.length, 1, 'one option has been selected');
    assert.dom('.ember-power-select-multiple-option').exists({ count: 1 });
  });

  test('it shows an Add "<term>"... option when withCreate is true', async function(assert) {
    assert.expect(2);

    await render(hbs`{{model-select-multiple modelName='user' labelProperty='name' searchProperty="filter" withCreate=true searchEnabled=true}}`);
    await selectSearch('.ember-model-select-multiple-trigger', 'test');

    assert.dom('.ember-power-select-option').exists({ count: 1 });
    assert.dom('.ember-power-select-option').hasText(`Add "test"...`);
  });

  test('it fires the onCreate hook when the create option is selected', async function(assert) {
    assert.expect(2);

    let handleCreate = sinon.spy();
    this.actions = { handleCreate };

    await render(hbs`{{model-select-multiple modelName='user' labelProperty='name' searchProperty="filter" withCreate=true onCreate=(action 'handleCreate') searchEnabled=true}}`);
    await selectSearch('.ember-model-select-multiple-trigger', 'test');
    await selectChoose('.ember-model-select-multiple-trigger', '.ember-power-select-option', 1);

    assert.ok(handleCreate.calledOnce, 'onCreate hook has been called once');
    assert.ok(handleCreate.calledWith('test'), 'onCreate hook has been called with the correct argument');
  });


  test('it supports block form', async function(assert) {
    assert.expect(2);

    defaultScenario(this.server);

    await render(hbs`{{#model-select-multiple modelName='user' labelProperty='name' as |model|}}Test: {{model.name}}{{/model-select-multiple}}`);
    await clickTrigger('.ember-model-select');

    assert.dom('.ember-power-select-option').exists({ count: 25 });
    assert.dom('.ember-power-select-option:first-child').hasText('Test: Kathryne Raynor');
  });
});
