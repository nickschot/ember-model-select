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

## Single Select With create

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
