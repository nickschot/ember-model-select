'use strict';

// ember-concurrency ships the babel transform for `task(async () => {})` at
// different paths: v4+ exports it, v2.3/v3 keep it in lib/.
function resolveEmberConcurrencyTransform() {
  for (let path of [
    'ember-concurrency/async-arrow-task-transform',
    'ember-concurrency/lib/babel-plugin-transform-ember-concurrency-async-tasks',
  ]) {
    try {
      return require.resolve(path, { paths: [__dirname] });
    } catch (e) {
      // try the next location
    }
  }
  throw new Error(
    'ember-model-select requires ember-concurrency 2.3.0 or higher to be installed.'
  );
}

module.exports = {
  name: require('./package').name,

  options: {
    babel: {
      plugins: [resolveEmberConcurrencyTransform()],
    },
  },

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
};
