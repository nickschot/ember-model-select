import Controller from '@ember/controller';

export default Controller.extend({
  customQuery: Object.freeze({
    sort: 'name'
  }),

  actions: {
    createUser(name){
      this.store.createRecord('user', { name }).save();
    }
  }
});
