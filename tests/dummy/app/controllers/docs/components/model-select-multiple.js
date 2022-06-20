import Controller from '@ember/controller';
import { A } from '@ember/array';
import { action } from '@ember/object';

export default class ModelSelectMultipleController extends Controller {
  @action
  createMultipleUser(name) {
    if (!Array.isArray(this.users2)) {
      this.set('users2', A([]));
    }

    const user = this.store.createRecord('user', { name });
    this.users2.push(user);
    user.save();
  }
}
