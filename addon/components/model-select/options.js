import OptionsComponent from 'ember-power-select/components/power-select/options';
import layout from '../../templates/components/model-select/options';

import { and } from '@ember/object/computed';

export default OptionsComponent.extend({
  layout,

  _infiniteScroll: and('infiniteModel', 'infiniteScroll')
});
