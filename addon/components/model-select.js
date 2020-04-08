import Component from '@glimmer/component';

// import { assert} from '@ember/debug';
import { isEmpty} from '@ember/utils';
import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { assign } from '@ember/polyfills';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { timeout } from 'ember-concurrency';
import { restartableTask, dropTask } from 'ember-concurrency-decorators';
import getConfigOption from '../utils/get-config-option';

/**
 * The main {{model-select}} component.
 *
 * @class ModelSelectComponent
 */
export default class ModelSelectComponent extends Component{
  @service store;
  @service infinity;

  /**
   * The amount of records loaded at once when `infiniteScroll` is enabled.
   *
   * @argument pageSize
   * @type {Number}
   * @default 25
   */
  get pageSize() {
    return this.args.pageSize || 25;
  }

  /**
   * Debounce duration in ms used when searching.
   *
   * @argument debounceDuration
   * @type {Number}
   * @default 250
   */
  get debounceDuration() {
    return this.args.debounceDuration || 250;
  }

  // ember-infinity options
  /**
   * @argument perPageParam
   * @type {String}
   * @default 'page[size]'
   */
  get perPageParam() {
    return this.args.perPageParam || getConfigOption('perPageParam', 'page[size]');
  }

  /**
   * @argument pageParam
   * @type {String}
   * @default 'page[number]'
   */
  get pageParam() {
    return this.args.pageParam || getConfigOption('pageParam', 'page[number]');
  }

  /**
   * @argument totalPagesParam
   * @type {String}
   * @default 'meta.total'
   */
  get totalPagesParam() {
    return this.args.totalPagesParam || getConfigOption('totalPagesParam', 'meta.total');
  }

  // ember-power-select options

  /**
   * @argument optionsComponent
   * @type {Component}
   * @default 'model-select/options'
   */
  get optionsComponent() {
    return this.args.optionsComponent || 'model-select/options';
  }

  get infiniteScroll() {
    return this.args.infiniteScroll === undefined || this.args.infiniteScroll;
  }

  // NOTE: apart from the arguments above, ember-model-select supports the full
  // ember-power-select API which can be found: https://ember-power-select.com/docs/api-reference

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
  @computed('args.selectedModel')
  get _selectedModel(){
    const selectedModel = this.args.selectedModel;

    if(typeof selectedModel === "number" || typeof selectedModel === "string"){
      const id = parseInt(selectedModel, 10);
      return !isNaN(id) ? this.findRecord.perform(this.args.modelName, id) : null;
    } else {
      return selectedModel;
    }
  }

  @dropTask({ withTestWaiter: true })
  findRecord = function*(modelName, id) {
    // this wrapper task is requried to avoid the following error upon fast changes
    // of selectedModel:
    // Error: Assertion Failed: You attempted to remove a function listener which
    // did not exist on the instance, which means you may have attempted to remove
    // it before it was added.
    return yield this.store.findRecord(modelName, id);
  }

  @restartableTask({ withTestWaiter: true })
  searchModels = function* (term, options, initialLoad = false) {
    let createOption;

    if(this.args.withCreate && term){
      createOption = {
        __value__: term,
        __isSuggestion__: true
      };
      createOption[this.args.labelProperty] = this.args.buildSuggestion
        ? this.args.buildSuggestion(term)
        : `Add "${term}"...`;
      this._options = A([createOption]);
    }

    if(!initialLoad){
      yield timeout(this.debounceDuration);
    }

    yield this.loadModels.perform(term, createOption);
  }

  @restartableTask({ withTestWaiter: true })
  loadModels = function* (term, createOption) {
    // query might be an EmptyObject/{{hash}}, make it a normal Object
    const query = assign({}, this.args.query);

    if(term){
      const searchProperty = this.args.searchProperty || 'search';
      const searchKey = this.args.searchKey || this.args.labelProperty;

      const searchObj = get(query, `${searchProperty}`) || {};
      set(searchObj, searchKey, term);
      set(query, searchProperty, searchObj);
    }

    let _options;

    if(this.infiniteScroll){
      // ember-infinity configuration
      query.perPage         = this.pageSize;

      query.perPageParam    = this.perPageParam;
      query.pageParam       = this.pageParam;
      query.totalPagesParam = this.totalPagesParam;

      this.model = this.infinity.model(this.args.modelName, query);

      _options = yield this.model;
    } else {
      set(query, this.pageParam, 1);
      set(query, this.perPageParam, this.pageSize);

      _options = yield this.store.query(this.args.modelName, query);
    }

    if(createOption){
      _options.unshiftObjects([createOption]);
    }

    this._options = _options;
  }

  loadDefaultOptions(){
    if(this.args.loadDefaultOptions === undefined || this.args.loadDefaultOptions) {
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
    if(isEmpty(term)){
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
    if(!isEmpty(model) && model.__isSuggestion__) {
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
