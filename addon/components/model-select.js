import Component from '@ember/component';
import layout from '../templates/components/model-select';

import { assert} from '@ember/debug';
import { isEmpty} from '@ember/utils';
import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';

import { task, timeout } from 'ember-concurrency';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';

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
   * Whether or not search is enabled.
   *
   * @argument searchEnabled
   * @type Boolean
   * @default true
   */
  searchEnabled: fallbackIfUndefined(true),

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
   * Whether or not the model-search-box is disabled.
   *
   * @argument disabled
   * @type Boolean
   * @default false
   */
  disabled: fallbackIfUndefined(false),

  /**
   * Whether or not the select can be cleared.
   *
   * @argument allowClear
   * @type Boolean
   * @default true
   */
  allowClear: fallbackIfUndefined(true),

  /**
   * Debounce duration in ms used when searching.
   *
   * @argument debounceDuration
   * @type Number
   * @default 250
   */
  debounceDuration: fallbackIfUndefined(250),

  /**
   * Whether or not the dropdown is rendered in place (or in a wormhole).
   *
   * @argument renderInPlace
   * @type Boolean
   * @default false
   */
  renderInPlace: fallbackIfUndefined(false),

  //TODO: global config?
  perPageParam: fallbackIfUndefined('page[size]'),
  pageParam: fallbackIfUndefined('page[number]'),
  totalPagesParam: fallbackIfUndefined('meta.total'),

  /**
   * Hook called when a model is selected.
   *
   * @argument onChange
   * @type Function
   */
  onChange(){},

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

    assert('You must pass a valid `modelName`.', !isEmpty(this.get('modelName')));
    assert('You must pass a valid `labelProperty`.', !isEmpty(this.get('labelProperty')));
    assert('`debounceDuration` must be an Integer.', !isEmpty(this.get('debounceDuration')) && Number.isInteger(this.get('debounceDuration')));
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

  searchModels: task(function* (term, options, initialLoad = false) {
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

    if(this.get('infiniteScroll')){
      // ember-infinity configuration
      query.perPage         = this.get('pageSize');

      query.perPageParam    = this.get('perPageParam');
      query.pageParam       = this.get('pageParam');
      query.totalPagesParam = this.get('totalPagesParam');

      this.set('model', this.get('infinity').model(this.get('modelName'), query));

      this.set('_options', this.get('model'));
    } else {
      set(query, this.get('pageParam'), 1);
      set(query, this.get('perPageParam'), this.get('pageSize'));

      this.set('_options', this.get('store').query(this.get('modelName'), query));
    }
  }).restartable(),

  actions: {
    loadDefaultOptions(){
      if(this.get('loadDefaultOptions')){
        this.get('searchModels').perform(null, null, true);
      }
    },
    onInput(term){
      if(isEmpty(term)){
        this.send('loadDefaultOptions');
      }
    },
    change(model){
      this.get('onChange')(model);
    }
  }

});
