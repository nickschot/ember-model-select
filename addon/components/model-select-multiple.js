import PowerSelectMultipleComponent from 'ember-power-select/components/power-select-multiple';
import layout from '../templates/components/model-select-multiple';

/**
 * {{model-select-multiple}} component. This is a wrapper around the normal model-select component. The same arguments apply.
 *
 * @class ModelSelectMultipleComponent
 */
export default PowerSelectMultipleComponent.extend({
  layout,

  actions: {
    change(option, select){
      const suggestion = option.find(item => item.__isSuggestion__);

      if(suggestion){
        this.get('onCreate')(suggestion.__value__, select);
      } else {
        this.get('onChange')(option, select);
      }
    }
  }
});
