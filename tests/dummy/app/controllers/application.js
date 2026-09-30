import Controller from '@ember/controller';
import { macroCondition, dependencySatisfies } from '@embroider/macros';

export default class ApplicationController extends Controller {
  // ember-power-select < 8 renders the ember-basic-dropdown wormhole through
  // contentFor. Since 8.0 apps need to render it themselves.
  renderWormhole = macroCondition(
    dependencySatisfies('ember-power-select', '>=8.0.0')
  )
    ? true
    : false;
}
