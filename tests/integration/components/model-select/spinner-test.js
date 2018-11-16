import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | model-select/spinner', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders the spinner element', async function(assert) {
    await render(hbs`{{model-select/spinner}}`);

    assert.dom('.ember-model-select__spinner').exists();
  });
});
