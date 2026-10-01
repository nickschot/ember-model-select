import Application from 'dummy/app';
import config from 'dummy/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
import { loadTests } from 'ember-qunit/test-loader';
import setupSinon from 'ember-sinon-qunit';
import {
  macroCondition,
  dependencySatisfies,
  importSync,
} from '@embroider/macros';

// ember-basic-dropdown 9 (required by ember-power-select 9) no longer falls back
// to the test root element on its own. Macros only see this addon's (peer)
// dependencies, so this checks ember-power-select instead.
if (macroCondition(dependencySatisfies('ember-power-select', '>=9.0.0'))) {
  importSync('ember-basic-dropdown/config').setConfig({
    rootElement: config.APP.rootElement,
  });
}

setApplication(Application.create(config.APP));

setup(QUnit.assert);

setupSinon();

// ember-qunit 8+ no longer loads the tests in start()
loadTests();
start({ loadTests: false });
