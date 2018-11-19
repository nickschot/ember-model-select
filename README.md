ember-model-select
==============================================================================
[![Build Status](https://travis-ci.org/weddingshoppe/ember-model-select.svg?branch=master)](https://travis-ci.org/weddingshoppe/ember-model-select) [![Ember Observer Score](https://emberobserver.com/badges/ember-model-select.svg)](https://emberobserver.com/addons/ember-model-select)

An [ember-cli](http://www.ember-cli.com) addon to provide a searchable model select box with infinite scroll support.

Installation
------------------------------------------------------------------------------

```
ember install ember-model-select
```


Usage
------------------------------------------------------------------------------

TBD

```hbs
{{model-select
  modelName='user'
  labelProperty='name'
  selectedModelId=selectedModel.id
  onChange=(action (mut selectedModel))
}}
```

## Copyright and license

Code and documentation copyright 2018 [Wedding Shoppe Inc.](http://www.weddingshoppeinc.com) and contributors. Code released under [the MIT license](LICENSE.md).
