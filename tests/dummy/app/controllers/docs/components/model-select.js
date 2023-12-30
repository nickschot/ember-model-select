import Controller from '@ember/controller';
import { action, set } from '@ember/object';

export default class ModelSelectControler extends Controller {
  @action
  createUser(name) {
    const user = this.store.createRecord('user', { name });
    set(this, 'user2', user);
    user.save();
  }
}
