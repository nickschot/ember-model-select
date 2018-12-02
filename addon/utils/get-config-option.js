import { getWithDefault } from '@ember/object';
import config from 'ember-get-config';

/**
 *  Get's the passed configuration option from the `ember-model-select`
 *  environment key or the passed default if the config option is not set.
 *
 * @param key
 * @param defaultValue
 * @returns {*}
 */
export default function getConfigOption(key, defaultValue) {
  return getWithDefault(config, `ember-model-select.${key}`, defaultValue);
}
