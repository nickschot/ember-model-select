import Controller from '@ember/controller';
import { A } from '@ember/array';

export default Controller.extend({
  customQuery: Object.freeze({
    sort: 'name'
  }),

  actions: {
    createUser(name){
      this.store.createRecord('user', { name }).save();
    },

    async createMultipleUser(name){
      const user = await this.store.createRecord('user', { name }).save();

      if(!Array.isArray(this.users2)){
        this.set('users2', A([]));
      }

      this.users2.pushObject(user);
    }
  }
});
