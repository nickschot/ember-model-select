import { faker } from 'ember-cli-mirage';

export default function(server) {
  faker.seed(123);
  server.createList('user', 100);
}
