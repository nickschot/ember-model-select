import { getWithDefault } from '@ember/object';
import config from 'ember-get-config';

/**
 *  Get's the passed configuration option from the `ember-model-select`
 *  environment key or the passed default if the config option is not set.
 *
 * @function getConfigOption
 * @param {String} key
 * @param {*} defaultValue
 * @return {*} The config option or the default value
 * @private
 * @hide
 */
export default function getConfigOption(key, defaultValue) {
  return getWithDefault(config, `ember-model-select.${key}`, defaultValue);
}
