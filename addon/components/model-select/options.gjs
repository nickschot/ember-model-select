import { concat } from '@ember/helper';
import InfinityLoader from 'ember-infinity/components/infinity-loader';
import ModelSelectSpinner from 'ember-model-select/components/model-select/spinner';
import PowerSelectOptions from 'ember-power-select/components/power-select/options';

// eslint-disable-next-line ember/no-computed-properties-in-native-classes
import { computed } from '@ember/object';
import Component from '@glimmer/component';

export default class OptionsComponent extends Component {
  @computed('args.{infiniteScroll,infiniteModel,select.loading}')
  get showLoader() {
    return (
      this.args.infiniteScroll &&
      this.args.infiniteModel &&
      !this.args.select.loading
    );
  }


  <template><ul role="listbox" ...attributes>
  <li>
  <PowerSelectOptions
    @loadingMessage={{@loadingMessage}}
    @select={{@select}}
    @options={{@options}}
    @groupIndex={{@groupIndex}}
    @optionsComponent={{@optionsComponent}}
    @extra={{@extra}}
    @highlightOnHover={{@highlightOnHover}}
    @groupComponent={{@groupComponent}}
    as |option select|
  >
    {{yield option select}}
  </PowerSelectOptions>
  </li>

  {{#if this.showLoader}}
  <li>
    <InfinityLoader
      @infinityModel={{@infiniteModel}}
      @hideOnInfinity={{true}}
      @scrollable={{concat "#ember-basic-dropdown-content-" @select.uniqueId}}
    >
      <ModelSelectSpinner />
    </InfinityLoader>
  </li>
  {{/if}}
  </ul></template>
}
