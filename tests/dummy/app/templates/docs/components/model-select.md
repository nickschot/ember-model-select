# Model Select

## Single Select
<DocsDemo as |demo|>
  <demo.example @name='single-select.hbs'>
    <ModelSelect
      @modelName="user"
      @labelProperty="name"
      @selectedModel={{this.user1}}
      @onChange={{fn (mut this.user1)}}

      @allowClear={{true}}
      @searchEnabled={{true}}
      @searchProperty="filter"
      @searchKey="search"
    />
  </demo.example>

  {{demo.snippet 'single-select.hbs'}}
</DocsDemo>

## Single Select with Create
There is also a `withCreate` option which can be enabled by passing `withCreate={{true}}`. The `onCreate` hook is called with the search term. An optional `buildSuggestion` function can be passed to construct the text shown in the create option. This defaults to `Add "term"...`.

<DocsDemo as |demo|>
  <demo.example @name='single-select-with-create.hbs'>
    <ModelSelect
      @modelName="user"
      @labelProperty="name"
      @selectedModel={{this.user2}}
      @onChange={{fn (mut this.user2)}}

      @withCreate={{true}}
      @onCreate={{fn this.createUser}}

      @allowClear={{true}}
      @searchEnabled={{true}}
      @searchProperty="filter"
      @searchKey="search"
    />
  </demo.example>

  {{demo.snippet 'single-select-with-create.hbs'}}
</DocsDemo>

## Single Select with Custom Option display
The model-select can also be used with a block form. Each of the models is yielded as `model`.
<DocsDemo as |demo|>
  <demo.example @name='single-select-with-block.hbs'>
    <ModelSelect
      @modelName="user"
      @labelProperty="name"
      @selectedModel={{this.user3}}
      @onChange={{fn (mut this.user3)}}

      @allowClear={{true}}
      @searchEnabled={{true}}
      @searchProperty="filter"
      @searchKey="search"
      as |model|
    >
      <b>Name:</b> {{model.name}}
    </ModelSelect>
  </demo.example>

  {{demo.snippet 'single-select-with-block.hbs'}}
</DocsDemo>
