# Quickstart

1. **Install Model Select**

```
ember install ember-model-select
```

2. **Add a model select to your template**

You need to pass in the name of your model, the property on the model to use as the label and the selected model. Furthermore you can set the search key (and if necessary property) so it conforms to your API.

```handlebars
{{model-select
  modelName="user"
  labelProperty="name"
  selectedModel=user
  onChange=(action (mut user))

  allowClear=true
  searchEnabled=true
  searchKey="search"
}}
```

## Optional steps

1. **ember-bootstrap integration**

A plugin to integrate ember-model-select with ember-bootstrap forms can be found [here](https://github.com/nickschot/ember-bootstrap-model-select).

2. **global configuration**

It is very likely you will need to set for example the `searchProperty` and `searchKey` to conform to your API. If you do not want to pass certain options to every instantiation of model-select you can override the `{{model-select}}` and `{{model-select-multiple}}` components.

To do so you can create a component as follows:

```javascript
// app/components/model-select.js
import ModelSelectComponent from 'ember-model-select/components/model-select';

export default ModelSelectComponent.extend({
  searchProperty: 'search',
  searchKey: 'filter'
});
```

You can do the same for `model-select-multiple`.
