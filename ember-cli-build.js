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
    ...undeprecateInjectOptions(),
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

// Ember 7 removed `inject` from `@ember/service`, which ember-infinity still
// uses. Following https://deprecations.emberjs.com/id/importing-inject-from-ember-service
// we rewrite those imports to `service` in app code and in v2 addons (bundled
// by ember-auto-import). `service` only exists from Ember 4.1, so this is only
// enabled where it's needed.
function undeprecateInjectOptions() {
  const emberSourceDir = fs.realpathSync(
    path.join(__dirname, 'node_modules', 'ember-source')
  );
  const emberMajor = parseInt(
    JSON.parse(fs.readFileSync(path.join(emberSourceDir, 'package.json')))
      .version,
    10
  );
  if (emberMajor < 7) {
    return {};
  }

  const plugin = require.resolve(
    'babel-plugin-undeprecate-inject-from-at-ember-service'
  );
  return {
    babel: {
      plugins: [plugin],
    },
    autoImport: {
      webpack: {
        module: {
          rules: [
            {
              test: (filename) =>
                filename.endsWith('.js') &&
                filename.includes('node_modules') &&
                !filename.includes('/ember-source/'),
              use: {
                loader: 'babel-loader-8',
                options: { plugins: [plugin] },
              },
            },
          ],
        },
      },
    },
  };
}
