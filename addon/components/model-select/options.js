import Component from '@glimmer/component';

export default class OptionsComponent extends Component {
  get showLoader() {
    return (
      this.args.infiniteScroll &&
      this.args.infiniteModel &&
      !this.args.select.loading
    );
  }
}
