import PowerSelectMultipleComponent from 'ember-power-select/components/power-select-multiple';
import layout from '../templates/components/model-select-multiple';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';

/**
 * {{model-select-multiple}} component. This is a wrapper around the normal model-select component. The same arguments apply.
 *
 * @class ModelSelectMultipleComponent
 */
export default PowerSelectMultipleComponent.extend({
  layout,

  triggerClass: fallbackIfUndefined('ember-model-select-multiple-trigger'),

  actions: {
    change(option, select){
      const suggestion = option.find(item => item.__isSuggestion__);

      if(suggestion){
        this.get('oncreate')(suggestion.__value__, select);
      } else {
        this.get('onchange')(option, select);
      }
    }
  }
});
