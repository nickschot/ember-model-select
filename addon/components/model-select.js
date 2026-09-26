import Component from '@glimmer/component';

import { isEmpty } from '@ember/utils';
// eslint-disable-next-line ember/no-computed-properties-in-native-classes
import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { assign } from '@ember/polyfills';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { timeout } from 'ember-concurrency';
import { restartableTask, dropTask } from 'ember-concurrency';
import getConfigOption from '../utils/get-config-option';

/**
 * The main component.
 *
 * NOTE: apart from the arguments listed explicitely here, ember-model-select supports the full
 * ember-power-select API which can be found: https://ember-power-select.com/docs/api-reference
 *
 *
 * @class ModelSelectComponent
 * @extends {Component}
 *
 * @yield {object} model
 */
export default class ModelSelectComponent extends Component {
  @service store;

  /**
   * Source to query, either an ember data model or the store
   * useful when using ember-data-has-many-query.
   *
   * @argument source
   * @type {Model}
   * @default
   */
  get source() {
    return this.args.source || this.store;
  }

  @service infinity;

  /**
   * Name of the ember-data model.
   *
   * @argument modelName
   * @type {String}
   * @required
   */

  /**
   * Selected model or its id.
   *
   * @argument selectedModel
   * @type {EmberData.Model|String|Number}
   */

  /**
   * Name of property on model to use as label.
   *
   * @argument labelProperty
   * @type {String}
   * @required
   */

  /**
   * Name of the key in which search queries are passed.
   *
   * @argument searchProperty
   * @type {String}
   * @default 'search'
   */
  get searchProperty() {
    return (
      this.args.searchProperty || getConfigOption('searchProperty', 'search')
    );
  }

  /**
   * Optional key to search on. Will default to `labelProperty` if unset.
   *
   * @argument searchKey
   * @type {String}
   */

  /**
   * Whether to start loading models when dropdown is opened (but no search is entered, yet).
   *
   * @argument loadDefaultOptions
   * @type {Boolean}
   * @default true
   */

  /**
   * Whether or not to use infinite scroll.
   *
   * @argument infiniteScroll
   * @type {Boolean}
   * @default true
   */
  get infiniteScroll() {
    return this.args.infiniteScroll === undefined || this.args.infiniteScroll;
  }

  /**
   * The amount of records loaded at once when `infiniteScroll` is enabled.
   *
   * @argument pageSize
   * @type {Number}
   * @default 25
   */
  get pageSize() {
    return this.args.pageSize || getConfigOption('pageSize', 25);
  }

  /**
   * Additional parameters for data query. Can be used to sort etc.
   *
   * @argument query
   * @type {Object}
   */

  /**
   * Debounce duration in ms used when searching.
   *
   * @argument debounceDuration
   * @type {Number}
   * @default 250
   */
  get debounceDuration() {
    return (
      this.args.debounceDuration || getConfigOption('debounceDuration', 250)
    );
  }

  /**
   * Whether to allow creation of entries in case search yields no results.
   *
   * @argument withCreate
   * @type {Boolean}
   * @default false
   */

  /**
   * Function which outputs the label to be shown for the create option when `withCreate` is set to `true`.
   *
   * @argument buildSuggestion
   * @type {Function}
   * @default 'Add "${term}"...'
   */

  /**
   * Ember-infinity argument.
   *
   * See: https://github.com/ember-infinity/ember-infinity#json-requestresponse-customization
   *
   * @argument perPageParam
   * @type {String}
   * @default 'page[size]'
   */
  get perPageParam() {
    return (
      this.args.perPageParam || getConfigOption('perPageParam', 'page[size]')
    );
  }

  /**
   * Ember-infinity argument.
   *
   * See: https://github.com/ember-infinity/ember-infinity#json-requestresponse-customization
   *
   * @argument pageParam
   * @type {String}
   * @default 'page[number]'
   */
  get pageParam() {
    return this.args.pageParam || getConfigOption('pageParam', 'page[number]');
  }

  /**
   * Ember-infinity argument.
   *
   * See: https://github.com/ember-infinity/ember-infinity#json-requestresponse-customization
   *
   * @argument totalPagesParam
   * @type {String}
   * @default 'meta.total'
   */
  get totalPagesParam() {
    return (
      this.args.totalPagesParam ||
      getConfigOption('totalPagesParam', 'meta.total')
    );
  }

  /**
   * Ember-power-select-option.
   *
   * See: https://ember-power-select.com/docs/api-reference/
   *
   * @argument optionsComponent
   * @type {Component}
   * @default 'model-select/options'
   */
  get optionsComponent() {
    return this.args.optionsComponent || 'model-select/options';
  }

