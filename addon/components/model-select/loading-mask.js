import Component from '@ember/component';
import layout from '../../templates/components/model-select/loading-mask';

import { or } from '@ember/object/computed';

export default Component.extend({
  layout,
  tagName: '',

  // public

  /**
   * Passed in when used in an ember-power-select as either a before or afterOptionsComponent
   *
   * @argument select
   * @type Object
   */
  select: null,

  /**
   * Boolean whether or not the loading-mask should show
   *
   * @argument loading
   * @type Boolean
   */
  loading: false,

  _loading: or('loading','select.loading')
});
