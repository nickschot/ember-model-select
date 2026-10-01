'use strict';

const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

module.exports = async function () {
  return {
    usePnpm: true,
    scenarios: [
      {
        name: 'power-select-4',
        env: {
          // ember-basic-dropdown 3 (used by ember-power-select 4) can only find
          // its test destination through the application template wrapper.
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'application-template-wrapper': true,
          }),
        },
        npm: {
          devDependencies: {
            'ember-source': '~3.28.12',
            'ember-power-select': '^4.0.0',
          },
          ember: {
            edition: 'classic',
          },
        },
      },
      {
        name: 'power-select-5',
        npm: {
          devDependencies: {
            'ember-source': '~3.28.12',
            'ember-power-select': '^5.0.0',
          },
        },
      },
      {
        name: 'power-select-6',
        npm: {
          devDependencies: {
            'ember-source': '~3.28.12',
            'ember-power-select': '^6.0.0',
          },
        },
      },
      {
        name: 'power-select-7',
        npm: {
          devDependencies: {
            'ember-source': '~3.28.12',
            'ember-power-select': '^7.0.0',
          },
        },
      },
      {
        name: 'power-select-8.10',
        npm: {
          devDependencies: {
            'ember-power-select': '~8.10.0',
            'ember-basic-dropdown': '^8.0.0',
            'ember-concurrency': '^4.0.0',
          },
        },
      },
      {
        name: 'power-select-8',
        npm: {
          devDependencies: {
            'ember-power-select': '^8.11.0',
            'ember-basic-dropdown': '^8.9.0',
            'ember-concurrency': '^4.0.4',
          },
        },
      },
      {
        name: 'power-select-9',
        npm: {
          devDependencies: {
            '@ember/test-helpers': '^5.0.0',
            'ember-basic-dropdown': '^9.0.0',
            'ember-concurrency': '^5.1.0',
            'ember-power-select': '^9.0.0',
            'ember-qunit': '^9.0.0',
          },
        },
      },
      {
        name: 'ember-lts-3.28',
        npm: {
          devDependencies: {
            'ember-source': '~3.28.12',
          },
        },
      },
      {
        name: 'ember-lts-4.4',
        npm: {
          devDependencies: {
            'ember-source': '~4.4.0',
          },
        },
      },
      {
        name: 'ember-lts-4.8',
        npm: {
          devDependencies: {
            'ember-source': '~4.8.0',
          },
        },
      },
      {
        name: 'ember-lts-4.12',
        npm: {
          devDependencies: {
            'ember-source': '~4.12.0',
          },
        },
      },
      {
        name: 'ember-release',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('release'),
          },
        },
      },
      {
        name: 'ember-beta',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('beta'),
          },
        },
      },
      {
        name: 'ember-canary',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('canary'),
          },
        },
      },
      {
        name: 'ember-default-with-jquery',
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'jquery-integration': true,
          }),
        },
        npm: {
          devDependencies: {
            '@ember/jquery': '^1.1.0',
            'ember-source': '~3.28.12',
          },
        },
      },
      {
        name: 'ember-classic',
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'application-template-wrapper': true,
            'default-async-observers': false,
            'template-only-glimmer-components': false,
          }),
        },
        npm: {
          devDependencies: {
            'ember-source': '~3.28.12',
          },
          ember: {
            edition: 'classic',
          },
        },
      },
      embroiderSafe(),
      embroiderOptimized(),
    ],
  };
};
