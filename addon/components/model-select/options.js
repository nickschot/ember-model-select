import OptionsComponent from 'ember-power-select/components/power-select/options';
import layout from '../../templates/components/model-select/options';

import { computed } from '@ember/object';

export default OptionsComponent.extend({
  layout,

  showLoader: computed('infiniteScroll', 'infiniteModel', 'select.loading', function(){
    return this.get('infiniteScroll') && this.get('infiniteModel') && !this.get('select.loading') ;
  })
});
