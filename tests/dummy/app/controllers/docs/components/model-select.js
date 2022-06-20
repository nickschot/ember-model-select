import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ModelSelectControler extends Controller {
  @tracked user2;

  @action
  createUser(name) {
    const user = this.store.createRecord('user', { name });
    this.user2 = user;
    user.save();
  }
}
