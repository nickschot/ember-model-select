import EmberRouter from '@ember/routing/router';
import config from 'dummy/config/environment';

// The routes ember-cli-addon-docs' `AddonDocsRouter` and `docsRoute` set up,
// defined here so the app still boots when ember-cli-addon-docs isn't
// installed (it doesn't support Ember 7 yet).
export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('docs', function () {
    this.route('usage');
    this.route('quickstart');

    this.route('components', function () {
      this.route('model-select');
      this.route('model-select-multiple');
    });

    this.route('api', function () {
      this.route('item', { path: '/*path' });
    });
  });
  this.route('not-found', { path: '/*path' });
});
