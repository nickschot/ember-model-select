import Component from '@ember/component';
import layout from '../../templates/components/model-select/options';

import { and } from '@ember/object/computed';

export default Component.extend({
  layout,

  _infiniteScroll: and('infiniteModel', 'infiniteScroll')
});
