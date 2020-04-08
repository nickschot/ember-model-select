import Component from '@ember/component';
import layout from '../../templates/components/model-select/options';

import { computed } from '@ember/object';

export default Component.extend({
  layout,

  tagName: '',

  showLoader: computed('infiniteScroll', 'infiniteModel', 'select.loading', function(){
    return this.get('infiniteScroll') && this.get('infiniteModel') && !this.get('select.loading') ;
  })
});
