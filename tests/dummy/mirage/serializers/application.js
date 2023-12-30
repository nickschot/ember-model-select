import JSONAPISerializer from 'ember-mirage-sauce/mirage-serializers/json-api-serializer';
import { A } from '@ember/array';

export default JSONAPISerializer.extend({
  searchByFields: A(['name']),
});
