import { getWithDefault } from '@ember/object';
import config from 'ember-get-config';

/**
 *
 * @param key
 * @param defaultValue
 * @returns {*}
 */
export default function getConfigOption(key, defaultValue) {
  return getWithDefault(config, `ember-model-select.${key}`, defaultValue);
}
