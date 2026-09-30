ember-model-select
==============================================================================
[![Build Status](https://travis-ci.org/nickschot/ember-model-select.svg?branch=master)](https://travis-ci.org/nickschot/ember-model-select) [![Ember Observer Score](https://emberobserver.com/badges/ember-model-select.svg)](https://emberobserver.com/addons/ember-model-select) [![npm version](https://badge.fury.io/js/ember-model-select.svg)](https://badge.fury.io/js/ember-model-select)

An [ember-cli](http://www.ember-cli.com) addon to provide a searchable model select box with infinite scroll support.

The addon composes ember-power-select, ember-infinity and ember-concurrency to provide an easy to use generic model select box based on ember-data models. It can be used in any place where one might want to search for models without the need for extra JavaScript code.

Documentation
------------------------------------------------------------------------------
[View the docs here](https://nickschot.github.io/ember-model-select).

Compatibility
------------------------------------------------------------------------------

* Ember.js v3.28 or above (ember-power-select 9 requires v4.12 or above)
* Ember CLI v3.28 or above
* Node.js v20 or above
* ember-power-select v4 up to and including v9
* ember-concurrency v2.3 up to and including v5


Installation
------------------------------------------------------------------------------

```
ember install ember-model-select
```

`ember-power-select`, `ember-concurrency` and `@glimmer/component` are peer
dependencies, so make sure your app depends on versions that work together, e.g.:

| ember-power-select | ember-basic-dropdown | ember-concurrency |
| ------------------ | -------------------- | ----------------- |
| 4.x – 7.x          | (included)           | 2.3+ or 3.x       |
| 8.x                | 8.x                  | 4.x (5.x on 8.12+) |
| 9.x                | 9.x                  | 5.1+              |

ember-power-select 9 additionally requires `@glimmer/component` 2.x and
`@ember/test-helpers` 5.x.

### ember-power-select 8 and up

ember-power-select 8+ and ember-basic-dropdown 8+ are v2 addons. Follow their
installation guides; in short:

- Render the dropdown wormhole in your application template:
  `<BasicDropdownWormhole />`.
- Import the ember-power-select styles yourself, and from ember-power-select 9
  on, the ember-basic-dropdown styles as well.

Related addons
------------------------------------------------------------------------------
 - [ember-bootstrap-model-select](https://github.com/nickschot/ember-bootstrap-model-select) - [ember-bootstrap](https://www.ember-bootstrap.com) form integration for ember-model-select


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
