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
