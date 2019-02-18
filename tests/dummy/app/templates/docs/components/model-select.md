# Model Select

## Single Select
{{#docs-demo as |demo|}}
  {{#demo.example name='single-select.hbs'}}
    {{model-select
      modelName="user"
      labelProperty="name"
      selectedModel=user1
      onchange=(action (mut user1))
      
      allowClear=true
      searchProperty="filter"
      searchKey="search"
    }}
  {{/demo.example}}

  {{demo.snippet 'single-select.hbs'}}
{{/docs-demo}}

## Single Select with Create
There is also a `withCreate` option which can be enabled by passing `withCreate=true`. The `oncreate` hook is called with the search term. An optional `buildSuggestion` function can be passed to construct the text shown in the create option. This defaults to `Add "term"...`.

{{#docs-demo as |demo|}}
  {{#demo.example name='single-select-with-create.hbs'}}
    {{model-select
      modelName="user"
      labelProperty="name"
      selectedModel=user2
      onchange=(action (mut user2))
      
      withCreate=true
      oncreate=(action "createUser")
      
      allowClear=true
      searchProperty="filter"
      searchKey="search"
    }}
  {{/demo.example}}

  {{demo.snippet 'single-select-with-create.hbs'}}
{{/docs-demo}}

## Single Select with Custom Option display 
The model-select can also be used with a block form. Each of the models is yielded as `model`.
{{#docs-demo as |demo|}}
  {{#demo.example name='single-select-with-block.hbs'}}
    {{#model-select
      modelName="user"
      labelProperty="name"
      selectedModel=user3
      onchange=(action (mut user3))
      
      allowClear=true
      searchProperty="filter"
      searchKey="search"
    as |model|}}
      <b>Name:</b> {{model.name}}
    {{/model-select}}
  {{/demo.example}}

  {{demo.snippet 'single-select-with-block.hbs'}}
{{/docs-demo}}
