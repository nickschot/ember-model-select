# Quickstart

1. **Install Model Select**

```
ember install ember-model-select
```

2. **Add a model select to your template**

You need to pass in the name of your model, the property on the model to use as the label and the selected model. Furthermore you can set the search key (and if necessary property) so it conforms to your API.

```handlebars
<ModelSelect
  @modelName="user"
  @labelProperty="name"
  @selectedModel={{this.user}}
  @onChange={{fn (mut this.user)}}

  @allowClear={{true}}
  @searchEnabled={{true}}
  @searchKey="search"
/>
```

## Optional steps

1. **ember-bootstrap integration**

A plugin to integrate ember-model-select with ember-bootstrap forms can be found [here](https://github.com/nickschot/ember-bootstrap-model-select).

2. **global configuration**

It is very likely you will need to set for example the `searchProperty` and `searchKey` to conform to your API. If you do not want to pass certain options to every instantiation of model-select you can set them in `config/environment.js`:

```javascript
'use strict';

module.exports = function(environment) {
  let ENV = {
    …

    'ember-model-select': {
      searchProperty: 'search',
      pageSize: 25,
      debounceDuration: 250,
      perPageParam: 'page[size]',
      pageParam: 'page[number]',
      totalPagesParam: 'meta.total',
    }
  };

  return ENV;
};
```
