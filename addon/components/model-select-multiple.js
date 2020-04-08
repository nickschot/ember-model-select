import { action } from '@ember/object';
import PowerSelectMultipleComponent from 'ember-power-select/components/power-select-multiple';

/**
 * {{model-select-multiple}} component. This is a wrapper around the normal model-select component. The same arguments apply.
 *
 * @class ModelSelectMultipleComponent
 */
export default class ModelSelectMultipleComponent extends PowerSelectMultipleComponent {

  @action
  change(option, select) {
    const suggestion = option.find(item => item.__isSuggestion__);

    if(suggestion){
      this.args.onCreate(suggestion.__value__, select);
    } else {
      this.args.onChange(option, select);
    }
  }
}
