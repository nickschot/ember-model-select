import PowerSelectMultipleComponent from 'ember-power-select/components/power-select-multiple';
import layout from '../templates/components/model-select-multiple';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';

export default PowerSelectMultipleComponent.extend({
  layout,

  triggerClass: fallbackIfUndefined('ember-model-select-multiple-trigger')
});
