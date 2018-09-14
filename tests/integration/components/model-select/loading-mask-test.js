import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | model-select/loading-mask', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders nothing when not loading', async function(assert) {
    await render(hbs`{{model-select/loading-mask}}`);

    assert.equal(this.element.textContent.trim(), '');
    assert.dom('.ember-model-select__loading-mask').doesNotExist();
    assert.dom('.ember-model-select__loading-mask__mask').doesNotExist();
    assert.dom('.ember-model-select__spinner').doesNotExist();
  });

  test('it shows the mask and spinner when loading', async function(assert) {
    await render(hbs`{{model-select/loading-mask loading=true}}`);

    assert.dom('.ember-model-select__loading-mask').exists();
    assert.dom('.ember-model-select__loading-mask__mask').exists();
    assert.dom('.ember-model-select__spinner').exists();
  });

  test('it shows the mask and spinner when power select loading', async function(assert) {
    await render(hbs`{{model-select/loading-mask select=(hash loading=true)}}`);

    assert.dom('.ember-model-select__loading-mask').exists();
    assert.dom('.ember-model-select__loading-mask__mask').exists();
    assert.dom('.ember-model-select__spinner').exists();
  });
});
