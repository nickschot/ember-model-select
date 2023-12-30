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
}
