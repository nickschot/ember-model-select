import { module } from 'qunit';
import test from 'ember-sinon-qunit/test-support/test';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { selectChoose } from 'ember-power-select/test-support';
import { clickTrigger, typeInSearch } from 'ember-power-select/test-support/helpers';
import defaultScenario from '../../../../dummy/mirage/scenarios/default';
import { timeout } from 'ember-concurrency';

module('Integration | Component | model-select', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders', async function(assert) {
    defaultScenario(this.server);

    await render(hbs`{{model-select modelName='user' labelProperty='name'}}`);
    await clickTrigger('.ember-model-select');

    assert.dom('.ember-power-select-option').exists({ count: 25 });
  });

  test('it respects the page size option', async function(assert) {
    assert.expect(1);
    defaultScenario(this.server);

    await render(hbs`{{model-select modelName='user' labelProperty='name' pageSize=10}}`);
    await clickTrigger('.ember-model-select');

    assert.dom('.ember-power-select-option').exists({ count: 10 });
  });

  test('it limits shown results based on search', async function(assert) {
    assert.expect(1);
    defaultScenario(this.server);

    await render(hbs`{{model-select modelName='user' labelProperty='name'}}`);
    await clickTrigger('.ember-model-select');
    await typeInSearch('asdasdasd');

    await settled();

    assert.dom('.ember-power-select-option').exists({ count: 1 });
  });

  test('it triggers the onChange hook when an option is selected', async function(assert) {
    assert.expect(1);
    defaultScenario(this.server);

    let handleClick = this.spy();
    this.actions = { handleClick };

    await render(hbs`{{model-select modelName='user' labelProperty='name' onChange=(action 'handleClick')}}`);
    await selectChoose('.ember-model-select', '.ember-power-select-option', 1);

    assert.ok(handleClick.calledOnce, 'onChange hook has been called');
  });

  test('it loads more options when scrolling down', async function(assert) {
    assert.expect(1);
    defaultScenario(this.server);

    await render(hbs`{{model-select modelName='user' labelProperty='name' renderInPlace=true}}`);
    await clickTrigger('.ember-model-select');

    this.element.querySelector('.ember-power-select-options').scrollTop = 999;

    //TODO: see if we can do this in a neater way
    await timeout(1);
    await settled();

    assert.dom('.ember-power-select-option').exists({ count: 50 });
  });
});
