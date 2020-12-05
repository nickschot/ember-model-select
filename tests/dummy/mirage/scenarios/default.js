import faker from 'faker';

export default function(server) {
  faker.seed(123);
  server.createList('user', 100);
}
