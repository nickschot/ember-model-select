import ModelSelectSpinner from 'ember-model-select/components/model-select/spinner';

import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | model-select/spinner', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the spinner element', async function (assert) {
    await render(<template><ModelSelectSpinner /></template>);

    assert.dom('.ember-model-select__spinner').exists();
  });
});
