import Component from '@ember/component';
import layout from '../templates/components/model-select';

import { assert} from '@ember/debug';
import { isEmpty} from '@ember/utils';
import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { assign } from '@ember/polyfills';

import { task, timeout } from 'ember-concurrency';
import withTestWaiter from 'ember-concurrency-test-waiter/with-test-waiter';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';
import getConfigOption from '../utils/get-config-option';

/**
 * The main {{model-select}} component.
 *
 * @class ModelSelectComponent
 */
export default Component.extend({
  layout,

  classNames: ['ember-model-select'],

  store: service(),
  infinity: service(),

  /**
   * Name of the model to be searched.
   *
   * @argument modelName
   * @type {String}
   * @required
   */
  modelName: fallbackIfUndefined(''),

  /**
   * The selected model or it's id.
   *
   * @argument selectedModel
   * @type {Model|Number|null}
   * @default null
   */
  selectedModel: fallbackIfUndefined(null),

  /**
   * Name of the model key which will be used to display the options.
   *
   * @argument labelProperty
   * @type {String}
   * @required
   */
  labelProperty: fallbackIfUndefined(''),

  /**
   * Name of the key in which search queries are passed.
   *
   * @argument searchProperty
   * @type {String}
   * @default 'search'
   */
  searchProperty: fallbackIfUndefined('search'),

  /**
   * Optional key to search on. Will default to `labelProperty` if unset.
   *
   * @argument searchKey
   * @type {String}
   * @default null
   */
  searchKey: null,

  /**
   * Whether or not the list is populated by default.
   *
   * @argument loadDefaultOptions
   * @type {Boolean}
   * @default true
   */
  loadDefaultOptions: fallbackIfUndefined(true),

  /**
   * Whether or not to use infinite scroll.
   *
   * @argument infiniteScroll
   * @type {Boolean}
   * @default true
   */
  infiniteScroll: fallbackIfUndefined(true),

  /**
   * The amount of records loaded at once when `infiniteScroll` is enabled.
   *
   * @argument pageSize
   * @type {Number}
   * @default 25
   */
  pageSize: fallbackIfUndefined(25),

  /**
   * An optional query which will be merged with the rest of the query done to the API. Can be used to sort etc.
   *
   * @argument query
   * @type {Object}
   * @default null
   */
  query: fallbackIfUndefined(null),

  /**
   * Debounce duration in ms used when searching.
   *
   * @argument debounceDuration
   * @type {Number}
   * @default 250
   */
  debounceDuration: fallbackIfUndefined(250),

  /**
   * Whether or not a create option will be added to the options list. Triggers the `onCreate` hook on selection.
   *
   * @argument withCreate
   * @type {Boolean}
   * @default false
   */
  withCreate: fallbackIfUndefined(false),

  /**
   * Option function which outputs the label to be shown for the create option when `withCreate` is set to `true`.
   *
   * @argument buildSuggestion
   * @type {Function}
   * @default null
   */
  buildSuggestion: fallbackIfUndefined(null),

  // ember-infinity options
  /**
   * @argument perPageParam
   * @type {String}
   * @default 'page[size]'
   */
  perPageParam:             fallbackIfUndefined(getConfigOption('perPageParam', 'page[size]')),

  /**
   * @argument pageParam
   * @type {String}
   * @default 'page[number]'
   */
  pageParam:                fallbackIfUndefined(getConfigOption('pageParam', 'page[number]')),

  /**
   * @argument totalPagesParam
   * @type {String}
   * @default 'meta.total'
   */
  totalPagesParam:          fallbackIfUndefined(getConfigOption('totalPagesParam', 'meta.total')),

  // ember-power-select options

  /**
   * @argument dropdownClass
   * @type {String}
   * @default 'ember-model-select__dropdown'
   */
  dropdownClass:            fallbackIfUndefined('ember-model-select__dropdown'),

  /**
   * @argument optionsComponent
   * @type {Component}
   * @default 'model-select/options'
   */
  optionsComponent:         fallbackIfUndefined('model-select/options'),

  /**
   * @argument loadingMessage
   * @type {String}
   * @default null
   */
  loadingMessage:           fallbackIfUndefined(null),

  /**
   * @argument noMatchesMessage
   * @type {String}
   * @default null
   */
  noMatchesMessage:         fallbackIfUndefined(null),

  /**
   * Hook called when a model is selected.
   *
   * @argument onchange
   * @type {Function}
   * @default function(){}
   */
  onchange: fallbackIfUndefined(function(){}),

  /**
   * Hook called when a model is created.
   *
   * @argument oncreate
   * @type {Function}
   * @default function(){}
   */
  oncreate: fallbackIfUndefined(function(){}),

  /**
   * @argument onopen
   * @type {Function}
   * @default function(){}
   */
  onopen: fallbackIfUndefined(function(){}),

  /**
   * @argument onclose
   * @type {Function}
   * @default function(){}
   */
  onclose: fallbackIfUndefined(function(){}),

  // NOTE: apart from the arguments above, ember-model-select supports the full
  // ember-power-select API which can be found: https://ember-power-select.com/docs/api-reference

  /**
   * @property _options
   * @private
   */
  _options: null,

  /**
   * @property model
   * @private
   */
  model: null,

  init(){
    this._super(...arguments);

    assert('{{model-select}} requires a valid `modelName`.', !isEmpty(this.get('modelName')));
    assert('{{model-select}} requires a valid `labelProperty`.', !isEmpty(this.get('labelProperty')));
    assert('{{model-select}} requires `debounceDuration` to be an Integer.', !isEmpty(this.get('debounceDuration')) && Number.isInteger(this.get('debounceDuration')));
    assert('{{model-select}} `searchProperty` cannot be undefined or empty', !isEmpty(this.get('searchProperty')));
  },

  /**
   * The model selected by the user
   *
   * @property _selectedModel
   * @private
   */
  _selectedModel: computed('selectedModel', function(){
    const selectedModel = this.get('selectedModel');

    if(typeof selectedModel === "number" || typeof selectedModel === "string"){
      const id = parseInt(this.get('selectedModel'), 10);
      return !isNaN(id) ? this.get('store').findRecord(this.get('modelName'), id) : null;
    } else {
      return selectedModel;
    }

  }),

  searchModels: withTestWaiter(task(function* (term, options, initialLoad = false) {
    let createOption;

    if(this.get('withCreate') && term){
      createOption = {
        __value__: term,
        __isSuggestion__: true
      };
      createOption[this.get('labelProperty')] = this.get('buildSuggestion')
        ? this.get('buildSuggestion')(term)
        : `Add "${term}"...`;
      this.set('_options', A([createOption]));
    }

    if(!initialLoad){
      yield timeout(this.get('debounceDuration'));
    }

    yield this.get('loadModels').perform(term, createOption);
  }).restartable()),

  loadModels: withTestWaiter(task(function* (term, createOption) {
    // query might be an EmptyObject/{{hash}}, make it a normal Object
    const query = assign({}, this.get('query'));

    if(term){
      const searchProperty = this.get('searchProperty');
      const searchKey = this.get('searchKey') || this.get('labelProperty');

      const searchObj = get(query, `${searchProperty}.${searchKey}`) || {};
      set(searchObj, searchKey, term);
      set(query, searchProperty, searchObj);
    }

    let _options;

    if(this.get('infiniteScroll')){
      // ember-infinity configuration
      query.perPage         = this.get('pageSize');

      query.perPageParam    = this.get('perPageParam');
      query.pageParam       = this.get('pageParam');
      query.totalPagesParam = this.get('totalPagesParam');

      this.set('model', this.get('infinity').model(this.get('modelName'), query));

      _options = yield this.get('model');
    } else {
      set(query, this.get('pageParam'), 1);
      set(query, this.get('perPageParam'), this.get('pageSize'));

      _options = yield this.get('store').query(this.get('modelName'), query);
    }

    if(createOption){
      _options.unshiftObjects([createOption]);
    }

    this.set('_options', _options);
  }).restartable()),

  actions: {
    loadDefaultOptions(){
      if(this.get('loadDefaultOptions')) {
        this.get('searchModels').perform(null, null, true);
      }
    },
    onOpen(){
      this.send('loadDefaultOptions');

      this.get('onopen')(...arguments);
    },
    onInput(term){
      if(isEmpty(term)){
        this.send('loadDefaultOptions');
      }

      this.get('oninput', ...arguments);
    },
    onClose(){
      this.get('searchModels').cancelAll();

      this.get('onclose')(...arguments);
    },
    change(model, select){
      if(!isEmpty(model) && get(model, '__isSuggestion__')){
        this.get('oncreate')(model.__value__, select);
      } else {
        this.get('onchange')(model, select);
      }
    }
  }

});
