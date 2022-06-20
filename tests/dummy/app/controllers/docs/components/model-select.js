import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ModelSelectControler extends Controller {
  @action
  createUser(name) {
    const user = this.store.createRecord('user', { name });
    this.set('user2', user);
    user.save();
  }
}
