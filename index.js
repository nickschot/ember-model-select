'use strict';

module.exports = {
  name: 'ember-model-select',

  contentFor(type, config) {
    let emberPowerSelect = this.addons.find((a) => a.name === 'ember-power-select');
    return emberPowerSelect.contentFor(type, config);
  }
};
