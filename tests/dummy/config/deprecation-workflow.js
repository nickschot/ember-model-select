'use strict';
window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchId: "ember-modifier.function-based-options" },
    { handler: "silence", matchId: "ember-modifier.no-args-property" },
    { handler: "silence", matchId: "ember-modifier.no-element-property" },
    { handler: "silence", matchId: "ember-modifier.use-destroyables" },
    { handler: "silence", matchId: "ember-modifier.use-modify" },
    { handler: "silence", matchId: "ember-polyfills.deprecate-assign" },
  ]
};