  /**
   * Called upon creation of new entry.
   *
   * @argument onCreate
   * @type {Action}
   */

  @tracked _options;
  @tracked model;

  // constructor() {
  //   super(...arguments);

  // assert('{{model-select}} requires a valid `modelName`.', !isEmpty(this.get('modelName')));
  // assert('{{model-select}} requires a valid `labelProperty`.', !isEmpty(this.get('labelProperty')));
  // assert('{{model-select}} requires `debounceDuration` to be an Integer.', !isEmpty(this.get('debounceDuration')) && Number.isInteger(this.get('debounceDuration')));
  // assert('{{model-select}} `searchProperty` cannot be undefined or empty', !isEmpty(this.get('searchProperty')));
  // }

  /**
   * The model selected by the user
   *
   * @property _selectedModel
   * @private
   */
  // eslint-disable-next-line ember/require-computed-property-dependencies, ember/no-computed-properties-in-native-classes
  @computed('args.{selectedModel,modelName}')
  get _selectedModel() {
    const selectedModel = this.args.selectedModel;

    if (
      typeof selectedModel === 'number' ||
      typeof selectedModel === 'string'
    ) {
      const id = parseInt(selectedModel, 10);
      return !isNaN(id)
        ? this.findRecord.perform(this.args.modelName, id)
        : null;
    } else {
      return selectedModel;
    }
  }

  @dropTask
  *findRecord(modelName, id) {
    // this wrapper task is requried to avoid the following error upon fast changes
    // of selectedModel:
    // Error: Assertion Failed: You attempted to remove a function listener which
    // did not exist on the instance, which means you may have attempted to remove
    // it before it was added.
    return yield this.store.findRecord(modelName, id);
  }

  @restartableTask
  *searchModels(term, options, initialLoad = false) {
    let createOption;

    if (this.args.withCreate && term) {
      createOption = {
        __value__: term,
        __isSuggestion__: true,
      };
      createOption[this.args.labelProperty] = this.args.buildSuggestion
        ? this.args.buildSuggestion(term)
        : `Add "${term}"...`;
      this._options = A([createOption]);
    }

    if (!initialLoad) {
      yield timeout(this.debounceDuration);
    }

    yield this.loadModels.perform(term, createOption);
  }

  @restartableTask
  *loadModels(term, createOption) {
    // query might be an EmptyObject/{{hash}}, make it a normal Object
    const query = assign({}, this.args.query);

    if (term) {
      const searchProperty = this.searchProperty;
      const searchKey = this.args.searchKey || this.args.labelProperty;

      const searchObj = get(query, `${searchProperty}`) || {};
      set(searchObj, searchKey, term);
      set(query, searchProperty, searchObj);
    }

    let _options;

    if (this.infiniteScroll) {
      if (this._selectedModel) {
        this._options = null;
      }

      // ember-infinity configuration
      query.perPage = this.pageSize;

      query.perPageParam = this.perPageParam;
      query.pageParam = this.pageParam;
      query.totalPagesParam = this.totalPagesParam;

      this.model = this.infinity.model(this.args.modelName, query);

      _options = yield this.model;
    } else {
      set(query, this.pageParam, 1);
      set(query, this.perPageParam, this.pageSize);

      _options = yield this.source.query(this.args.modelName, query);
    }

    if (createOption) {
      _options.unshiftObjects([createOption]);
    }

    this._options = _options;
  }

  loadDefaultOptions() {
    if (
      this.args.loadDefaultOptions === undefined ||
      this.args.loadDefaultOptions
    ) {
      this.searchModels.perform(null, null, true);
    }
  }

  @action
  onOpen() {
    this.loadDefaultOptions();

    if (this.args.onOpen) {
      this.args.onOpen(...arguments);
    }
  }

  @action
  onInput(term) {
    if (isEmpty(term)) {
      this.loadDefaultOptions();
    }

    if (this.args.onInput) {
      this.args.onInput(...arguments);
    }
  }

  @action
  onClose() {
    this.searchModels.cancelAll();

    if (this.args.onClose) {
      this.args.onClose(...arguments);
    }
  }

  @action
  change(model, select) {
    if (!isEmpty(model) && model.__isSuggestion__) {
      if (this.args.onCreate) {
        this.args.onCreate(model.__value__, select);
      }
    } else {
      if (this.args.onChange) {
        this.args.onChange(model, select);
      }
    }
  }
}
