# Model Select Multiple

## Multiple Select
{{#docs-demo as |demo|}}
  {{#demo.example name='multiple-select.hbs'}}
    {{model-select-multiple
      modelName="user"
      labelProperty="name"
      selectedModel=users1
      onChange=(action (mut users1))

      searchEnabled=true
      searchProperty="filter"
      searchKey="search"
    }}
  {{/demo.example}}

  {{demo.snippet 'multiple-select.hbs'}}
{{/docs-demo}}

## Multiple Select with Create
There is also a `withCreate` option which can be enabled by passing `withCreate=true`. The `onCreate` hook is called with the search term. An optional `buildSuggestion` function can be passed to construct the text shown in the create option. This defaults to `Add "term"...`.

It is up to the user to implement the actual creation and addition of the model instance to the `selectedModel` Array.

{{#docs-demo as |demo|}}
  {{#demo.example name='multiple-select-with-create.hbs'}}
    {{model-select-multiple
      modelName="user"
      labelProperty="name"
      selectedModel=users2
      onChange=(action (mut users2))

      withCreate=true
      onCreate=(action "createMultipleUser")

      searchEnabled=true
      searchProperty="filter"
      searchKey="search"
    }}
  {{/demo.example}}

  {{demo.snippet 'multiple-select-with-create.hbs'}}
{{/docs-demo}}

## Multiple Select with Block
{{#docs-demo as |demo|}}
  {{#demo.example name='multiple-select-with-block.hbs'}}
    {{#model-select-multiple
      modelName="user"
      labelProperty="name"
      selectedModel=users3
      onChange=(action (mut users3))

      searchEnabled=true
      searchProperty="filter"
      searchKey="search"
    as |model|}}
      <b>Name:</b> {{model.name}}
    {{/model-select-multiple}}
  {{/demo.example}}

  {{demo.snippet 'multiple-select-with-block.hbs'}}
{{/docs-demo}}
