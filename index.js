'use strict';

module.exports = {
  name: require('./package').name,

  included() {
    let app = this._findHost();
    if (!app.__emberModelSelectIncludedInvoked) {
      app.__emberModelSelectIncludedInvoked = true;

      this._super.included.apply(this, arguments);

      // ember-cli 5 removed registry.availablePlugins; project.addonPackages
      // lists the app's addons in every supported ember-cli version.
      const addons =
        app.project?.addonPackages || app.registry?.availablePlugins || {};
      let hasSass = !!addons['ember-cli-sass'];

      // Don't include the precompiled css file if the user uses a supported CSS preprocessor
      if (!hasSass) {
        app.import('vendor/ember-model-select.css');
      }
    }
  },

  contentFor(type, config) {
    let emberPowerSelect = this.addons.find(
      (a) => a.name === 'ember-power-select'
    );
    return emberPowerSelect.contentFor(type, config);
  },
};
