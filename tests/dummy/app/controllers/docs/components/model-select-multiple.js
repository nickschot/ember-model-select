import Controller from '@ember/controller';
import { A } from "@ember/array";

export default Controller.extend({
  actions: {
    createMultipleUser(name){
      if(!Array.isArray(this.users2)){
        this.set('users2', A([]));
      }

      const user = this.store.createRecord('user', { name });
      this.users2.pushObject(user);
      user.save();
    }
  }
});
