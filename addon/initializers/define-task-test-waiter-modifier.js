import defineModifier from 'ember-concurrency-test-waiter/define-modifier';

export function initialize(/* application */) {
  defineModifier();
}

export default {
  initialize
};
