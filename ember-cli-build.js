'use strict';

const fs = require('fs');
const path = require('path');
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  // ember-power-select 8+ is a v2 addon, which ships its styles in the package
  // instead of the app tree, so the dummy app's style imports differ per version.
  // (Its package.json is read from disk as v2 addons don't export it.)
  const powerSelectDir = fs.realpathSync(
    path.join(__dirname, 'node_modules', 'ember-power-select')
  );
  const powerSelectMajor = parseInt(
    JSON.parse(fs.readFileSync(path.join(powerSelectDir, 'package.json')))
      .version,
    10
  );
  const powerSelectStyles =
    powerSelectMajor >= 8
      ? ['tests/dummy/app/styles/power-select/v2', 'node_modules']
      : [
          'tests/dummy/app/styles/power-select/v1',
          path.join(powerSelectDir, 'app/styles'),
          path.join(
            path.dirname(
              // a dependency of ember-power-select < 8, not of this addon
              // eslint-disable-next-line n/no-missing-require
              require.resolve('ember-basic-dropdown/package.json', {
                paths: [powerSelectDir],
              })
            ),
            'app/styles'
          ),
        ];

  const app = new EmberAddon(defaults, {
    sassOptions: {
      includePaths: powerSelectStyles,
    },
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
