import Component from '@ember/component';
import layout from '../templates/components/model-select';

import { assert} from '@ember/debug';
import { isEmpty} from '@ember/utils';
import { computed, set } from '@ember/object';
import { inject as service } from '@ember/service';

import { task, timeout } from 'ember-concurrency';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';

export default Component.extend({
  layout,

  classNames: ['ember-model-select'],

  store: service(),
  infinity: service(),

  /**
   * Name of the model to be searched
   *
   * @argument modelName
   * @type String
   */
  modelName: fallbackIfUndefined(''),

  /**
   * Id of the selected model
   *
   * @argument selectedModelId
   * @type Number|null
   */
  selectedModelId: fallbackIfUndefined(null),

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
  searchProperty: fallbackIfUndefined('s'),

  /**
   * Whether or not search is enabled.
   *
   * @argument searchEnabled
   * @type Boolean
   * @default true
   */
  searchEnabled: fallbackIfUndefined(true),

  /**
   * Whether or not the list is populated by default
   *
   * @argument loadDefaultOptions
   * @type Boolean
   * @default true
   */
  loadDefaultOptions: fallbackIfUndefined(true),

  /**
   * The amount of items that is requested from the API. This is disregarded when `infiniteScroll` is enabled.
   *
   * @argument optionAmount
   * @type Number
   * @default 10
   */
  optionAmount: fallbackIfUndefined(10),

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
   * An optional filter which will be added to the query done to the API. Can be used to limit query results.
   *
   * @argument filter
   * @type Object
   * @default null
   */
  filter: fallbackIfUndefined(null),

  /**
   * An optional filter key. Can be used when just a single property needs to be filtered. Will work together with
   * `filter` and also takes precedence over it.
   *
   * @argument filterKey
   * @type String
   * @default null
   */
  filterKey: fallbackIfUndefined(null),

  /**
   * An optional filter value. Used as the value for the `filterKey`.
   *
   * @argument filterValue
   * @type String|Number
   * @default null
   */
  filterValue: fallbackIfUndefined(null),

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
   * Whether or not the dropdown is rendered in place (or in a wormhole)
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
  defaultOptions: null,

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
   * @property
   * @private
   */
  selectedModel: computed('selectedModelId', function(){
    const id = parseInt(this.get('selectedModelId'), 10);
    return !isNaN(id) ? this.get('store').findRecord(this.get('modelName'), id) : null;
  }),

  searchModels: task(function* (term, options, initialLoad = false) {
    if(!initialLoad){
      yield timeout(this.get('debounceDuration'));
    }

    const query = {
      filter: this.get('filter')
    };
    if(this.get('filterKey') && !isEmpty(this.get('filterValue'))){
      query.filter[this.get('filterKey')] = this.get('filterValue');
    }

    if(term){
      const searchQuery = {};
      searchQuery[this.get('labelProperty')] = term;
      query[this.get('searchProperty')] = searchQuery;
    }

    if(this.get('infiniteScroll')){
      // ember-infinity configuration
      query.perPage = this.get('pageSize');

      // ember-infinity configuration
      query.perPageParam    = this.get('perPageParam');
      query.pageParam       = this.get('pageParam');
      query.totalPagesParam = this.get('totalPagesParam');

      this.set('model', this.get('infinity').model(this.get('modelName'), query));

      return this.get('model');
    } else {
      set(query, this.get('pageParam'), 1);
      set(query, this.get('perPageParam'), this.get('optionAmount'));

      return this.get('store').query(this.get('modelName'), query);
    }
  }).restartable(),

  actions: {
    async open(){
      if(this.get('loadDefaultOptions')){
        this.set('defaultOptions', this.get('searchModels').perform(null, null, true));
      }
    },
    change(model){
      this.get('onChange')(model);
    }
  }

});
