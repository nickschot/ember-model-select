import PowerSelect from 'ember-power-select/components/power-select';
import layout from '../../templates/components/model-select/power-select';

export default PowerSelect.extend({
  layout,

  init(){
    this._super(...arguments);

    if(this.get('withCreate')){
      this.set('mustShowNoMessages', false);
    }
  }
});
