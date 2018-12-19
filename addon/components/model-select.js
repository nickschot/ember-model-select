import Component from '@ember/component';
import layout from '../templates/components/model-select';

import { assert} from '@ember/debug';
import { isEmpty} from '@ember/utils';
import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';

import { task, timeout } from 'ember-concurrency';
import withTestWaiter from 'ember-concurrency-test-waiter/with-test-waiter';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';
import getConfigOption from '../utils/get-config-option';

export default Component.extend({
  layout,

  classNames: ['ember-model-select'],

  store: service(),
  infinity: service(),

  /**
   * Name of the model to be searched.
   *
   * @argument modelName
   * @type String
   */
  modelName: fallbackIfUndefined(''),

  /**
   * The selected model or it's id.
   *
   * @argument selectedModel
   * @type Model|Number|null
   */
  selectedModel: fallbackIfUndefined(null),

  /**
   * Name of the model key which will be used to display the options.
   *
   * @argument labelProperty
   * @type String
   */
  labelProperty: fallbackIfUndefined(''),

  /**
   * Name of the key in which search queries are passed.
   *
   * @argument searchProperty
   * @type String
   * @default 's'
   */
  searchProperty: fallbackIfUndefined('search'),

  /**
   * Optional key to search on. Will default to `labelProperty` if unset.
   *
   * @argument searchKey
   * @type String
   * @default null
   */
  searchKey: null,

  /**
   * Whether or not the list is populated by default.
   *
   * @argument loadDefaultOptions
   * @type Boolean
   * @default true
   */
  loadDefaultOptions: fallbackIfUndefined(true),

  /**
   * Whether or not to use infinite scroll.
   *
   * @argument infiniteScroll
   * @type Boolean
   * @default true
   */
  infiniteScroll: fallbackIfUndefined(true),

  /**
   * The amount of records loaded at once when `infiniteScroll` is enabled.
   *
   * @argument pageSize
   * @type Number
   * @default 25
   */
  pageSize: fallbackIfUndefined(25),

  /**
   * An optional query which will be merged with the rest of the query done to the API. Can be used to sort etc.
   *
   * @argument query
   * @type Object
   * @default null
   */
  query: fallbackIfUndefined(null),

  /**
   * Debounce duration in ms used when searching.
   *
   * @argument debounceDuration
   * @type Number
   * @default 250
   */
  debounceDuration: fallbackIfUndefined(250),

  /**
   * Whether or not a create option will be added to the options list. Triggers the `onCreate` hook on selection.
   *
   * @argument withCreate
   * @type Boolean
   * @default false
   */
  withCreate: fallbackIfUndefined(false),

  /**
   * Option function which outputs the label to be shown for the create option when `withCreate` is set to `true`.
   *
   * @argument buildSuggestion
   * @type Function
   * @default null
   */
  buildSuggestion: fallbackIfUndefined(null),

  // ember-infinity options
  perPageParam:             fallbackIfUndefined(getConfigOption('perPageParam', 'page[size]')),
  pageParam:                fallbackIfUndefined(getConfigOption('pageParam', 'page[number]')),
  totalPagesParam:          fallbackIfUndefined(getConfigOption('totalPagesParam', 'meta.total')),

  // ember-power-select options
  afterOptionsComponent:    fallbackIfUndefined('model-select/loading-mask'),
  dropdownClass:            fallbackIfUndefined('ember-model-select__dropdown'),
  optionsComponent:         fallbackIfUndefined('model-select/options'),

  /**
   * Hook called when a model is selected.
   *
   * @argument onchange
   * @type Function
   */
  onchange: fallbackIfUndefined(function(){}),

  /**
   * Hook called when a model is created.
   *
   * @argument oncreate
   * @type Function
   */
  oncreate: fallbackIfUndefined(function(){}),

  onopen: fallbackIfUndefined(function(){}),
  onclose: fallbackIfUndefined(function(){}),

  // NOTE: apart from the arguments above, ember-model-select supports the full
  // ember-power-select API which can be found: https://ember-power-select.com/docs/api-reference

  /**
   * @private
   */
  _options: null,

  /**
   * @private
   */
  model: null,

  init(){
    this._super(...arguments);

    assert('{{model-select}} requires a valid `modelName`.', !isEmpty(this.get('modelName')));
    assert('{{model-select}} requires a valid `labelProperty`.', !isEmpty(this.get('labelProperty')));
    assert('{{model-select}} requires `debounceDuration` to be an Integer.', !isEmpty(this.get('debounceDuration')) && Number.isInteger(this.get('debounceDuration')));
  },

  /**
   * The model selected by the user
   *
   * @property _selectedModel
   * @private
   */
  _selectedModel: computed('selectedModel', function(){
    const selectedModel = this.get('selectedModel');

    if(typeof selectedModel === Number){
      const id = parseInt(this.get('selectedModel'), 10);
      return !isNaN(id) ? this.get('store').findRecord(this.get('modelName'), id) : null;
    } else {
      return selectedModel;
    }

  }),

  searchModels: withTestWaiter(task(function* (term, options, initialLoad = false) {
    if(!initialLoad){
      yield timeout(this.get('debounceDuration'));
    }

    // query might be an EmptyObject/{{hash}}, make it a normal Object
    const query = JSON.parse(JSON.stringify(this.get('query'))) || {};

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

    if(this.get('withCreate') && term){
      const createOption = {
        __value__: term,
        __isSuggestion__: true
      };
      createOption[this.get('labelProperty')] = this.get('buildSuggestion')
        ? this.get('buildSuggestion')(term)
        : `Add "${term}"...`;

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
    change(model){
      if(model.__isSuggestion__){
        this.get('oncreate')(model.__value__);
      } else {
        this.get('onchange')(model);
      }
    }
  }

});
