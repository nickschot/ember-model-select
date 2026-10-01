import { hasMany } from '@ember-data/model';
import Module from 'ember-cli-addon-docs/models/module';

// ember-cli-addon-docs 4.x declares these relationships without an inverse, and
// `components` holds `component` records (a subclass of `class`). ember-data 4.12
// asserts on that, which breaks every docs page. Upstream fixed this in 6.x, which
// requires Ember 4.4+ while the dummy app still runs on Ember 3.28.
// eslint-disable-next-line ember/no-classic-classes
export default Module.extend({
  classes: hasMany('class', { async: false, inverse: null }),
  components: hasMany('class', {
    async: false,
    inverse: null,
    polymorphic: true,
  }),
});
