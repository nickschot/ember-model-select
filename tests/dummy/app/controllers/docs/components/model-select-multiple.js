import Controller from '@ember/controller';
import { A } from '@ember/array';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ModelSelectMultipleController extends Controller {
  @tracked users2 = A([]);

  @action
  createMultipleUser(name) {
    const user = this.store.createRecord('user', { name });
    this.users2.push(user);
    user.save();
  }
}
