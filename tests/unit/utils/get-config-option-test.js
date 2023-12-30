import getConfigOption from 'dummy/utils/get-config-option';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Utility | get-config-option', function (hooks) {
  setupTest(hooks);

  test('it returns the passed default when the global option is not set', function (assert) {
    assert.expect(1);

    assert.equal(getConfigOption('perPageParam', 'foo'), 'foo');
  });
});
