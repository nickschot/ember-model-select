import Controller from '@ember/controller';

export default Controller.extend({

  actions: {
    createUser(name){
      const user = this.store.createRecord('user', { name });
      this.set('user2', user);
      user.save();
    },
  }

});
