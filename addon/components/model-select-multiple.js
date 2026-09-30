import Component from '@glimmer/component';
import { action } from '@ember/object';
import { isEqual } from '@ember/utils';
import {
  macroCondition,
  dependencySatisfies,
  importSync,
} from '@embroider/macros';

// ember-power-select 8.11 added `<PowerSelect @multiple={{true}}>` and deprecated
// `<PowerSelectMultiple>` (removed in 9.0). For older versions we replicate what
// `<PowerSelectMultiple>` does on top of `<PowerSelect>`.
let nativeMultiple = true;
let LegacyMultipleTrigger;

if (macroCondition(dependencySatisfies('ember-power-select', '<8.11.0'))) {
  nativeMultiple = false;
  LegacyMultipleTrigger = importSync(
    'ember-power-select/components/power-select-multiple/trigger'
  ).default;
}

/**
 * This is a wrapper around the normal model-select component. The same arguments apply.
 *
 * @yield {object} model
 *
 * @class ModelSelectMultipleComponent
 */
export default class ModelSelectMultipleComponent extends Component {
  nativeMultiple = nativeMultiple;
  LegacyMultipleTrigger = LegacyMultipleTrigger;

  get buildSelection() {
    if (this.args.buildSelection || nativeMultiple) {
      return this.args.buildSelection;
    }
    return this.defaultBuildSelection;
  }

  get beforeOptionsComponent() {
    if (nativeMultiple) {
      return this.args.beforeOptionsComponent;
    }
    return this.args.beforeOptionsComponent || null;
  }

  get searchFieldPosition() {
    // ember-power-select 8.0 - 8.10 need this to render the search in the trigger
    if (nativeMultiple) {
      return this.args.searchFieldPosition;
    }
    return this.args.searchFieldPosition || 'trigger';
  }

  get onOpen() {
    return nativeMultiple ? this.args.onOpen : this.handleOpen;
  }

  get onFocus() {
    return nativeMultiple ? this.args.onFocus : this.handleFocus;
  }

  get onKeydown() {
    return nativeMultiple ? this.args.onKeydown : this.handleKeydown;
  }

  get tabindex() {
    if (nativeMultiple) {
      return this.args.tabindex;
    }

    if (this.args.triggerComponent === undefined && this.args.searchEnabled) {
      return '-1';
    } else {
      return this.args.tabindex || '0';
    }
  }

  @action
  change(option, select) {
    const suggestion = option.find((item) => item.__isSuggestion__);

    if (suggestion) {
      this.args.onCreate(suggestion.__value__, select);
    } else {
      this.args.onChange(option, select);
    }
  }

  @action
  handleOpen(select, e) {
    if (this.args.onOpen && this.args.onOpen(select, e) === false) {
      return false;
    }
    this.focusInput(select);
  }

  @action
  handleFocus(select, e) {
    if (this.args.onFocus) {
      this.args.onFocus(select, e);
    }
    this.focusInput(select);
  }

  @action
  handleKeydown(select, e) {
    if (this.args.onKeydown && this.args.onKeydown(select, e) === false) {
      e.stopPropagation();
      return false;
    }
    if (e.keyCode === 13 && select.isOpen) {
      e.stopPropagation();
      if (
        select.highlighted !== undefined &&
        (!select.selected || select.selected.indexOf(select.highlighted) === -1)
      ) {
        select.actions.choose(select.highlighted, e);
      } else {
        select.actions.close(e);
      }
      return false;
    }
  }

  defaultBuildSelection(option, select) {
    const newSelection = (select.selected || []).slice(0);
    const idx = newSelection.findIndex((item) => isEqual(item, option));

    if (idx > -1) {
      newSelection.splice(idx, 1);
    } else {
      newSelection.push(option);
    }
    return newSelection;
  }

  focusInput(select) {
    if (select) {
      const input = document.querySelector(
        `#ember-power-select-trigger-multiple-input-${select.uniqueId}`
      );
      if (input) {
        input.focus();
      }
    }
  }
}
