import Controller from '@ember/controller';
import { A } from '@ember/array';

export default Controller.extend({
  customQuery: Object.freeze({
    sort: 'name'
  }),

  actions: {
    createUser(name){
      const user = this.store.createRecord('user', { name });
      this.set('user2', user);
      user.save();
    },

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
