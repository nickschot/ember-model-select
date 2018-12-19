ember-model-select
==============================================================================
[![Build Status](https://travis-ci.org/weddingshoppe/ember-model-select.svg?branch=master)](https://travis-ci.org/weddingshoppe/ember-model-select) [![Ember Observer Score](https://emberobserver.com/badges/ember-model-select.svg)](https://emberobserver.com/addons/ember-model-select) [![npm version](https://badge.fury.io/js/ember-model-select.svg)](https://badge.fury.io/js/ember-model-select)

An [ember-cli](http://www.ember-cli.com) addon to provide a searchable model select box with infinite scroll support.

The addon composes ember-power-select, ember-infinity and ember-concurrency to provide an easy to use generic model select box based on ember-data models. It can be used in any place where one might want to search for models without the need for extra JavaScript code.

Installation
------------------------------------------------------------------------------

```
ember install ember-model-select
```


Usage
------------------------------------------------------------------------------

An example page can be found [here](https://weddingshoppe.github.io/ember-model-select/).

```hbs
{{model-select
  modelName='user'
  labelProperty='name'
  selectedModel=selectedModel
  onchange=(action (mut selectedModel))
}}
```

There is also a withCreate option which can be enabled by passing `withCreate=true`. The `onCreate` hook is called with the search term. An optional `buildSuggestion` function can be passed to construct the text shown in the create option. This defaults to `Add "<term>"...`.

```hbs
{{model-select
  modelName='user'
  labelProperty='name'
  selectedModel=selectedModel
  onChange=(action (mut selectedModel))
  
  withCreate=true
  oncreate(action 'createModel')
}}
```

*NOTE: Extensive documentation is TBD. For now usage is documented in the [main component file](https://github.com/weddingshoppe/ember-model-select/blob/master/addon/components/model-select.js).*

## Related addons
 - [ember-bootstrap-model-select](https://github.com/weddingshoppe/ember-bootstrap-model-select) - [ember-bootstrap](https://www.ember-bootstrap.com) form integration for ember-model-select

## Copyright and license

Code and documentation copyright 2018 [Wedding Shoppe Inc.](http://www.weddingshoppeinc.com) and contributors. Code released under [the MIT license](LICENSE.md).
