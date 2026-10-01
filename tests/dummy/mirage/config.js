import { applyEmberDataSerializers } from 'ember-cli-mirage';
import { createServer, Model } from 'miragejs';

export default function (config) {
  let finalConfig = {
    ...config,
    // Declared explicitly: ember-cli-mirage's discoverEmberDataModels reads the
    // schema off the model classes, which ember-data 5.9+ no longer allows.
    models: { user: Model, ...config.models },
    serializers: applyEmberDataSerializers(config.serializers),
    routes,
  };

  return createServer(finalConfig);
}

function routes() {
  this.get('/users');
  this.get('/users/:id');
  this.post('/users', 'user');

  this.passthrough();
}
