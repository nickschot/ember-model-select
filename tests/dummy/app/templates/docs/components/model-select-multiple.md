# Model Select Multiple

## Multiple Select
<DocsDemo as |demo|>
  <demo.example @name='multiple-select.hbs'>
    <ModelSelectMultiple
      @modelName="user"
      @labelProperty="name"
      @selectedModel={{this.users1}}
      @onChange={{fn (mut this.users1)}}

      @searchEnabled={{true}}
      @searchProperty="filter"
      @searchKey="search"
    />
  </demo.example>

  {{demo.snippet 'multiple-select.hbs'}}
</DocsDemo>

## Multiple Select with Create
There is also a `withCreate` option which can be enabled by passing `withCreate={{true}}`. The `onCreate` hook is called with the search term. An optional `buildSuggestion` function can be passed to construct the text shown in the create option. This defaults to `Add "term"...`.

It is up to the user to implement the actual creation and addition of the model instance to the `selectedModel` Array.

<DocsDemo as |demo|>
  <demo.example @name='multiple-select-with-create.hbs'>
    <ModelSelectMultiple
      @modelName="user"
      @labelProperty="name"
      @selectedModel={{this.users2}}
      @onChange={{fn (mut this.users2)}}

      @withCreate={{true}}
      @onCreate={{fn this.createMultipleUser}}

      @searchEnabled={{true}}
      @searchProperty="filter"
      @searchKey="search"
    />
  </demo.example>

  {{demo.snippet 'multiple-select-with-create.hbs'}}
</DocsDemo>

## Multiple Select with Block
<DocsDemo as |demo|>
  <demo.example @name='multiple-select-with-block.hbs'>
    <ModelSelectMultiple
      @modelName="user"
      @labelProperty="name"
      @selectedModel={{this.users3}}
      @onChange={{fn (mut this.users3)}}

      @searchEnabled={{true}}
      @searchProperty="filter"
      @searchKey="search"
      as |model|
    >
      <b>Name:</b> {{model.name}}
    </ModelSelectMultiple>
  </demo.example>

  {{demo.snippet 'multiple-select-with-block.hbs'}}
</DocsDemo>
