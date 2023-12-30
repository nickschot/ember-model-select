import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import sinon from 'sinon';
import { render, settled, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { selectChoose, selectSearch } from 'ember-power-select/test-support';
import {
  clickTrigger,
  typeInSearch,
} from 'ember-power-select/test-support/helpers';
import defaultScenario from '../../../../dummy/mirage/scenarios/default';
import { timeout } from 'ember-concurrency';
import { isEmpty } from '@ember/utils';

module('Integration | Component | model-select', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders', async function (assert) {
    assert.expect(1);

    defaultScenario(this.server);

    await render(hbs`{{model-select modelName='user' labelProperty='name'}}`);
    await clickTrigger('.ember-model-select');

    assert.dom('.ember-power-select-option').exists({ count: 25 });
  });

  test('it respects the page size option', async function (assert) {
    assert.expect(1);

    defaultScenario(this.server);

    await render(
      hbs`{{model-select modelName='user' labelProperty='name' pageSize=10}}`
    );
    await clickTrigger('.ember-model-select');

    assert.dom('.ember-power-select-option').exists({ count: 10 });
  });

  test('it limits shown results based on search', async function (assert) {
    assert.expect(1);

    defaultScenario(this.server);

    await render(
      hbs`{{model-select modelName='user' labelProperty='name' searchProperty="filter" searchEnabled=true}}`
    );
    await clickTrigger('.ember-model-select');
    await typeInSearch('asdasdasd');

    assert
      .dom('.ember-power-select-option--no-matches-message')
      .exists({ count: 1 });
  });

  test('it respects the search* and query parameters', async function (assert) {
    assert.expect(2);
    let requestNr = 0;

    this.server.get('/users', function (schema) {
      const queryParams = this.request.queryParams;

      if (requestNr === 1) {
        const expectedQueryParams = {
          'filter[id_not_in]': '1,2,3',
          'filter[name]': 'asdasdasd',
          'page[number]': '1',
          'page[size]': '25',
        };

        assert.deepEqual(
          queryParams,
          expectedQueryParams,
          "query parameters don't match the expected ones"
        );
      } else {
        const expectedQueryParams = {
          'filter[id_not_in]': '1,2,3',
          'page[number]': '1',
          'page[size]': '25',
        };

        assert.deepEqual(
          queryParams,
          expectedQueryParams,
          "query parameters don't match the expected ones"
        );
      }

      requestNr++;

      // for this test we don't need to actuallyy filter anything, so just return all
      return schema.users.all();
    });

    await render(
      hbs`{{model-select modelName='user' labelProperty='name' searchProperty="filter" searchKey="name" query=(hash filter=(hash id_not_in="1,2,3")) searchEnabled=true}}`
    );
    await clickTrigger('.ember-model-select');
    await typeInSearch('asdasdasd');
  });

  test('it triggers the onChange hook when an option is selected', async function (assert) {
    assert.expect(1);

    defaultScenario(this.server);

    let handleClick = sinon.spy();
    this.actions = { handleClick };

    await render(
      hbs`{{model-select modelName='user' labelProperty='name' onChange=(action 'handleClick')}}`
    );
    await selectChoose('.ember-model-select', '.ember-power-select-option', 1);

    assert.ok(handleClick.calledOnce, 'onChange hook has been called');
  });

  test('it loads more options when scrolling down', async function (assert) {
    assert.expect(1);

    defaultScenario(this.server);

    await render(
      hbs`{{model-select modelName='user' labelProperty='name' renderInPlace=true}}`
    );
    await clickTrigger('.ember-model-select');

    this.element.querySelector('.ember-power-select-options').scrollTop = 999;

    //TODO: see if we can do this in a neater way
    await timeout(500);
    await settled();

    assert.dom('.ember-power-select-option').exists({ count: 50 });
  });

  test('it does not load more options when scrolling down and infiniteLoading is false', async function (assert) {
    assert.expect(1);

    defaultScenario(this.server);

    await render(
      hbs`{{model-select modelName='user' labelProperty='name' renderInPlace=true infiniteScroll=false}}`
    );
    await clickTrigger('.ember-model-select');

    this.element.querySelector('.ember-power-select-options').scrollTop = 999;

    await settled();

    assert.dom('.ember-power-select-option').exists({ count: 25 });
  });

  test('it shows an Add "<term>"... option when withCreate is true', async function (assert) {
    assert.expect(2);

    await render(
      hbs`{{model-select modelName='user' labelProperty='name' searchProperty="filter" withCreate=true searchEnabled=true}}`
    );
    await selectSearch('.ember-model-select', 'test');

    assert.dom('.ember-power-select-option').exists({ count: 1 });
    assert.dom('.ember-power-select-option').hasText(`Add "test"...`);
  });

  test('it fires the onCreate hook when the create option is selected', async function (assert) {
    assert.expect(2);

    let handleCreate = sinon.spy();
    this.actions = { handleCreate };

    await render(
      hbs`{{model-select modelName='user' labelProperty='name' searchProperty="filter" withCreate=true onCreate=(action 'handleCreate') searchEnabled=true}}`
    );
    await selectSearch('.ember-model-select', 'test');
    await selectChoose('.ember-model-select', '.ember-power-select-option', 1);

    assert.ok(handleCreate.calledOnce, 'onCreate hook has been called once');
    assert.ok(
      handleCreate.calledWith('test'),
      'onCreate hook has been called with the correct argument'
    );
  });

  test('it can clear the selected item', async function (assert) {
    assert.expect(2);

    defaultScenario(this.server);

    this.set('selected', null);

    await render(
      hbs`{{model-select modelName='user' labelProperty='name' allowClear=true selectedModel=this.selected onChange=(fn (mut this.selected))}}`
    );
    await selectChoose('.ember-model-select', '.ember-power-select-option', 1);

    assert.notOk(isEmpty(this.selected), 'selected item has been set');

    await click('.ember-power-select-clear-btn');

    assert.equal(this.selected, null, 'selected item has been cleared');
  });

  test('it accepts an id passed to `selectedModel`', async function (assert) {
    assert.expect(2);

    defaultScenario(this.server);

    this.set('selected', '1');
    await render(
      hbs`{{model-select modelName='user' labelProperty='name' allowClear=true selectedModel=this.selected onChange=(fn (mut this.selected))}}`
    );
    assert
      .dom('.ember-power-select-selected-item')
      .hasText(this.server.schema.users.find(1).name);

    this.set('selected', 2);
    await settled();
    assert
      .dom('.ember-power-select-selected-item')
      .hasText(this.server.schema.users.find(2).name);
  });

  test('it supports block form', async function (assert) {
    assert.expect(2);

    defaultScenario(this.server);

    await render(
      hbs`<ModelSelect @modelName="user" @labelProperty="name" as |model|>Test: {{model.name}}</ModelSelect>`
    );
    await clickTrigger('.ember-model-select');

    assert.dom('.ember-power-select-option').exists({ count: 25 });
    assert
      .dom('.ember-power-select-option:first-child')
      .hasText(`Test: ${this.server.schema.users.first().name}`);
  });
});
