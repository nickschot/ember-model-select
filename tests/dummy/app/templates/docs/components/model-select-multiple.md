# Model Select Multiple

## Multiple Select
{{#docs-demo as |demo|}}
  {{#demo.example name='multiple-select.hbs'}}
    {{model-select-multiple
      modelName="user"
      labelProperty="name"
      selectedModel=users1
      onchange=(action (mut users1))
      
      searchProperty="filter"
      searchKey="search"
    }}
  {{/demo.example}}

  {{demo.snippet 'multiple-select.hbs'}}
{{/docs-demo}}

## Multiple Select With create
There is also a `withCreate` option which can be enabled by passing `withCreate=true`. The `oncreate` hook is called with the search term. An optional `buildSuggestion` function can be passed to construct the text shown in the create option. This defaults to `Add "term"...`.

It is up to the user to implement the actual creation and addition of the model instance to the `selectedModel` Array.

{{#docs-demo as |demo|}}
  {{#demo.example name='multiple-select-with-create.hbs'}}
    {{model-select-multiple
      modelName="user"
      labelProperty="name"
      selectedModel=users2
      onchange=(action (mut users2))
      
      withCreate=true
      oncreate=(action "createMultipleUser")
      
      searchProperty="filter"
      searchKey="search"
    }}
  {{/demo.example}}

  {{demo.snippet 'multiple-select-with-create.hbs'}}
{{/docs-demo}}
