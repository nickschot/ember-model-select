'use strict';

module.exports = {
  name: require('./package').name,

  contentFor(type, config) {
    let emberPowerSelect = this.addons.find((a) => a.name === 'ember-power-select');
    return emberPowerSelect.contentFor(type, config);
  }
};
